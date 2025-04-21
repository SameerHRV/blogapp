import React, { useState, useEffect } from "react";
import { useBlog } from "@/contexts/BlogContext";
import { useAuth } from "@/contexts/AuthContext";
import { Comment } from "@/services";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Trash2, Loader2 } from "lucide-react";
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
import { toast } from "sonner";

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const { getCommentsByPostId, addComment, deleteComment } = useBlog();
  const { isAuthenticated, user } = useAuth();
  const [guestAuthor, setGuestAuthor] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch comments when component mounts or postId changes
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const fetchedComments = await getCommentsByPostId(postId);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId, getCommentsByPostId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("CommentsSection: Submit button clicked");
    console.log("CommentsSection: Form data:", { content, guestAuthor, isAuthenticated });

    if (!content.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    // If not authenticated, require guest author name
    if (!isAuthenticated && !guestAuthor.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsSubmitting(true);

    try {
      const commentData: any = {
        postId,
        content: content.trim(),
      };

      console.log("CommentsSection: Initial comment data:", commentData);
      console.log("CommentsSection: Authentication state:", {
        isAuthenticated,
        token: !!localStorage.getItem("accessToken"),
      });

      // Always add guest author name if the field has a value
      if (guestAuthor.trim()) {
        commentData.guestAuthor = guestAuthor.trim();
        console.log("CommentsSection: Adding guest author to comment:", guestAuthor.trim());
      } else if (!isAuthenticated) {
        // Add a default guest author name if not authenticated and no name provided
        commentData.guestAuthor = "Guest Commenter";
        console.log("CommentsSection: Adding default guest author to comment");
      }

      console.log("CommentsSection: Final comment data:", commentData);

      const newComment = await addComment(commentData);

      // Update local comments state
      setComments((prev) => [newComment, ...prev]);
      setContent("");
      if (!isAuthenticated) {
        setGuestAuthor("");
      }
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug authentication state
  console.log("CommentsSection auth state:", {
    isAuthenticated,
    user: user ? { id: user._id, name: user.fullName } : null,
    token: localStorage.getItem("accessToken"),
    guestAuthor,
  });

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4">
        <h3 className="text-lg font-medium">Leave a comment</h3>

        {/* Always show author name input field */}
        <div>
          <Label htmlFor="guestAuthor">Your Name (required for guest comments)</Label>
          <Input
            id="guestAuthor"
            value={guestAuthor}
            onChange={(e) => setGuestAuthor(e.target.value)}
            placeholder="Enter your name"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">This field is required when commenting as a guest.</p>
        </div>

        <div>
          <Label htmlFor="content">Comment</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            required
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Post Comment"
          )}
        </Button>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} onDelete={() => deleteComment(comment._id)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
};

interface CommentItemProps {
  comment: Comment;
  onDelete: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete }) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium">
            {comment.guestAuthor
              ? comment.guestAuthor + " (Guest)"
              : typeof comment.author === "object"
              ? comment.author.fullName
              : comment.author}
          </h4>
          <p className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(comment.createdAt))} ago</p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete comment?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this comment.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Separator className="my-2" />

      <p className="whitespace-pre-wrap">{comment.content}</p>
    </div>
  );
};

export default CommentsSection;
