import { loadComments, saveComments } from "@/utils/storage/commentStorage";
import type { BlogComment } from "@/types/comment";

export const commentService = {
  getByBlogId(blogId: string) {
    return loadComments().filter((c) => c.blogId === blogId);
  },

  add(comment: BlogComment) {
    const comments = loadComments();
    comments.push(comment);
    saveComments(comments);
  },
};
