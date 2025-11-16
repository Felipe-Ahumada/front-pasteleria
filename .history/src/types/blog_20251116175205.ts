export type BlogStatus = "pendiente" | "aprobado" | "rechazado";

export type BlogPost = {
  id: string;

  autorId: string;
  autorNombre: string;

  titulo: string;
  descripcion: string;
  contenido: string;
  portada?: string; 

  createdAt: string;
  status: BlogStatus;
};
