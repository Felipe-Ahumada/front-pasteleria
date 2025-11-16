import type { BlogPost, BlogStatus } from "@/types/blog";
import { loadBlogs, saveBlogs } from "@/utils/storage/blogStorage";

export const blogService = {
  getAll(): BlogPost[] {
    return loadBlogs();
  },

  create(post: BlogPost) {
    const all = loadBlogs();
    all.push(post);
    saveBlogs(all);
  },

  updateStatus(id: string, status: BlogStatus) {
    const all = loadBlogs().map(p =>
      p.id === id ? { ...p, status } : p
    );
    saveBlogs(all);
  },
};
