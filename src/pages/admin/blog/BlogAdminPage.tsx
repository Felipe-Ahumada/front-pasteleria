import { useState } from "react";
import { Button } from "@/components/common";
import { useBlogs } from "@/context/blog/useBlogs";
import type { BlogPost } from "@/types/blog";

const BlogAdminPage = () => {
  const { blogs, updateStatus } = useBlogs();

  // Solo blogs pendientes
  const pending = blogs.filter((b: BlogPost) => b.status === "pendiente");

  // Blog seleccionado para ver en popup
  const [selected, setSelected] = useState<BlogPost | null>(null);

  const handleApprove = async () => {
    if (!selected) return;
    await updateStatus(selected.id, "aprobado");
    setSelected(null); // cerrar popup
  };

  const handleReject = async () => {
    if (!selected) return;
    await updateStatus(selected.id, "rechazado");
    setSelected(null); // cerrar popup
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Gestión de Blogs</h2>

      {pending.length === 0 ? (
        <p>No hay blogs pendientes.</p>
      ) : (
        <div className="row g-3">
          {pending.map((post: BlogPost) => (
            <div key={post.id} className="col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm p-3 h-100">
                <h5 className="fw-bold">{post.titulo}</h5>
                <p className="text-muted small mb-1">{post.descripcion}</p>
                <p className="small text-secondary mb-0">
                  Autor: {post.autorNombre}
                </p>

                <Button
                  variant="mint"
                  className="mt-3 w-100"
                  onClick={() => setSelected(post)}
                >
                  Ver propuesta
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup tipo modal */}
      {selected && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.45)", zIndex: 1050 }}
        >
          <div
            className="bg-white rounded-4 shadow p-4"
            style={{
              maxWidth: "720px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h3 className="fw-bold mb-2">{selected.titulo}</h3>

            <p className="small text-secondary mb-3">
              Autor: {selected.autorNombre} ·{" "}
              {new Date(selected.createdAt).toLocaleDateString("es-CL")}
            </p>

            {selected.portada && (
              <img
                src={selected.portada}
                alt="Portada"
                className="img-fluid rounded mb-3"
                style={{
                  maxHeight: "260px",
                  objectFit: "cover",
                  width: "100%",
                }}
              />
            )}

            <p className="text-muted mb-3">{selected.descripcion}</p>

            <div className="mb-4" style={{ whiteSpace: "pre-wrap" }}>
              {selected.contenido}
            </div>

            <div className="d-flex flex-wrap gap-2">
              <Button variant="mint" onClick={handleApprove}>
                Aprobar
              </Button>

              <Button variant="strawberry" onClick={handleReject}>
                Rechazar
              </Button>

              <Button variant="mint" onClick={() => setSelected(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogAdminPage;
