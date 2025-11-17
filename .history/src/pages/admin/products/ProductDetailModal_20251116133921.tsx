// ProductDetailModal.tsx
import { Modal, Button } from "@/components/common";
import type { Producto } from "@/service/menuService";

interface Props {
  open: boolean;
  onClose: () => void;
  producto: Producto | null;
}

const ProductDetailModal = ({ open, onClose, producto }: Props) => {
  if (!producto) return null;

  return (
    <Modal open={open} onClose={onClose} title="Detalle del producto">
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="rounded mb-3"
        style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
      />

      <p><strong>Código:</strong> {producto.id}</p>
      <p><strong>Nombre:</strong> {producto.nombre}</p>
      <p><strong>Categoría:</strong> {producto.categoria}</p>
      <p><strong>Precio:</strong> ${producto.precio.toLocaleString()}</p>
      <p><strong>Stock:</strong> {producto.stock}</p>

      <hr />

      <p><strong>Descripción:</strong><br />{producto.descripcion}</p>

      <div className="d-flex justify-content-end">
        <Button variant="mint" onClick={onClose}>Cerrar</Button>
      </div>
    </Modal>
  );
};

export default ProductDetailModal;
