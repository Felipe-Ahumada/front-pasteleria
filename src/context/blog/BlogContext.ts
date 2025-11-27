import { createContext } from "react";
import type { BlogPost, BlogStatus } from "@/types/blog";

export type BlogContextType = {
  blogs: BlogPost[];
  createBlog: (post: BlogPost) => Promise<void>;
  updateStatus: (id: string, status: BlogStatus) => Promise<void>;
};

export const BlogContext = createContext<BlogContextType | null>(null);
