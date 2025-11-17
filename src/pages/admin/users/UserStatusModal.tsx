// pages/admin/users/UserStatusModal.tsx
import { Modal, Button } from "@/components/common";
import type { Usuario } from "@/service/userService";

interface Props {
  open: boolean;
  onClose: () => void;
  usuario: Usuario | null;
  mode: "block" | "unblock" | null;
  onConfirm: () => void;
}

const UserStatusModal = ({ open, onClose, usuario, mode, onConfirm }: Props) => {
  if (!usuario || !mode) return null;

  const isBlocking = mode === "block";
  const isSuperAdmin = usuario.tipoUsuario === "SuperAdmin";
  const isActive = usuario.activo !== false;

  const title = isBlocking ? "Bloquear usuario" : "Activar usuario";

  const actionLabel = isBlocking ? "Bloquear" : "Activar";
  const actionVariant = isBlocking ? "strawberry" : "mint";

  const description = isBlocking
    ? "El usuario no podrá iniciar sesión ni operar en la plataforma."
    : "El usuario recuperará el acceso inmediato a la plataforma.";

  const sessionNote = isBlocking
    ? "Si el usuario tiene una sesión activa, se cerrará de inmediato."
    : "Podrá iniciar sesión nuevamente de forma normal.";

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="d-flex flex-column gap-3">
        {isBlocking && isSuperAdmin ? (
          <p className="mb-0">❌ No puedes bloquear la cuenta SuperAdmin.</p>
        ) : (
          <>
            <p className="mb-0">
              <strong>{usuario.nombre}</strong> ({usuario.correo})
            </p>
            <p className="mb-0">
              {isBlocking && isActive
                ? "¿Seguro que deseas bloquear a este usuario?"
                : "¿Deseas reactivar a este usuario?"}
            </p>
            <p className="mb-0 text-muted small">{description}</p>
            <p className="mb-0 text-muted small">{sessionNote}</p>
          </>
        )}

        <div className="d-flex justify-content-end gap-2 mt-2">
          <Button variant="strawberry" onClick={onClose}>
            Cancelar
          </Button>

          {!(isBlocking && isSuperAdmin) && (
            <Button variant={actionVariant} onClick={onConfirm}>
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UserStatusModal;
