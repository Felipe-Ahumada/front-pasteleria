import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { useBlogs } from "@/context/blog/useBlogs";
import { Button, Input } from "@/components/common";

const BlogCreatePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createBlog } = useBlogs();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [contenido, setContenido] = useState("");
  const [portada, setPortada] = useState<string | undefined>(undefined);

  if (!user) {
    return (
      <main className="bg-cocoa-dark min-vh-100 py-5">
        <div className="container text-center">
            <h2 className="text-gold mb-3">Acceso Denegado</h2>
            <p className="text-white">Debes iniciar sesión para crear un blog.</p>
        </div>
      </main>
    );
  }

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.7)); // Compress to 70% quality
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
        const compressedImage = await compressImage(file);
        setPortada(compressedImage);
    } catch (error) {
        console.error("Error compressing image:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newBlog = {
      id: crypto.randomUUID(),

      autorId: user.id,
      autorNombre: `${user.firstName} ${user.lastName}`,

      titulo,
      descripcion,
      contenido,
      portada,

      status: "pendiente" as const,
      createdAt: new Date().toISOString(),
    };

    await createBlog(newBlog);
    navigate("/blog", { replace: true });
  };

  return (
    <main className="bg-cocoa-dark min-vh-100 py-5">
      <div className="container">
        <div className="card-cocoa p-4 p-lg-5 shadow-lg" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="mb-4">
            <Link to="/blog" className="text-white text-decoration-none hover-gold d-inline-flex align-items-center">
              <i className="bi bi-arrow-left me-2"></i>
              Volver a Blogs
            </Link>
          </div>
          <h1 className="section-title text-gold text-center mb-4">Crear nuevo blog</h1>

          <form className="mt-4" onSubmit={handleSubmit}>
            <div className="mb-3">
                <Input
                label={<span className="text-white fw-semibold">Título</span>}
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                className="form-control-dark"
                placeholder="Ingresa un título atractivo..."
                />
            </div>

            <div className="mb-3">
                <Input
                label={<span className="text-white fw-semibold">Descripción breve</span>}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                className="form-control-dark"
                placeholder="Un resumen corto de tu historia..."
                />
            </div>

            <label className="form-label fw-semibold mt-3 text-white">Contenido</label>
            <textarea
              className="form-control form-control-dark"
              rows={8}
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              required
              placeholder="Escribe aquí todo tu contenido..."
            />

            <label className="form-label fw-semibold mt-4 text-white">
              Imagen de portada
            </label>
            <input
              type="file"
              accept="image/*"
              className="form-control form-control-dark"
              onChange={handleImage}
            />
            <div className="form-text text-white-50">Sube una imagen de alta calidad para tu portada.</div>

            {portada && (
              <div className="mt-3">
                  <img
                    src={portada}
                    className="rounded shadow border-gold"
                    alt="Portada"
                    width="100%"
                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                  />
              </div>
            )}

            <div className="d-grid mt-5">
                <Button type="submit" variant="mint" size="lg" className="fw-bold shadow-soft">
                    Publicar para aprobación
                </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default BlogCreatePage;
