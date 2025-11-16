import type { BlogPost } from "@/types/blog";

const BLOG_KEY = "blog-posts-v1";

export const loadBlogs = (): BlogPost[] => {
  try {
    return JSON.parse(localStorage.getItem(BLOG_KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveBlogs = (posts: BlogPost[]) => {
  localStorage.setItem(BLOG_KEY, JSON.stringify(posts));
};
