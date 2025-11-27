import { useState, useEffect } from "react";
import { commentService } from "@/service/commentService";
import { likeService } from "@/service/likeService";
import { useBlogs } from "@/context/blog/useBlogs";
import useAuth from "@/hooks/useAuth";
import type { BlogComment } from "@/types/comment";

export const useBlogDetails = (blogId: string) => {
  const { blogs } = useBlogs();
  const { user } = useAuth();

  const blog = blogs.find((b) => String(b.id) === blogId);

  const [comments, setComments] = useState<BlogComment[]>([]);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Cargar comentarios y likes
  useEffect(() => {
    const loadData = async () => {
      // Comments
      const blogComments = await commentService.getByBlogId(blogId);
      setComments(blogComments);

      // Likes count
      const count = await likeService.count(blogId);
      setLikesCount(count);

      // User like status
      if (user) {
        const likedStatus = await likeService.hasLiked(blogId);
        setLiked(likedStatus);
      }
    };

    loadData();
  }, [blogId, user]);

  const addComment = async (text: string) => {
    if (!user) return;

    const comment: BlogComment = {
      id: crypto.randomUUID(),
      blogId,
      authorId: user.id,
      authorName: `${user.name} ${user.lastName}`,
      content: text,
      createdAt: new Date().toISOString(),
    };

    const createdComment = await commentService.add(comment);
    setComments((prev) => [...prev, createdComment]);
  };

  const toggleLike = async () => {
    if (!user) return;
    try {
      const nowLiked = await likeService.toggleLike(blogId);
      setLiked(nowLiked);
      // Refresh count
      const count = await likeService.count(blogId);
      setLikesCount(count);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
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
