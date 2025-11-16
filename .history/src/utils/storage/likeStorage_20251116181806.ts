const KEY = "likes-v1";

export type LikeRecord = {
  blogId: string;
  userId: string;
};

export const loadLikes = (): LikeRecord[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveLikes = (likes: LikeRecord[]) => {
  localStorage.setItem(KEY, JSON.stringify(likes));
};
