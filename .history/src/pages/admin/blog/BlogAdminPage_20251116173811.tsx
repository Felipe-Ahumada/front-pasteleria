import { Button } from "@/components/common";
import { useBlogs } from "@/context/blog/useBlogs";

const BlogAdminPage = () => {
  const { posts, updateStatus } = useBlogs();

  const pending = posts.filter(p => p.status === "pendiente");

  return (
    <div className="container py-4">
      <h2 className="mb-4">Gestión de Blogs</h2>

      {pending.length === 0 ? (
        <p>No hay blogs pendientes.</p>
      ) : (
        <div className="row g-3">
          {pending.map(post => (
            <div key={post.id} className="col-12 col-md-6">
              <div className="card shadow-sm p-3">
                <h5>{post.title}</h5>
                <p className="text-muted">{post.description}</p>
                <p className="small">Autor: {post.authorName}</p>

                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt="portada"
                    className="rounded mb-3"
                    width="200"
                  />
                ) : null}

                <div className="d-flex gap-2">
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
