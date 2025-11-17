import { LOCAL_STORAGE_KEYS } from "@/utils/storage/initLocalData";
import type { BlogPost } from "@/types/blog";

export const loadBlogs = (): BlogPost[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.blogs);
    return raw ? (JSON.parse(raw) as BlogPost[]) : [];
  } catch {
    return [];
  }
};

export const saveBlogs = (posts: BlogPost[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.blogs, JSON.stringify(posts));
};
