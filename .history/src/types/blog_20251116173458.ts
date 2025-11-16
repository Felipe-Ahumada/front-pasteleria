export type BlogStatus = "pendiente" | "aprobado" | "rechazado";

export type BlogPost = {
  id: string;
  authorId: string;
  authorName: string;

  title: string;
  description: string;
  content: string;
  coverImage?: string; // base64

  createdAt: string;
  status: BlogStatus;
};
