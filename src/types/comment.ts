export type BlogComment = {
  id: string;
  blogId: string;

  authorId: string;
  authorName: string;

  content: string;

  createdAt: string;
};
