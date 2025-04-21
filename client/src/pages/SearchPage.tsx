
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import PostList from "@/components/PostList";
import SearchBar from "@/components/SearchBar";
import TagCloud from "@/components/TagCloud";
import { useBlog } from "@/contexts/BlogContext";
import { Search } from "lucide-react";

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { searchPosts } = useBlog();
  const [results, setResults] = useState(searchPosts(query));
  
  useEffect(() => {
    setResults(searchPosts(query));
  }, [query, searchPosts]);
  
  return (
    <BlogLayout>
      <div className="blog-container py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <Search className="h-6 w-6" />
            Search Results
          </h1>
          <SearchBar className="max-w-2xl" />
          
          {query && (
            <p className="mt-4 text-muted-foreground">
              Found {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <PostList 
              title="" 
              posts={results} 
              emptyMessage={`No posts found for "${query}"`}
            />
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <TagCloud />
          </div>
        </div>
      </div>
    </BlogLayout>
  );
};

export default SearchPage;
