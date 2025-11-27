import apiClient from "@/config/axiosConfig";
import type { BlogPost, BlogStatus } from "@/types/blog";

export const blogService = {
  async getAll(): Promise<BlogPost[]> {
    const { data } = await apiClient.get<BlogPost[]>("/blogs");
    return data;
  },

  async create(blog: BlogPost): Promise<void> {
    // Exclude ID (backend generates it) and ensure autorId is string
    const { id, ...blogData } = blog;
    await apiClient.post("/blogs", {
      ...blogData,
      autorId: String(blogData.autorId),
    });
  },

  async updateStatus(id: string, status: BlogStatus): Promise<BlogPost> {
    const { data } = await apiClient.put<BlogPost>(
      `/blogs/${id}/status`,
      status,
      {
        headers: {
          "Content-Type": "text/plain", // Send as plain string
        },
      }
    );
    return data;
  },
};
