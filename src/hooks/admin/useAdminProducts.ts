// useAdminProducts.ts
import { useCallback, useEffect, useState } from "react";
import { menuService, type Producto } from "@/service/menuService";

import { exportCSV, exportExcel, exportPDF } from "@/utils/exporters";

export const useAdminProducts = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [search, setSearch] = useState("");

  // -------------------------
  // CARGAR PRODUCTOS
  // -------------------------
  const cargarProductos = useCallback(async () => {
    setCargando(true);
    try {
      const data = await menuService.getAll();
      setProductos(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  // -------------------------
  // CRUD (delegado al service)
  // -------------------------
  const crearProducto = async (nuevo: Producto) => {
    await menuService.create(nuevo);
    cargarProductos();
  };

  const actualizarProducto = async (id: string, data: Producto) => {
    await menuService.update(id, data);
    cargarProductos();
  };

  const bloquearProducto = async (id: string) => {
    await menuService.block(id);
    cargarProductos();
  };

  const desbloquearProducto = async (id: string) => {
    await menuService.unblock(id);
    cargarProductos();
  };

  // -------------------------
  // EXPORTACIONES
  // -------------------------
  const exportarCSV = () => exportCSV(productos);
  const exportarExcel = () => exportExcel(productos);
  const exportarPDF = () => exportPDF(productos);

  // -------------------------
  // FILTRADO
  // -------------------------
  const productosFiltrados = productos.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q)
    );
  });

  return {
    cargando,
    productos,
    productosFiltrados,
    search,
    setSearch,

    crearProducto,
    actualizarProducto,
    bloquearProducto,
    desbloquearProducto,

    exportarCSV,
    exportarExcel,
    exportarPDF,
  };
};
