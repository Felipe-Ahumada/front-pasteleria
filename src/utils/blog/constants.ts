export const DEFAULT_BLOG_COVER = "https://res.cloudinary.com/dx83p4455/image/upload/v1762268069/cheesecake_sin_azucar_dggxns.png";

const PLACEHOLDER_PATHS = new Set([
  "/images/blog/default.jpg",
  "images/blog/default.jpg",
]);

/**
 * Normaliza la URL de la portada de un blog y aplica un fallback conocido.
 */
export const resolveBlogCover = (value?: string | null): string => {
  const cover = (value ?? "").trim();
  if (!cover) {
    return DEFAULT_BLOG_COVER;
  }

  if (PLACEHOLDER_PATHS.has(cover)) {
    return DEFAULT_BLOG_COVER;
  }

  if (cover.startsWith("data:")) {
    return cover;
  }

  if (cover.startsWith("http://") || cover.startsWith("https://")) {
    return cover;
  }

  if (cover.startsWith("/")) {
    return cover;
  }

  if (cover.startsWith("./") || cover.startsWith("../")) {
    return cover;
  }

  return DEFAULT_BLOG_COVER;
};
