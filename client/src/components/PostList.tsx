import React from "react";
import PostCard from "./PostCard";
import { Post } from "@/contexts/BlogContext";

interface PostListProps {
  posts: Post[];
  title?: string;
  emptyMessage?: string;
  compact?: boolean;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  title = "Recent Posts",
  emptyMessage = "No posts found",
  compact = false,
}) => {
  return (
    <div className="py-8">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div
          className={`grid gap-6 ${
            compact ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {posts.map((post) => (
            <PostCard key={post._id} post={post} compact={compact} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
