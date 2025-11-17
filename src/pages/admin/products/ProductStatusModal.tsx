import { Modal, Button } from "@/components/common";
import type { Producto } from "@/service/menuService";

type Mode = "block" | "unblock";

interface Props {
  open: boolean;
  onClose: () => void;
  producto: Producto | null;
  onConfirm: () => void;
  mode: Mode;
}

const CONTENT: Record<Mode, { title: string; body: (p: Producto) => string; actionLabel: string; variant: "strawberry" | "mint" }> = {
  block: {
    title: "Bloquear producto",
    body: (p) => `Confirma que deseas bloquear "${p.nombre}". No se mostrara en la tienda mientras este bloqueado.`,
    actionLabel: "Bloquear",
    variant: "strawberry",
  },
  unblock: {
    title: "Desbloquear producto",
    body: (p) => `Confirma que deseas volver a activar "${p.nombre}". Volvera a estar visible en la tienda.`,
    actionLabel: "Desbloquear",
    variant: "mint",
  },
};

const ProductStatusModal = ({ open, onClose, producto, onConfirm, mode }: Props) => {
  if (!producto) return null;

  const { title, body, actionLabel, variant } = CONTENT[mode];

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p>{body(producto)}</p>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="mint" onClick={onClose}>Cancelar</Button>
        <Button variant={variant} onClick={onConfirm}>{actionLabel}</Button>
      </div>
    </Modal>
  );
};

export default ProductStatusModal;
