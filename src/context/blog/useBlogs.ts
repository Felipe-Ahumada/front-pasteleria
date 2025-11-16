import { useContext } from "react";
import { BlogContext } from "./BlogContext";

export const useBlogs = () => {
  const ctx = useContext(BlogContext);
  if (!ctx) {
    throw new Error("useBlogs debe usarse dentro de <BlogProvider>");
  }
  return ctx;
};
