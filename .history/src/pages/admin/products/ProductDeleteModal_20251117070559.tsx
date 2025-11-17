import { Modal, Button } from "@/components/common";
import type { Producto } from "@/service/menuService";

interface Props {
  open: boolean;
  onClose: () => void;
  producto: Producto | null;
  onConfirm: () => void;
}

const ProductDeleteModal = ({ open, onClose, producto, onConfirm }: Props) => {
  if (!producto) return null;

  return (
    <Modal open={open} onClose={onClose} title="Eliminar producto">
      <p>¿Seguro que deseas eliminar <strong>{producto.nombre}</strong>?</p>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="mint" onClick={onClose}>Cancelar</Button>
        <Button variant="strawberry" onClick={onConfirm}>Eliminar</Button>
      </div>
    </Modal>
  );
};

export default ProductDeleteModal;
