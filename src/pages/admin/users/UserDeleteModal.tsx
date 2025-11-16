// pages/admin/users/UserDeleteModal.tsx
import { Modal, Button } from "@/components/common";
import type { Usuario } from "@/service/userService";

interface Props {
  open: boolean;
  onClose: () => void;
  usuario: Usuario | null;
  onConfirm: () => void;
}

const UserDeleteModal = ({ open, onClose, usuario, onConfirm }: Props) => {
  if (!usuario) return null;

  const isSuperAdmin = usuario.tipoUsuario === "SuperAdmin";

  return (
    <Modal open={open} onClose={onClose} title="Eliminar Usuario">
      <p className="mb-3">
        {isSuperAdmin
          ? "❌ No puedes eliminar al SuperAdmin."
          : "¿Estás seguro que deseas eliminar este usuario?"}
      </p>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button variant="strawberry" onClick={onClose}>
          Cancelar
        </Button>

        {!isSuperAdmin && (
          <Button variant="mint" onClick={onConfirm}>
            Eliminar
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default UserDeleteModal;
