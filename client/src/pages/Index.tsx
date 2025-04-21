import React from "react";
import BlogLayout from "@/components/BlogLayout";
import HeroSection from "@/components/HeroSection";
import PostList from "@/components/PostList";
import TagCloud from "@/components/TagCloud";
import { useBlog } from "@/contexts/BlogContext";

const Index: React.FC = () => {
  const { getPosts, getFeaturedPosts } = useBlog();
  const allPosts = getPosts();
  const featuredPosts = getFeaturedPosts();

  // Remove the first featured post (used in hero) from the featured list
  const otherFeaturedPosts = featuredPosts.slice(1);

  // Filter out featured posts from the recent posts list
  const recentPosts = allPosts.filter((post) => !featuredPosts.some((fp) => fp._id === post._id)).slice(0, 6);

  return (
    <BlogLayout>
      <HeroSection />

      <div className="blog-container">
        {otherFeaturedPosts.length > 0 && <PostList title="Featured Posts" posts={otherFeaturedPosts} compact />}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <PostList title="Recent Posts" posts={recentPosts} emptyMessage="No posts yet. Create your first post!" />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <TagCloud />
          </div>
        </div>
      </div>
    </BlogLayout>
  );
};

export default Index;
