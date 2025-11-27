import apiClient from "@/config/axiosConfig";

export interface Producto {
  id: number;
  codigoProducto: string;
  nombre: string;
  precio: number;
  descripcion: string;
  imagenPrincipal: string;
  imagenesDetalle: string; // JSON string
  stock: number;
  stockCritico: number;
  categoria: {
    id: number;
    nombre: string;
  };
}

export interface Categoria {
  id: number;
  nombre: string;
  productos?: Producto[];
}

export const productoService = {
  async listarProductos(): Promise<Producto[]> {
    const { data } = await apiClient.get<Producto[]>("/productos");
    return data;
  },

  async obtenerProducto(id: number): Promise<Producto> {
    const { data } = await apiClient.get<Producto>(`/productos/${id}`);
    return data;
  },

  async obtenerProductosPorCategoria(categoriaId: number): Promise<Producto[]> {
    const { data } = await apiClient.get<Producto[]>(
      `/productos/categoria/${categoriaId}`
    );
    return data;
  },

  async crearProducto(producto: Omit<Producto, "id">): Promise<Producto> {
    const { data } = await apiClient.post<Producto>("/productos", producto);
    return data;
  },

  async actualizarProducto(
    id: number,
    producto: Partial<Producto>
  ): Promise<Producto> {
    const { data } = await apiClient.put<Producto>(
      `/productos/${id}`,
      producto
    );
    return data;
  },

  async eliminarProducto(id: number): Promise<void> {
    await apiClient.delete(`/productos/${id}`);
  },
};

export const categoriaService = {
  async listarCategorias(): Promise<Categoria[]> {
    const { data } = await apiClient.get<Categoria[]>("/categorias");
    return data;
  },

  async obtenerCategoria(id: number): Promise<Categoria> {
    const { data } = await apiClient.get<Categoria>(`/categorias/${id}`);
    return data;
  },
};
