import { useParams, Link } from "react-router-dom";
import { useBlogDetails } from "@/hooks/blog/useBlogDetails";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { Button } from "@/components/common";
import { resolveBlogCover } from "@/utils/blog/constants";

const BlogDetailPage = () => {
  const { id } = useParams();
  const { blog, comments, addComment, liked, toggleLike, likesCount } =
    useBlogDetails(id || "");
  const { isAuthenticated } = useAuth();

  const [text, setText] = useState("");

  if (!id || !blog)
    return <p className="container py-5">Blog no encontrado.</p>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addComment(text);
    setText("");
  };

  return (
    <main className="bg-cocoa-dark min-vh-100 py-5">
      <div className="container" style={{ maxWidth: "900px" }}>
        {/* TÍTULO */}
        <div className="mb-4">
          <Link to="/blog" className="text-white text-decoration-none hover-gold d-inline-flex align-items-center">
            <i className="bi bi-arrow-left me-2"></i>
            Volver a Blogs
          </Link>
        </div>
        <h1
          className="mb-3 font-title text-gold"
          style={{
            fontWeight: "700",
            fontSize: "clamp(2rem, 5vw, 3rem)",
          }}
        >
          {blog.titulo}
        </h1>

        {/* DESCRIPCIÓN & METADATOS */}
        <p className="text-white fs-5 mb-2">
          {blog.descripcion}
        </p>
        <p className="small text-white-50 mb-4">
          Por <strong className="text-gold">{blog.autorNombre}</strong> ·{" "}
          {new Date(blog.createdAt).toLocaleDateString()}
        </p>

      {/* PORTADA */}
      <img
        src={resolveBlogCover(blog.portada)}
        className="img-fluid rounded shadow-sm mb-4"
        style={{
          maxHeight: "420px",
          objectFit: "cover",
        width: "100%",
        }}
        alt={blog.titulo}
      />

      {/* CONTENIDO */}
      <div
        className="mb-5 text-premium-body"
        style={{
          whiteSpace: "pre-wrap",
          fontSize: "1.15rem",
          lineHeight: "1.8",
        }}
      >
        {blog.contenido}
      </div>

      {/* LIKE BTN SOLO CORAZÓN ❤️ */}
      <button
        onClick={toggleLike}
        className="btn p-0 d-flex align-items-center gap-2 mb-5"
        style={{
          background: "none",
          border: "none",
        }}
      >
        <span style={{ fontSize: "2rem" }}>{liked ? "❤️" : "🤍"}</span>
        <span className="h4 mb-0 text-white-50">{likesCount}</span>
      </button>

      {/* COMENTARIOS */}
      <section className="mt-5">
        <h3 className="mb-4 text-gold font-title">
          Comentarios
        </h3>

        {/* FORM COMENTAR */}
        {isAuthenticated ? (
          <form
            className="d-flex gap-2 align-items-center mb-5"
            onSubmit={handleSubmit}
          >
            <input
              className="form-control form-control-dark shadow-sm"
              placeholder="Escribe un comentario..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ borderRadius: "14px" }}
            />

            <Button type="submit" variant="mint" className="px-4 fw-bold">
              Publicar
            </Button>
          </form>
        ) : (
          <div className="alert bg-cocoa-glass text-white border-gold mb-4" role="alert">
            Debes iniciar sesión para comentar.
          </div>
        )}

        {/* LISTA COMENTARIOS */}
        {comments.length === 0 ? (
          <p className="text-white-50 fs-5">Sé el primero en comentar ✨</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {comments.map((c) => (
              <div
                key={c.id}
                className="p-3 shadow-sm card-cocoa"
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="fw-bold text-gold">{c.authorName}</span>
                    <small className="text-white-50">{new Date(c.createdAt).toLocaleString()}</small>
                </div>
                <p className="mb-0 text-white">{c.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>
      </div>
    </main>
  );
};

export default BlogDetailPage;
