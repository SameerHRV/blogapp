import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import { useBlog, Post } from "@/contexts/BlogContext";
import { useAuth } from "@/contexts/AuthContext";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import SubscriptionLimitAlert from "@/components/SubscriptionLimitAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ArrowLeft, Save, Trash2 } from "lucide-react";

const PostEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPostById, addPost, updatePost, deletePost, subscriptionInfo, getSubscriptionInfo } = useBlog();
  const { isAuthenticated, user } = useAuth();

  const isEditMode = !!id;
  const existingPost = isEditMode ? getPostById(id) : undefined;

  const [title, setTitle] = useState(existingPost?.title || "");
  const [content, setContent] = useState(existingPost?.content || "");
  const [excerpt, setExcerpt] = useState(existingPost?.excerpt || "");
  const [coverImage, setCoverImage] = useState(existingPost?.coverImage || "");
  const [guestAuthor, setGuestAuthor] = useState(existingPost?.guestAuthor || "");
  const [tagsString, setTagsString] = useState(existingPost?.tags?.join(", ") || "");
  const [activeTab, setActiveTab] = useState<string>("write");

  // Redirect if trying to edit a non-existent post
  useEffect(() => {
    if (isEditMode && !existingPost) {
      navigate("/");
    }

    // Fetch subscription info if not in edit mode
    if (!isEditMode) {
      getSubscriptionInfo();
    }

    // Debug authentication state
    console.log("Authentication state:", { isAuthenticated, user });
  }, [isEditMode, existingPost, navigate, getSubscriptionInfo, isAuthenticated, user]);

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!content.trim()) {
      alert("Please enter some content");
      return;
    }

    // If not authenticated, require guest author name
    if (!isAuthenticated && !guestAuthor.trim()) {
      alert("Please enter your name as the author");
      return;
    }

    const tags = tagsString
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag !== "");

    const postData: any = {
      title,
      content,
      excerpt: excerpt || content.substring(0, 150) + "...",
      tags,
      isPublished: true, // Default to published
    };

    // Always add guest author field if it has a value, regardless of authentication state
    if (guestAuthor.trim()) {
      postData.guestAuthor = guestAuthor.trim();
      console.log("PostEditor: Added guest author to postData:", postData.guestAuthor);
    } else if (!isAuthenticated) {
      // Force a default guest author name if not authenticated and no name provided
      postData.guestAuthor = "Guest User";
      console.log("PostEditor: Added default guest author name");
    } else {
      console.log("PostEditor: No guest author added. Auth state:", { isAuthenticated, guestAuthor });
    }

    // Only add coverImage if it's a URL (not handling file upload in this component)
    if (coverImage) {
      postData.coverImage = coverImage;
    }

    try {
      if (isEditMode && existingPost) {
        const updatedPost = await updatePost(existingPost._id, postData);
        navigate(`/post/${updatedPost._id}`);
      } else {
        const newPost = await addPost(postData as Omit<Post, "_id" | "createdAt" | "updatedAt">);
        navigate(`/post/${newPost._id}`);
      }
    } catch (error) {
      console.error("Error saving post:", error);
      // Error is already handled in the context
    }
  };

  const handleDelete = async () => {
    if (isEditMode && existingPost) {
      try {
        await deletePost(existingPost._id);
        navigate("/");
      } catch (error) {
        console.error("Error deleting post:", error);
        // Error is already handled in the context
      }
    }
  };

  const handleCancel = () => {
    if (isEditMode && existingPost) {
      navigate(`/post/${existingPost._id}`);
    } else {
      navigate("/");
    }
  };

  return (
    <BlogLayout>
      <div className="blog-container py-8 animate-fade-in">
        {!isEditMode && subscriptionInfo && (
          <SubscriptionLimitAlert
            plan={subscriptionInfo.plan}
            remainingPosts={subscriptionInfo.remainingPosts}
            maxPosts={5} // Free plan limit
            hasReachedLimit={subscriptionInfo.hasReachedLimit}
          />
        )}

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleCancel}
            className="inline-flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </button>

          <div className="flex gap-2">
            {isEditMode && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 text-destructive">
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the post "{title}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              <span>{isEditMode ? "Update" : "Publish"}</span>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="text-xl"
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tagsString}
              onChange={(e) => setTagsString(e.target.value)}
              placeholder="react, javascript, tutorial"
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt (optional)</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A short summary of your post"
              rows={2}
            />
            <p className="text-sm text-muted-foreground mt-1">
              If left empty, the first 150 characters of your post will be used.
            </p>
          </div>

          {/* Author name input - always visible */}
          <div>
            <Label htmlFor="guestAuthor">Your Name (required for guest posts)</Label>
            <Input
              id="guestAuthor"
              value={guestAuthor}
              onChange={(e) => setGuestAuthor(e.target.value)}
              placeholder="Enter your name"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">This field is required when posting as a guest author.</p>
          </div>

          <div>
            <Label htmlFor="coverImage">Cover Image URL (optional)</Label>
            <Input
              id="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="mt-0">
              <div>
                <Label htmlFor="content">Content (Markdown)</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content in Markdown..."
                  className="font-mono min-h-[400px] whitespace-pre-wrap"
                />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <div className="border rounded-md p-4 min-h-[400px]">
                <h1 className="text-2xl font-bold mb-4">{title || "Post Title"}</h1>
                {content ? (
                  <MarkdownRenderer content={content} />
                ) : (
                  <p className="text-muted-foreground">No content to preview</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </BlogLayout>
  );
};

export default PostEditor;
