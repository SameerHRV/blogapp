import api from "@/lib/api";

export interface Comment {
  _id: string;
  content: string;
  post: string;
  author?: {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
  guestAuthor?: string;
  parentComment: string | null;
  replies: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  postId: string;
  content: string;
  parentCommentId?: string;
  guestAuthor?: string;
}

export interface UpdateCommentData {
  content: string;
}

export interface CommentQueryParams {
  page?: number;
  limit?: number;
}

const commentService = {
  // Get comments for a post
  getPostComments: async (
    postId: string,
    params: CommentQueryParams = {}
  ): Promise<{ comments: Comment[]; total: number; page: number; limit: number }> => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = `/posts/${postId}/comments${queryString ? `?${queryString}` : ""}`;

    return api.get<{ comments: Comment[]; total: number; page: number; limit: number }>(endpoint);
  },

  // Create comment
  createComment: async (commentData: CreateCommentData): Promise<Comment> => {
    console.log("CommentService: Creating comment with data:", commentData);

    // Ensure guest author is included if not authenticated
    if (!commentData.guestAuthor) {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.log("CommentService: Adding default guest author");
        commentData.guestAuthor = "Guest Commenter";
      }
    }

    return api.post<Comment>("/comments", commentData);
  },

  // Update comment
  updateComment: async (id: string, commentData: UpdateCommentData): Promise<Comment> => {
    return api.put<Comment>(`/comments/${id}`, commentData);
  },

  // Delete comment
  deleteComment: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/comments/${id}`);
  },
};

export default commentService;
