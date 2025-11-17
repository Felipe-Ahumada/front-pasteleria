import { Modal, Button } from "@/components/common";
import type { Usuario } from "@/service/userService";

interface Props {
  open: boolean;
  onClose: () => void;
  usuario: Usuario | null;
}

const UserViewModal = ({ open, onClose, usuario }: Props) => {
  if (!usuario) return null;

  return (
    <Modal open={open} onClose={onClose} title="Detalle de usuario">
      <div className="d-flex flex-column gap-2">
        <p>
          <strong>ID:</strong> {usuario.id}
        </p>
        <p>
          <strong>RUN:</strong> {usuario.run}-{usuario.dv}
        </p>
        <p>
          <strong>Nombre:</strong> {usuario.nombre} {usuario.apellidos}
        </p>
        <p>
          <strong>Correo:</strong> {usuario.correo}
        </p>
        <p>
          <strong>Tipo de usuario:</strong> {usuario.tipoUsuario}
        </p>
        <p>
          <strong>Estado:</strong> {usuario.activo !== false ? "Activo" : "Bloqueado"}
        </p>
        <p>
          <strong>Fecha de nacimiento:</strong> {usuario.fechaNacimiento}
        </p>
        <p>
          <strong>Región:</strong> {usuario.regionNombre} ({usuario.regionId})
        </p>
        <p>
          <strong>Comuna:</strong> {usuario.comuna}
        </p>
        <p>
          <strong>Dirección:</strong> {usuario.direccion}
        </p>

        <div className="d-flex justify-content-end mt-3">
          <Button variant="mint" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UserViewModal;
