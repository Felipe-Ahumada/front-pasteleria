import { loadLikes, saveLikes} from "@/utils/storage/likeStorage";

export const likeService = {
  hasLiked(blogId: string, userId: string) {
    return loadLikes().some((l) => l.blogId === blogId && l.userId === userId);
  },

  toggleLike(blogId: string, userId: string) {
    const likes = loadLikes();

    const exists = likes.find(
      (l) => l.blogId === blogId && l.userId === userId
    );

    let updated;

    if (exists) {
      // quitar like
      updated = likes.filter(
        (l) => !(l.blogId === blogId && l.userId === userId)
      );
    } else {
      // agregar like
      updated = [...likes, { blogId, userId }];
    }

    saveLikes(updated);
    return !exists; // true si ahora está likeado
  },

  count(blogId: string) {
    return loadLikes().filter((l) => l.blogId === blogId).length;
  },
};
