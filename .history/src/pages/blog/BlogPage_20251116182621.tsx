import { Link } from "react-router-dom";
import { useBlogs } from "@/context/blog/useBlogs";
import useAuth from "@/hooks/useAuth";
import type { BlogPost } from "@/types/blog";

const BlogPage = () => {
  const { blogs } = useBlogs();
  const { user } = useAuth();

  const approved = blogs.filter((b: BlogPost) => b.status === "aprobado");

  return (
    <section className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="section-title">Blog</h1>

        {user && (
          <Link
            to="/blog/create"
            className="btn-create-blog text-decoration-none"
          >
            <i className="bi bi-pencil-square me-2"></i>
            Crear Blog
          </Link>
        )}
      </div>

      {approved.length === 0 ? (
        <p>Aún no hay blogs publicados.</p>
      ) : (
        <div className="row g-4">
          {approved.map((post: BlogPost) => (
            <div key={post.id} className="col-12 col-md-6 col-lg-4">
              <Link
                to={`/blog/${post.id}`}
                className="text-decoration-none text-dark"
              >
                <div className="card h-100 shadow-sm">
                  {post.portada && (
                    <img
                      src={post.portada}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}

                  <div className="card-body">
                    <h5 className="card-title">{post.titulo}</h5>
                    <p className="text-muted">{post.descripcion}</p>
                    <p className="small">Por {post.autorNombre}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default BlogPage;
