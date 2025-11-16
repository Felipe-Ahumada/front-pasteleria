import { Button } from "@/components/common";
import { useBlogs } from "@/context/blog/useBlogs";
import type { BlogPost } from "@/types/blog";

const BlogAdminPage = () => {
  const { blogs, updateStatus } = useBlogs();

  const pending = blogs.filter((b: BlogPost) => b.status === "pendiente");

  return (
    <div className="container py-4">
      <h2 className="mb-4">Gestión de Blogs</h2>

      {pending.length === 0 ? (
        <p>No hay blogs pendientes.</p>
      ) : (
        <div className="row g-3">
          {pending.map((post: BlogPost) => (
            <div key={post.id} className="col-12 col-md-6">
              <div className="card shadow-sm p-3 h-100">
                <h5>{post.titulo}</h5>
                <p className="text-muted">{post.descripcion}</p>
                <p className="small">Autor: {post.autorNombre}</p>

                {post.portada && (
                  <img
                    src={post.portada}
                    alt="Portada"
                    className="rounded mb-3"
                    style={{ width: "100%", height: "180px", objectFit: "cover" }}
                  />
                )}

                <div className="d-flex gap-2 mt-2">
                  <Button
                    variant="mint"
                    onClick={() => updateStatus(post.id, "aprobado")}
                  >
                    Aprobar
                  </Button>

                  <Button
                    variant="strawberry"
                    onClick={() => updateStatus(post.id, "rechazado")}
                  >
                    Rechazar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogAdminPage;
