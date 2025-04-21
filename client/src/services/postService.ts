import api from "@/lib/api";

export interface Post {
  _id: string;
  title: string;
  content: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  author?: {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
  guestAuthor?: string;
  tags: {
    _id: string;
    name: string;
    slug: string;
  }[];
  likes: string[];
  comments: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt: string;
  tags?: string[];
  coverImage?: File;
  isPublished?: boolean;
  guestAuthor?: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  excerpt?: string;
  tags?: string[];
  coverImage?: File;
  isPublished?: boolean;
  guestAuthor?: string;
}

export interface PostQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  author?: string;
}

export interface SubscriptionInfo {
  plan: string;
  isActive: boolean;
  remainingPosts: number;
  hasReachedLimit: boolean;
  validUntil?: string;
}

const postService = {
  // Get all posts
  getAllPosts: async (
    params: PostQueryParams = {}
  ): Promise<{
    posts: Post[];
    totalPosts: number;
    currentPage: number;
    totalPages: number;
    subscription?: SubscriptionInfo;
  }> => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.tag) queryParams.append("tag", params.tag);
    if (params.author) queryParams.append("author", params.author);

    const queryString = queryParams.toString();
    const endpoint = `/posts${queryString ? `?${queryString}` : ""}`;

    return api.get<{ posts: Post[]; total: number; page: number; limit: number }>(endpoint);
  },

  // Get post by slug
  getPostBySlug: async (slug: string): Promise<Post> => {
    return api.get<Post>(`/posts/${slug}`);
  },

  // Create post
  createPost: async (postData: CreatePostData): Promise<Post> => {
    // Debug log
    console.log("Creating post with data:", postData);

    if (postData.coverImage) {
      const formData = new FormData();
      formData.append("title", postData.title);
      formData.append("content", postData.content);
      formData.append("excerpt", postData.excerpt);

      if (postData.tags) {
        postData.tags.forEach((tag) => formData.append("tags", tag));
      }

      if (postData.isPublished !== undefined) {
        formData.append("isPublished", postData.isPublished.toString());
      }

      // Always add guest author field if it exists in the postData
      if (postData.guestAuthor) {
        console.log("Adding guest author to form data:", postData.guestAuthor);
        formData.append("guestAuthor", postData.guestAuthor);
      } else {
        // Add a default guest author if not authenticated (based on token)
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.log("Adding default guest author to form data");
          formData.append("guestAuthor", "Guest User");
        }
      }

      formData.append("coverImage", postData.coverImage);

      return api.upload<Post>("/posts/create-post", formData);
    } else {
      // Debug log for non-file upload
      console.log("Sending post data via JSON:", postData);

      // Ensure guest author is included if not authenticated
      if (!postData.guestAuthor) {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.log("Adding default guest author to JSON data");
          postData.guestAuthor = "Guest User";
        }
      }

      return api.post<Post>("/posts/create-post", postData);
    }
  },

  // Update post
  updatePost: async (id: string, postData: UpdatePostData): Promise<Post> => {
    if (postData.coverImage) {
      const formData = new FormData();

      if (postData.title) formData.append("title", postData.title);
      if (postData.content) formData.append("content", postData.content);
      if (postData.excerpt) formData.append("excerpt", postData.excerpt);

      if (postData.tags) {
        postData.tags.forEach((tag) => formData.append("tags", tag));
      }

      if (postData.isPublished !== undefined) {
        formData.append("isPublished", postData.isPublished.toString());
      }

      // Always add guest author field if it exists in the postData
      if (postData.guestAuthor) {
        console.log("Adding guest author to form data for update:", postData.guestAuthor);
        formData.append("guestAuthor", postData.guestAuthor);
      } else {
        // Add a default guest author if not authenticated (based on token)
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.log("Adding default guest author to form data for update");
          formData.append("guestAuthor", "Guest User");
        }
      }

      formData.append("coverImage", postData.coverImage);

      return api.upload<Post>(`/posts/${id}`, formData);
    } else {
      // Ensure guest author is included if not authenticated
      if (!postData.guestAuthor) {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.log("Adding default guest author to JSON data for update");
          postData.guestAuthor = "Guest User";
        }
      }

      return api.put<Post>(`/posts/${id}`, postData);
    }
  },

  // Delete post
  deletePost: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/posts/${id}`);
  },

  // Toggle like post
  toggleLikePost: async (id: string): Promise<Post> => {
    return api.post<Post>(`/posts/${id}/like`, {});
  },

  // Get subscription info
  getSubscriptionInfo: async (): Promise<SubscriptionInfo> => {
    const response = await api.get<{ subscription: SubscriptionInfo }>("/posts/subscription-info");
    return response.subscription;
  },
};

export default postService;
