import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useBlog } from "@/contexts/BlogContext";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Tag } from "@/services";

const TagCloud: React.FC = () => {
  const { getAllTags, getPostsByTag, tags } = useBlog();
  const [loading, setLoading] = useState(false);
  const [localTags, setLocalTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [getAllTags, tags]);

  if (loading) {
    return (
      <div className="p-4 bg-secondary/50 rounded-lg flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 bg-secondary/50 rounded-lg">
      <h3 className="font-semibold mb-3">Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {localTags.length > 0 ? (
          localTags.map((tag) => (
            <Link key={tag._id} to={`/tags/${tag.slug}`}>
              <Badge variant="outline" className="hover:bg-secondary transition-colors">
                #{tag.name} <span className="ml-1 text-muted-foreground">({tag.posts.length})</span>
              </Badge>
            </Link>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No tags found</p>
        )}
      </div>
    </div>
  );
};

export default TagCloud;
