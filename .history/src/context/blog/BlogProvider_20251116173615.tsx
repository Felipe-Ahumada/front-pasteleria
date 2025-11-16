import { useCallback, useState } from "react";
import { BlogContext } from "./BlogContext";
import type { BlogPost, BlogStatus } from "@/types/blog";
import { loadBlogs, saveBlogs } from "@/utils/storage/blogStorage";

export const BlogProvider = ({ children }: { children: React.ReactNode }) => {
  const [posts, setPosts] = useState<BlogPost[]>(() => loadBlogs());

  const createPost = useCallback((post: BlogPost) => {
    const updated = [...posts, post];
    setPosts(updated);
    saveBlogs(updated);
  }, [posts]);

  const updateStatus = useCallback((id: string, status: BlogStatus) => {
    const updated = posts.map(p =>
      p.id === id ? { ...p, status } : p
    );
    setPosts(updated);
    saveBlogs(updated);
  }, [posts]);

  return (
    <BlogContext.Provider value={{ posts, createPost, updateStatus }}>
      {children}
    </BlogContext.Provider>
  );
};
