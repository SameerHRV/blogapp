import BlogLayout from "@/components/BlogLayout";
import PostList from "@/components/PostList";
import TagCloud from "@/components/TagCloud";
import { Button } from "@/components/ui/button";
import { useBlog } from "@/contexts/BlogContext";
import { ArrowLeft, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Post, Tag } from "@/services";

const TagsPage: React.FC = () => {
  const { tagName } = useParams<{ tagName: string }>();
  const { getAllTags, getPostsByTag, tags } = useBlog();
  const [loading, setLoading] = useState(false);
  const [localTags, setLocalTags] = useState<Tag[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

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

  useEffect(() => {
    const fetchPostsByTag = async () => {
      if (tagName) {
        setLoading(true);
        try {
          const fetchedPosts = await getPostsByTag(tagName);
          setPosts(fetchedPosts);
        } catch (error) {
          console.error("Error fetching posts by tag:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (tagName) {
      fetchPostsByTag();
    }
  }, [tagName, getPostsByTag]);

  if (loading) {
    return (
      <BlogLayout>
        <div className="blog-container py-8 animate-fade-in flex justify-center items-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </BlogLayout>
    );
  }

  // If a specific tag is provided, show posts for that tag
  if (tagName) {
    return (
      <BlogLayout>
        <div className="blog-container py-8 animate-fade-in">
          <Link to="/tags" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            All Tags
          </Link>

          <h1 className="text-3xl font-bold mb-6">#{tagName}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <PostList title="Posts" posts={posts} emptyMessage={`No posts found with the tag #${tagName}`} />
            </div>

            <div className="lg:col-span-1 space-y-6">
              <TagCloud />
            </div>
          </div>
        </div>
      </BlogLayout>
    );
  }

  // If no specific tag, show all tags
  return (
    <BlogLayout>
      <div className="blog-container py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Browse by Tags</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {localTags.map((tag) => (
            <Link key={tag._id} to={`/tags/${tag.slug}`}>
              <div className="border rounded-lg p-6 hover:bg-secondary/50 transition-colors h-full">
                <h2 className="text-xl font-semibold mb-2">#{tag.name}</h2>
                <p className="text-muted-foreground">
                  {tag.posts.length} {tag.posts.length === 1 ? "post" : "posts"}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {localTags.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No tags found</p>
            <Link to="/new">
              <Button>Create Your First Post</Button>
            </Link>
          </div>
        )}
      </div>
    </BlogLayout>
  );
};

export default TagsPage;
