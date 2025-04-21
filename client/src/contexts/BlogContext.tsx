import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { postService, commentService, tagService, Post, Comment, Tag, SubscriptionInfo } from "@/services";

interface BlogContextType {
  posts: Post[];
  comments: Comment[];
  tags: Tag[];
  isLoading: boolean;
  subscriptionInfo: SubscriptionInfo | null;
  getPosts: () => Post[];
  getPostById: (id: string) => Post | undefined;
  getPostBySlug: (slug: string) => Promise<Post>;
  addPost: (post: {
    title: string;
    content: string;
    excerpt: string;
    tags?: string[];
    coverImage?: File;
    isPublished?: boolean;
    guestAuthor?: string;
  }) => Promise<Post>;
  updatePost: (
    id: string,
    post: {
      title?: string;
      content?: string;
      excerpt?: string;
      tags?: string[];
      coverImage?: File;
      isPublished?: boolean;
      guestAuthor?: string;
    }
  ) => Promise<Post>;
  deletePost: (id: string) => Promise<void>;
  getFeaturedPosts: () => Post[];
  toggleLikePost: (id: string) => Promise<Post>;
  getPostsByTag: (tag: string) => Promise<Post[]>;
  getAllTags: () => Promise<Tag[]>;
  searchPosts: (term: string) => Promise<Post[]>;
  getCommentsByPostId: (postId: string) => Promise<Comment[]>;
  addComment: (comment: {
    postId: string;
    content: string;
    parentCommentId?: string;
    guestAuthor?: string;
  }) => Promise<Comment>;
  updateComment: (id: string, content: string) => Promise<Comment>;
  deleteComment: (id: string) => Promise<void>;
  getSubscriptionInfo: () => Promise<SubscriptionInfo>;
  getRemainingPosts: () => number;
  hasReachedPostLimit: () => boolean;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
};

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        // Fetch posts
        const postsData = await postService.getAllPosts();
        setPosts(postsData.posts);

        // Set subscription info if available in posts response
        if (postsData.subscription) {
          setSubscriptionInfo(postsData.subscription);
        } else {
          // Try to fetch subscription info separately
          try {
            const subInfo = await postService.getSubscriptionInfo();
            setSubscriptionInfo(subInfo);
          } catch (subError) {
            console.error("Error fetching subscription info:", subError);
          }
        }

        // Fetch tags
        const tagsData = await tagService.getAllTags();
        setTags(tagsData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load blog data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const getPosts = () => {
    return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getPostById = (id: string) => {
    return posts.find((post) => post._id === id);
  };

  const getPostBySlug = async (slug: string) => {
    setIsLoading(true);
    try {
      const post = await postService.getPostBySlug(slug);
      return post;
    } catch (error) {
      console.error("Error fetching post by slug:", error);
      toast.error("Failed to load post");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addPost = async (postData: {
    title: string;
    content: string;
    excerpt: string;
    tags?: string[];
    coverImage?: File;
    isPublished?: boolean;
    guestAuthor?: string;
  }) => {
    setIsLoading(true);
    console.log("BlogContext: Adding post with data:", postData);
    try {
      const newPost = await postService.createPost(postData);
      console.log("BlogContext: Post created successfully:", newPost);
      setPosts((prev) => [newPost, ...prev]);
      toast.success("Post created successfully");
      return newPost;
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePost = async (
    id: string,
    postData: {
      title?: string;
      content?: string;
      excerpt?: string;
      tags?: string[];
      coverImage?: File;
      isPublished?: boolean;
      guestAuthor?: string;
    }
  ) => {
    setIsLoading(true);
    console.log("BlogContext: Updating post with data:", { id, postData });
    try {
      const updatedPost = await postService.updatePost(id, postData);
      console.log("BlogContext: Post updated successfully:", updatedPost);
      setPosts((prev) => prev.map((post) => (post._id === id ? updatedPost : post)));
      toast.success("Post updated successfully");
      return updatedPost;
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    setIsLoading(true);
    try {
      await postService.deletePost(id);
      setPosts((prev) => prev.filter((post) => post._id !== id));
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getFeaturedPosts = () => {
    // This is a client-side function that will need to be updated when we have a featured field in the API
    // For now, we'll just return the most recent posts
    return getPosts().slice(0, 3);
  };

  const toggleLikePost = async (id: string) => {
    try {
      const updatedPost = await postService.toggleLikePost(id);
      setPosts((prev) => prev.map((post) => (post._id === id ? updatedPost : post)));
      return updatedPost;
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to like post");
      throw error;
    }
  };

  const getPostsByTag = async (tagSlug: string) => {
    setIsLoading(true);
    try {
      const tag = await tagService.getTagBySlug(tagSlug);
      const postsData = await postService.getAllPosts({ tag: tag._id });
      return postsData.posts;
    } catch (error) {
      console.error("Error fetching posts by tag:", error);
      toast.error("Failed to load posts");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getAllTags = async () => {
    setIsLoading(true);
    try {
      const tagsData = await tagService.getAllTags();
      setTags(tagsData);
      return tagsData;
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast.error("Failed to load tags");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const searchPosts = async (term: string) => {
    if (!term.trim()) return [];

    setIsLoading(true);
    try {
      const postsData = await postService.getAllPosts({ search: term });
      return postsData.posts;
    } catch (error) {
      console.error("Error searching posts:", error);
      toast.error("Failed to search posts");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getCommentsByPostId = async (postId: string) => {
    setIsLoading(true);
    try {
      const commentsData = await commentService.getPostComments(postId);
      setComments(commentsData.comments);
      return commentsData.comments;
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async (commentData: {
    postId: string;
    content: string;
    parentCommentId?: string;
    guestAuthor?: string;
  }) => {
    console.log("BlogContext: Adding comment with data:", commentData);
    try {
      const newComment = await commentService.createComment(commentData);
      console.log("BlogContext: Comment created successfully:", newComment);
      setComments((prev) => [newComment, ...prev]);
      toast.success("Comment added successfully");
      return newComment;
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
      throw error;
    }
  };

  const updateComment = async (id: string, content: string) => {
    try {
      const updatedComment = await commentService.updateComment(id, { content });
      setComments((prev) => prev.map((comment) => (comment._id === id ? updatedComment : comment)));
      toast.success("Comment updated successfully");
      return updatedComment;
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment");
      throw error;
    }
  };

  const deleteComment = async (id: string) => {
    try {
      await commentService.deleteComment(id);
      setComments((prev) => prev.filter((comment) => comment._id !== id));
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
      throw error;
    }
  };

  const getSubscriptionInfo = async () => {
    try {
      const subInfo = await postService.getSubscriptionInfo();
      setSubscriptionInfo(subInfo);
      return subInfo;
    } catch (error) {
      console.error("Error fetching subscription info:", error);
      // Don't show toast to user, just set default values
      const defaultSubscription = {
        plan: "Free",
        isActive: false,
        remainingPosts: 0,
        hasReachedLimit: true,
      };
      setSubscriptionInfo(defaultSubscription);
      return defaultSubscription;
    }
  };

  const getRemainingPosts = () => {
    return subscriptionInfo?.remainingPosts || 0;
  };

  const hasReachedPostLimit = () => {
    return subscriptionInfo?.hasReachedLimit || false;
  };

  const value = {
    posts,
    comments,
    tags,
    isLoading,
    subscriptionInfo,
    getPosts,
    getPostById,
    getPostBySlug,
    addPost,
    updatePost,
    deletePost,
    getFeaturedPosts,
    toggleLikePost,
    getPostsByTag,
    getAllTags,
    searchPosts,
    getCommentsByPostId,
    addComment,
    updateComment,
    deleteComment,
    getSubscriptionInfo,
    getRemainingPosts,
    hasReachedPostLimit,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};
