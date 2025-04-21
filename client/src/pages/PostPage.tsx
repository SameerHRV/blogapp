import BlogLayout from "@/components/BlogLayout";
import CommentsSection from "@/components/CommentsSection";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import PostStats from "@/components/PostStats";
import SocialShare from "@/components/SocialShare";
import TagCloud from "@/components/TagCloud";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useBlog } from "@/contexts/BlogContext";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Edit, Star, StarOff, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPostById, deletePost, toggleFeatured } = useBlog();
  const { user } = useAuth();

  const post = getPostById(id || "");

  useEffect(() => {
    if (post) {
      // Track post view
      // incrementViews(post._id);

      // Set document title
      document.title = `${post.title} | Dreamy Blog`;
    }

    return () => {
      // Reset title when leaving the page
      document.title = "Dreamy Blog";
    };
  }, [post]);

  if (!post) {
    return (
      <BlogLayout>
        <div className="blog-container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="mb-6">The post you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </BlogLayout>
    );
  }

  const handleDelete = async () => {
    try {
      // Check if the user is the author before attempting to delete
      if (user && post.author && typeof post.author === "object" && user._id === post.author._id) {
        await deletePost(post._id);
        navigate("/");
      } else {
        toast.error("You are not authorized to delete this post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      // Error is already handled in the context
    }
  };

  return (
    <BlogLayout>
      <article className="animate-fade-in">
        <div className="bg-secondary/50 py-12">
          <div className="blog-container">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

            <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
              <PostStats
                author={post.author}
                guestAuthor={post.guestAuthor}
                views={post.views || 0}
                createdAt={post.createdAt}
                updatedAt={post.updatedAt}
              />

              <div className="flex gap-2">
                {/* Only show edit/delete buttons if the user is the author of the post */}
                {user && post.author && typeof post.author === "object" && user._id === post.author._id ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeatured(post._id)}
                      className="flex items-center gap-2"
                    >
                      {post.featured ? (
                        <>
                          <StarOff className="h-4 w-4" />
                          <span>Unfeature</span>
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4" />
                          <span>Feature</span>
                        </>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/edit/${post._id}`)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the post "{post.title}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <div className="text-muted-foreground text-sm flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Only the author can edit or delete this post</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {post.tags &&
                post.tags.map((tag) => (
                  <Link
                    key={typeof tag === "object" ? tag._id : tag}
                    to={`/tags/${typeof tag === "object" ? tag.slug : tag}`}
                  >
                    <Badge variant="outline" className="hover:bg-secondary transition-colors">
                      #{typeof tag === "object" ? tag.name : tag}
                    </Badge>
                  </Link>
                ))}
            </div>
          </div>
        </div>

        {post.coverImage && (
          <div className="blog-container py-8">
            <div className="w-full h-[400px] rounded-lg overflow-hidden">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        <div className="blog-container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <MarkdownRenderer content={post.content} />

              <Separator className="my-8" />

              <SocialShare title={post.title} url={window.location.href} />

              <CommentsSection postId={post._id} />
            </div>

            <div className="lg:col-span-1 space-y-6">
              <TagCloud />
            </div>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
};

export default PostPage;
