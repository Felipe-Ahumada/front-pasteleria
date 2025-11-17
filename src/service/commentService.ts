import { loadComments, saveComments } from "@/utils/storage/commentStorage";
import type { BlogComment } from "@/types/comment";

export const commentService = {
  getAll() {
    return loadComments();
  },

  getByBlogId(blogId: string) {
    return loadComments().filter((c) => c.blogId === blogId);
  },

  add(comment: BlogComment) {
    const comments = loadComments();
    comments.push(comment);
    saveComments(comments);
  },

  remove(commentId: string) {
    const updated = loadComments().filter((comment) => comment.id !== commentId);
    saveComments(updated);
    return updated;
  },
};
