import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { useBlogs } from "@/context/blog/useBlogs";
import { Button, Input } from "@/components/common";

const BlogCreatePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createPost } = useBlogs();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);

  if (!user) return <p className="container py-5">Debes iniciar sesión</p>;

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCoverImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPost = {
      id: crypto.randomUUID(),
      authorId: user.id,
      authorName: `${user.nombre} ${user.apellidos}`,
      title,
      description,
      content,
      coverImage,
      status: "pendiente" as const,
      createdAt: new Date().toISOString(),
    };

    createPost(newPost);
    navigate("/blog", { replace: true });
  };

  return (
    <main className="container py-5">
      <div className="card-soft p-4 shadow-sm">
        <h1 className="section-title">Crear nuevo blog</h1>

        <form className="mt-4" onSubmit={handleSubmit}>
          <Input
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Descripción breve"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label className="form-label fw-semibold mt-3">Contenido</label>
          <textarea
            className="form-control"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <label className="form-label fw-semibold mt-3">Imagen de portada</label>
          <input type="file" accept="image/*" className="form-control" onChange={handleImage} />

          {coverImage ? (
            <img
              src={coverImage}
              className="mt-3 rounded shadow"
              alt="Portada"
              width="200"
            />
          ) : null}

          <Button type="submit" variant="mint" className="mt-4">
            Publicar para aprobación
          </Button>
        </form>
      </div>
    </main>
  );
};

export default BlogCreatePage;
