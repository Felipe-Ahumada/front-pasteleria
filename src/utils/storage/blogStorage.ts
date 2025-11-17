import { LOCAL_STORAGE_KEYS } from "@/utils/storage/initLocalData";
import type { BlogPost } from "@/types/blog";
import { resolveBlogCover } from "@/utils/blog/constants";

export const loadBlogs = (): BlogPost[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.blogs);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as Array<BlogPost & { fecha?: string }>;

    return parsed.map((post) => ({
      ...post,
      createdAt:
        typeof post.createdAt === "string" && post.createdAt
          ? post.createdAt
          : typeof post.fecha === "string" && post.fecha
          ? post.fecha
          : new Date().toISOString(),
      portada: resolveBlogCover(post.portada),
    }));
  } catch {
    return [];
  }
};

export const saveBlogs = (posts: BlogPost[]) => {
  const normalized = posts.map((post) => ({
    ...post,
    portada: resolveBlogCover(post.portada),
  }));

  localStorage.setItem(
    LOCAL_STORAGE_KEYS.blogs,
    JSON.stringify(normalized)
  );
};
