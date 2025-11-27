import { useCallback, useEffect, useState } from "react";
import { BlogContext } from "./BlogContext";
import type { BlogPost, BlogStatus } from "@/types/blog";
import { blogService } from "@/service/blogService";

export const BlogProvider = ({ children }: { children: React.ReactNode }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  const fetchBlogs = useCallback(async () => {
    try {
      const data = await blogService.getAll();
      setBlogs(data);
    } catch (error) {
      console.error("Error loading blogs:", error);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const createBlog = useCallback(
    async (post: BlogPost) => {
      try {
        await blogService.create(post);
        await fetchBlogs(); // Refresh list
      } catch (error) {
        console.error("Error creating blog:", error);
      }
    },
    [fetchBlogs]
  );

  const updateStatus = useCallback(
    async (id: string, status: BlogStatus) => {
      try {
        await blogService.updateStatus(id, status);
        await fetchBlogs(); // Refresh list
      } catch (error) {
        console.error("Error updating blog status:", error);
      }
    },
    [fetchBlogs]
  );

  return (
    <BlogContext.Provider value={{ blogs, createBlog, updateStatus }}>
      {children}
    </BlogContext.Provider>
  );
};
