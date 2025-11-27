import apiClient from "@/config/axiosConfig";
import type { BlogComment } from "@/types/comment";

export const commentService = {
  async getAll(): Promise<BlogComment[]> {
    const { data } = await apiClient.get<any[]>("/comentarios");
    return data.map(mapBackendToFrontend);
  },

  async getByBlogId(blogId: string): Promise<BlogComment[]> {
    const { data } = await apiClient.get<any[]>(`/comentarios/blog/${blogId}`);
    return data.map(mapBackendToFrontend);
  },

  async add(comment: BlogComment): Promise<BlogComment> {
    const backendComment = mapFrontendToBackend(comment);
    const { data } = await apiClient.post<any>("/comentarios", backendComment);
    return mapBackendToFrontend(data);
  },

  async remove(commentId: string): Promise<void> {
    await apiClient.delete(`/comentarios/${commentId}`);
  },
};

// Mappers
const mapBackendToFrontend = (backendComment: any): BlogComment => {
  return {
    id: backendComment.id.toString(),
    blogId: backendComment.blogId,
    authorId: backendComment.authorId,
    authorName: backendComment.authorName,
    content: backendComment.content,
    createdAt: backendComment.createdAt,
  };
};

const mapFrontendToBackend = (comment: BlogComment): any => {
  return {
    blogId: comment.blogId,
    authorId: comment.authorId,
    authorName: comment.authorName,
    content: comment.content,
  };
};
