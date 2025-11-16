import { useParams } from "react-router-dom";
import { useBlogDetails } from "@/hooks/blog/useBlogDetails";
import { Button} from "@/components/common";
import { useState } from "react";

const BlogDetailPage = () => {
  const { id } = useParams();
  if (!id) return <p>Blog no encontrado.</p>;

  const { blog, comments, addComment, liked, toggleLike, likesCount } =
    useBlogDetails(id);

  const [text, setText] = useState("");

  if (!blog) return <p className="container py-5">Blog no encontrado.</p>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addComment(text);
    setText("");
  };

  return (
    <main className="container py-5">
      <h1 className="mb-3">{blog.titulo}</h1>

      <p className="text-secondary mb-2">{blog.descripcion}</p>
      <p className="small text-muted">
        Por {blog.autorNombre} · {new Date(blog.createdAt).toLocaleDateString()}
      </p>

      {blog.portada && (
        <img
          src={blog.portada}
          className="img-fluid rounded mb-4"
          style={{ maxHeight: "400px", objectFit: "cover" }}
        />
      )}

      <div className="mb-5" style={{ whiteSpace: "pre-wrap" }}>
        {blog.contenido}
      </div>

      {/* Likes */}
      <Button variant="mint" onClick={toggleLike}>
        {liked ? "❤️ Ya no me gusta" : "🤍 Me gusta"} ({likesCount})
      </Button>

      {/* Comentarios */}
      <section className="mt-5">
        <h3>Comentarios</h3>

        <form className="mt-3 d-flex gap-2" onSubmit={handleSubmit}>
          <input
            className="form-control"
            placeholder="Escribe un comentario..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button type="submit" variant="mint">
            Publicar
          </Button>
        </form>

        <div className="mt-4">
          {comments.length === 0 ? (
            <p className="text-muted">Aún no hay comentarios</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="border rounded p-3 mb-2">
                <p className="fw-bold mb-1">{c.authorName}</p>
                <p className="mb-1">{c.content}</p>
                <p className="small text-muted mb-0">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default BlogDetailPage;
