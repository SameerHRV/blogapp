import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { useBlog } from "@/contexts/BlogContext";
import { Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tag } from "@/services";

interface SearchBarProps {
  className?: string;
  variant?: "simple" | "command";
}

const SearchBar: React.FC<SearchBarProps> = ({ className = "", variant = "simple" }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { getAllTags, tags } = useBlog();
  const navigate = useNavigate();
  const [localTags, setLocalTags] = useState<Tag[]>([]);

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        // First check if we already have tags in the context
        if (tags && tags.length > 0) {
          setLocalTags(tags);
        } else {
          // Otherwise fetch them
          const fetchedTags = await getAllTags();
          setLocalTags(fetchedTags);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, [getAllTags, tags]);

  // Register keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
  };

  if (variant === "command") {
    return (
      <>
        <Button
          variant="outline"
          className={`w-full justify-between text-muted-foreground ${className}`}
          onClick={() => setOpen(true)}
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Search posts...</span>
          </div>
          <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Search posts, tags..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {localTags.slice(0, 5).map((tag) => (
                <CommandItem
                  key={tag._id}
                  onSelect={() => {
                    navigate(`/tags/${tag.slug}`);
                    setOpen(false);
                  }}
                >
                  <span>#{tag.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Recent Searches">
              <CommandItem
                onSelect={() => {
                  navigate("/search?q=react");
                  setOpen(false);
                }}
              >
                <span>react</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  navigate("/search?q=css");
                  setOpen(false);
                }}
              >
                <span>css</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    );
  }

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <Input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pr-16"
      />
      {searchTerm && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-8 top-0 h-full"
          onClick={() => setSearchTerm("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default SearchBar;
