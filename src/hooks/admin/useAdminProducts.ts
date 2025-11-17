// useAdminProducts.ts
import { useEffect, useState } from "react";
import { menuService, type Producto } from "@/service/menuService";

import { exportCSV, exportExcel, exportPDF } from "@/utils/exporters";

export const useAdminProducts = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [search, setSearch] = useState("");

  // -------------------------
  // CARGAR PRODUCTOS
  // -------------------------
  const cargarProductos = () => {
    setCargando(true);
    const data = menuService.getCached();
    setProductos(data);
    setCargando(false);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // -------------------------
  // CRUD (delegado al service)
  // -------------------------
  const crearProducto = (nuevo: Producto) => {
    menuService.create(nuevo);
    cargarProductos();
  };

  const actualizarProducto = (id: string, data: Producto) => {
    menuService.update(id, data);
    cargarProductos();
  };

  const bloquearProducto = (id: string) => {
    menuService.block(id);
    cargarProductos();
  };

  const desbloquearProducto = (id: string) => {
    menuService.unblock(id);
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
