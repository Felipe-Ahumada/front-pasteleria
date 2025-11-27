import apiClient from "@/config/axiosConfig";

export const likeService = {
  async hasLiked(blogId: string): Promise<boolean> {
    try {
      const { data } = await apiClient.get<boolean>(
        `/blogs/${blogId}/likes/status`
      );
      return data;
    } catch (error) {
      // If 401/403 (not logged in), return false
      return false;
    }
  },

  async toggleLike(blogId: string): Promise<boolean> {
    const { data } = await apiClient.post<boolean>(`/blogs/${blogId}/like`);
    return data;
  },

  async count(blogId: string): Promise<number> {
    try {
      const { data } = await apiClient.get<number>(
        `/blogs/${blogId}/likes/count`
      );
      return data;
    } catch (error) {
      console.error("Error counting likes:", error);
      return 0;
    }
  },
};
