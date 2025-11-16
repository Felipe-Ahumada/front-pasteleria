import type { BlogComment } from "@/types/comment";

const KEY = "comments-v1";

export const loadComments = (): BlogComment[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveComments = (comments: BlogComment[]) => {
  localStorage.setItem(KEY, JSON.stringify(comments));
};
