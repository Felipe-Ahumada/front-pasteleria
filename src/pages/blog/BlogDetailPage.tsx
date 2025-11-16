import { useParams } from "react-router-dom";
import { useBlogDetails } from "@/hooks/blog/useBlogDetails";
import { useState } from "react";
import { Button } from "@/components/common";

const BlogDetailPage = () => {
  const { id } = useParams();
  const { blog, comments, addComment, liked, toggleLike, likesCount } =
    useBlogDetails(id || "");

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
    <main className="container py-5" style={{ maxWidth: "900px" }}>
      {/* TÍTULO */}
      <h1
        className="mb-3"
        style={{
          fontSize: "2.4rem",
          fontWeight: "700",
          color: "#d17ca7",
        }}
      >
        {blog.titulo}
      </h1>

      {/* DESCRIPCIÓN & METADATOS */}
      <p className="text-secondary" style={{ fontSize: "1.1rem" }}>
        {blog.descripcion}
      </p>
      <p className="small text-muted mb-4">
        Por <strong>{blog.autorNombre}</strong> ·{" "}
        {new Date(blog.createdAt).toLocaleDateString()}
      </p>

      {/* PORTADA */}
      {blog.portada && (
        <img
          src={blog.portada}
          className="img-fluid rounded shadow-sm mb-4"
          style={{
            maxHeight: "420px",
            objectFit: "cover",
            width: "100%",
          }}
        />
      )}

      {/* CONTENIDO */}
      <div
        className="mb-5"
        style={{
          whiteSpace: "pre-wrap",
          fontSize: "1.15rem",
          lineHeight: "1.7",
        }}
      >
        {blog.contenido}
      </div>

      {/* LIKE BTN SOLO CORAZÓN ❤️ */}
      <button
        onClick={toggleLike}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "2rem",
        }}
      >
        {liked ? "❤️" : "🤍"}{" "}
        <span style={{ fontSize: "1.3rem", color: "#888" }}>
          {likesCount}
        </span>
      </button>

      {/* COMENTARIOS */}
      <section className="mt-5">
        <h3 className="mb-3" style={{ color: "#d17ca7" }}>
          Comentarios
        </h3>

        {/* FORM COMENTAR */}
        <form
          className="d-flex gap-2 align-items-center mb-4"
          onSubmit={handleSubmit}
        >
          <input
            className="form-control shadow-sm"
            placeholder="Escribe un comentario..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ borderRadius: "14px" }}
          />

          <Button type="submit" variant="mint">
            Publicar
          </Button>
        </form>

        {/* LISTA COMENTARIOS */}
        {comments.length === 0 ? (
          <p className="text-muted">Sé el primero en comentar ✨</p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="p-3 mb-3 shadow-sm"
              style={{
                background: "white",
                borderRadius: "12px",
              }}
            >
              <p className="fw-bold mb-1">{c.authorName}</p>
              <p className="mb-1">{c.content}</p>
              <p className="small text-muted">
                {new Date(c.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default BlogDetailPage;
