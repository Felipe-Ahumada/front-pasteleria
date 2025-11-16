import { useCallback, useState } from "react";
import { BlogContext } from "./BlogContext";
import type { BlogPost, BlogStatus } from "@/types/blog";
import { loadBlogs, saveBlogs } from "@/utils/storage/blogStorage";

export const BlogProvider = ({ children }: { children: React.ReactNode }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>(() => loadBlogs());

  const createBlog = useCallback((post: BlogPost) => {
    const updated = [...blogs, post];
    setBlogs(updated);
    saveBlogs(updated);
  }, [blogs]);

  const updateStatus = useCallback((id: string, status: BlogStatus) => {
    const updated = blogs.map(b =>
      b.id === id ? { ...b, status } : b
    );
    setBlogs(updated);
    saveBlogs(updated);
  }, [blogs]);

  return (
    <BlogContext.Provider value={{ blogs, createBlog, updateStatus }}>
      {children}
    </BlogContext.Provider>
  );
};

