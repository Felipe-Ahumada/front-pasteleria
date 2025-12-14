import { Link } from "react-router-dom";
import { useBlogs } from "@/context/blog/useBlogs";
import useAuth from "@/hooks/useAuth";
import type { BlogPost } from "@/types/blog";
import { resolveBlogCover } from "@/utils/blog/constants";

const BLOG_HERO_IMAGE =
  "https://res.cloudinary.com/dx83p4455/image/upload/v1762263515/carrusel_blog_knmeix.jpg";

const BlogPage = () => {
  const { blogs } = useBlogs();
  const { user } = useAuth();

  const approved = blogs.filter((b: BlogPost) => b.status === "aprobado");

  return (
    <main className="p-0">
      {/* Hero Section */}
      <div
        className="about-hero"
        style={{ backgroundImage: `url(${BLOG_HERO_IMAGE})` }}
      >
        <div className="about-hero-content">
          <h1 className="about-hero-title">BLOGS</h1>
        </div>

        <div className="about-sidebar-decoration">
          <a
            href="https://www.instagram.com/pasteleria1000sabores"
            target="_blank"
            rel="noreferrer"
            className="about-sidebar-link"
          >
            <i className="bi bi-instagram"></i>
            <span>Síguenos</span>
          </a>
          <div className="about-sidebar-line"></div>
        </div>
      </div>

      <section className="bg-cocoa-dark py-5">
        <div
          className="container"
          style={{ animation: "fadeInUp 0.8s ease-out" }}
        >
          {/* Header Row */}
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div className="bg-cocoa-glass px-4 py-2 rounded-pill border-gold">
              <h2 className="text-gold m-0 h4">Últimas Publicaciones</h2>
            </div>

            {user && (
              <Link
                to="/blog/create"
                className="btn btn-gold fw-bold shadow-soft"
              >
                <i className="bi bi-pencil-square me-2"></i>
                Crear Blog
              </Link>
            )}
          </div>

          {/* Content Grid */}
          {approved.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-premium-body fs-5">
                Aún no hay blogs publicados. ¡Sé el primero!
              </p>
            </div>
          ) : (
            <div className="row g-4">
              {approved.map((post: BlogPost, index) => (
                <div
                  key={post.id}
                  className="col-12 col-md-6 col-lg-4"
                  style={{
                    animation: `fadeInUp 0.6s ease-out forwards`,
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0,
                  }}
                >
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-decoration-none"
                  >
                    <div className="card bg-cocoa-glass border-gold h-100 product-card shadow-lg">
                      <div className="ratio ratio-16x9">
                        <img
                          src={resolveBlogCover(post.portada)}
                          className="w-100 h-100 object-fit-cover rounded-top-4"
                          alt={post.titulo}
                        />
                      </div>
                      <div className="card-body p-4 d-flex flex-column">
                        <h5 className="card-title text-gold fw-bold mb-3">
                          {post.titulo}
                        </h5>
                        <p
                          className="text-premium-body small mb-4 flex-grow-1"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {post.descripcion}
                        </p>
                        <div className="d-flex justify-content-between align-items-center mt-auto border-top border-secondary pt-3">
                          <span className="text-white-50 small">
                            <i className="bi bi-person-circle me-2"></i>
                            {post.autorNombre}
                          </span>
                          <span className="text-gold small fw-bold">
                            Leer más <i className="bi bi-arrow-right ms-1"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default BlogPage;
