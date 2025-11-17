import { useState } from "react";
import { Button } from "@/components/common";

import ProductTable from "./ProductTable";
import ProductFormModal from "./ProductFormModal";
import ProductDeleteModal from "./ProductDeleteModal";
import ProductDetailModal from "./ProductDetailModal";

import { useAdminProducts } from "@/hooks/admin/useAdminProducts";
import type { Producto } from "@/service/menuService";
import useAuth from "@/hooks/useAuth";

const ProductsPage = () => {
  const {
    productos,
    cargando,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    exportarCSV,
    exportarExcel,
    exportarPDF,
  } = useAdminProducts();
  const { user } = useAuth();
  const role = user?.role;
  const canManageProducts = role === "admin" || role === "superadmin";

  // --------------------------
  // ESTADO DE MODALES
  // --------------------------
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalDetailOpen, setModalDetailOpen] = useState(false);

  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);

  // --------------------------
  // HANDLERS BÁSICOS
  // --------------------------
  const handleAddProduct = () => {
    if (!canManageProducts) {
      return;
    }
    setProductoSeleccionado(null);
    setModalFormOpen(true);
  };

  const handleEditProduct = (p: Producto) => {
    if (!canManageProducts) {
      return;
    }
    setProductoSeleccionado(p);
    setModalFormOpen(true);
  };

  const handleViewProduct = (p: Producto) => {
    setProductoSeleccionado(p);
    setModalDetailOpen(true);
  };

  const handleDeleteProduct = (p: Producto) => {
    if (!canManageProducts) {
      return;
    }
    setProductoSeleccionado(p);
    setModalDeleteOpen(true);
  };

  // --------------------------
  // GUARDAR (crear o editar)
  // --------------------------
  const handleSaveProduct = (data: Producto) => {
    if (!canManageProducts) {
      return;
    }
    if (productoSeleccionado) {
      // Modo edición
      actualizarProducto(productoSeleccionado.id, data);
    } else {
      // Modo creación
      crearProducto(data);
    }

    setModalFormOpen(false);
    setProductoSeleccionado(null);
  };

  // --------------------------
  // ELIMINAR
  // --------------------------
  const handleConfirmDelete = () => {
    if (!canManageProducts) {
      return;
    }
    if (productoSeleccionado) {
      eliminarProducto(productoSeleccionado.id);
      setModalDeleteOpen(false);
      setProductoSeleccionado(null);
    }
  };

  // --------------------------
  // RENDER
  // --------------------------
  return (
    <div className="d-flex flex-column gap-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h2 className="mb-1">Gestión de Productos</h2>
          <p className="mb-0 text-muted">
            Administra el catálogo de Pastelería Mil Sabores.
          </p>
        </div>

        {canManageProducts ? (
          <Button variant="mint" onClick={handleAddProduct}>
            <i className="bi bi-plus-circle" /> Añadir producto
          </Button>
        ) : null}
      </div>

      {/* BOTONES DE EXPORTACIÓN */}
      {canManageProducts ? (
        <div className="d-flex flex-wrap gap-2">
          <Button variant="mint" onClick={exportarCSV}>
            <i className="bi bi-filetype-csv" /> Exportar CSV
          </Button>
          <Button variant="mint" onClick={exportarExcel}>
            <i className="bi bi-file-earmark-excel-fill" /> Exportar Excel
          </Button>
          <Button variant="strawberry" onClick={exportarPDF}>
            <i className="bi bi-file-earmark-pdf-fill" /> Exportar PDF
          </Button>
        </div>
      ) : null}

      {/* TABLA */}
      {cargando ? (
        <div className="text-center py-5">Cargando productos...</div>
      ) : (
        <ProductTable
          productos={productos}
          onEdit={canManageProducts ? handleEditProduct : undefined}
          onDelete={canManageProducts ? handleDeleteProduct : undefined}
          onView={handleViewProduct}
        />
      )}

      {/* MODAL → Crear / Editar */}
      {canManageProducts ? (
        <>
          <ProductFormModal
            open={modalFormOpen}
            onClose={() => {
              setModalFormOpen(false);
              setProductoSeleccionado(null);
            }}
            producto={productoSeleccionado}
            onSaved={handleSaveProduct}
          />

          {/* MODAL → Eliminar */}
          <ProductDeleteModal
            open={modalDeleteOpen}
            onClose={() => {
              setModalDeleteOpen(false);
              setProductoSeleccionado(null);
            }}
            producto={productoSeleccionado}
            onConfirm={handleConfirmDelete}
          />
        </>
      ) : null}

      {/* MODAL → Detalle */}
      <ProductDetailModal
        open={modalDetailOpen}
        onClose={() => {
          setModalDetailOpen(false);
          setProductoSeleccionado(null);
        }}
        producto={productoSeleccionado}
      />
    </div>
  );
};

export default ProductsPage;
