import api from "@/lib/api";

export interface Tag {
  _id: string;
  name: string;
  slug: string;
  posts: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagData {
  name: string;
}

const tagService = {
  // Get all tags
  getAllTags: async (): Promise<Tag[]> => {
    return api.get<Tag[]>("/tags");
  },
  
  // Get tag by slug
  getTagBySlug: async (slug: string): Promise<Tag> => {
    return api.get<Tag>(`/tags/${slug}`);
  },
  
  // Create tag (admin only)
  createTag: async (tagData: CreateTagData): Promise<Tag> => {
    return api.post<Tag>("/tags", tagData);
  },
  
  // Delete tag (admin only)
  deleteTag: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/tags/${id}`);
  },
};

export default tagService;
