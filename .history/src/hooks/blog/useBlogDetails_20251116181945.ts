import { useState, useEffect } from "react";
import { commentService } from "@/service/commentService";
import { likeService } from "@/service/likeService";
import { useBlogs } from "@/context/blog/useBlogs";
import useAuth from "@/hooks/useAuth";
import type { BlogComment } from "@/types/comment";

export const useBlogDetails = (blogId: string) => {
  const { blogs } = useBlogs();
  const { user } = useAuth();

  const blog = blogs.find((b) => b.id === blogId);

  const [comments, setComments] = useState<BlogComment[]>([]);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Cargar comentarios y likes
  useEffect(() => {
    setComments(commentService.getByBlogId(blogId));
    if (user) {
      setLiked(likeService.hasLiked(blogId, user.id));
    }
    setLikesCount(likeService.count(blogId));
  }, [blogId, user]);

  const addComment = (text: string) => {
    if (!user) return;

    const comment: BlogComment = {
      id: crypto.randomUUID(),
      blogId,
      authorId: user.id,
      authorName: `${user.name} ${user.lastName}`,
      content: text,
      createdAt: new Date().toISOString(),
    };

    commentService.add(comment);
    setComments((prev) => [...prev, comment]);
  };

  const toggleLike = () => {
    if (!user) return;
    const nowLiked = likeService.toggleLike(blogId, user.id);
    setLiked(nowLiked);
    setLikesCount(likeService.count(blogId));
  };

  return {
    blog,
    comments,
    addComment,
    liked,
    toggleLike,
    likesCount,
  };
};
