import { createContext } from "react";
import type { BlogPost, BlogStatus } from "@/types/blog";

export type BlogContextType = {
  blogs: BlogPost[];
  createBlog: (post: BlogPost) => void;
  updateStatus: (id: string, status: BlogStatus) => void;
};

export const BlogContext = createContext<BlogContextType | null>(null);
