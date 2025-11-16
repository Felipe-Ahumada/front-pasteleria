import { Link } from "react-router-dom";
import { useBlogs } from "@/context/blog/useBlogs";
import useAuth from "@/hooks/useAuth";

const BlogPage = () => {
  const { posts } = useBlogs();
  const { user } = useAuth();

  const approved = posts.filter((p) => p.status === "aprobado");

  return (
    <section className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="section-title">Blog</h1>

        {user ? (
          <Link to="/blog/create" className="btn-create-blog-outline">
            + Crear Blog
          </Link>
        ) : null}
      </div>

      {approved.length === 0 ? (
        <p>Aún no hay blogs publicados.</p>
      ) : (
        <div className="row g-4">
          {approved.map((p) => (
            <div key={p.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                {p.coverImage ? (
                  <img
                    src={p.coverImage}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                ) : null}

                <div className="card-body">
                  <h5 className="card-title">{p.title}</h5>
                  <p className="text-muted">{p.description}</p>
                  <p className="small">Por {p.authorName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default BlogPage;
