import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    return <p className="container py-5">Debes iniciar sesión</p>;
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPortada(reader.result);
    };
    reader.readAsDataURL(file);
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
    <main className="container py-5">
      <div className="card-soft p-4 shadow-sm">
        <h1 className="section-title">Crear nuevo blog</h1>

        <form className="mt-4" onSubmit={handleSubmit}>
          <Input
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />

          <Input
            label="Descripción breve"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />

          <label className="form-label fw-semibold mt-3">Contenido</label>
          <textarea
            className="form-control"
            rows={6}
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            required
          />

          <label className="form-label fw-semibold mt-3">
            Imagen de portada
          </label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleImage}
          />

          {portada && (
            <img
              src={portada}
              className="mt-3 rounded shadow"
              alt="Portada"
              width="200"
            />
          )}

          <Button type="submit" variant="mint" className="mt-4">
            Publicar para aprobación
          </Button>
        </form>
      </div>
    </main>
  );
};

export default BlogCreatePage;
