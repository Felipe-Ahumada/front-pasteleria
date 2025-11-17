// pages/admin/users/UsersPage.tsx
import { useState } from "react";
import { Button, Input } from "@/components/common";
import { useAdminUsers } from "@/hooks/admin/useAdminUsers";
import type { Usuario } from "@/service/userService";
import UserFormModal from "./UserFormModal";
import UserViewModal from "./UserViewModal";
import UserStatusModal from "./UserStatusModal";

const UsersPage = () => {
  const {
    loading,
    filteredUsers,
    search,
    setSearch,
    addUser,
    updateUser,
    blockUser,
    unblockUser,
    exportCSV,
    exportExcel,
    exportPDF,
  } = useAdminUsers();

  const [selected, setSelected] = useState<Usuario | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<"block" | "unblock" | null>(null);

  const handleNew = () => {
    setSelected(null);
    setIsFormOpen(true);
  };

  const handleEdit = (u: Usuario) => {
    setSelected(u);
    setIsFormOpen(true);
  };

  const handleView = (u: Usuario) => {
    setSelected(u);
    setIsViewOpen(true);
  };

  const handleStatusChange = (u: Usuario, action: "block" | "unblock") => {
    setSelected(u);
    setStatusAction(action);
    setIsStatusOpen(true);
  };

  const handleSaved = (user: Usuario) => {
    if (filteredUsers.some((u) => u.id === user.id)) {
      updateUser(user);
    } else {
      addUser(user);
    }
  };

  const confirmStatusChange = () => {
    if (!selected || !statusAction) return;

    if (statusAction === "block") {
      blockUser(selected.id);
    } else {
      unblockUser(selected.id);
    }

    setIsStatusOpen(false);
    setStatusAction(null);
    setSelected(null);
  };

  return (
    <section>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h4 mb-1">Gestión de usuarios</h2>
          <p className="mb-0 text-muted">
            Administra los usuarios de la pastelería: administradores,
            vendedores y clientes.
          </p>
        </div>

        <Button variant="mint" onClick={handleNew}>
          <i className="bi bi-person-plus" /> Nuevo usuario
        </Button>
      </header>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <Button variant="mint" onClick={exportCSV}>
          <i className="bi bi-filetype-csv" /> Exportar CSV
        </Button>
        <Button variant="mint" onClick={exportExcel}>
          <i className="bi bi-file-earmark-excel-fill" /> Exportar Excel
        </Button>
        <Button variant="strawberry" onClick={exportPDF}>
          <i className="bi bi-file-earmark-pdf-fill" /> Exportar PDF
        </Button>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3 gap-2 flex-wrap">
        <div className="flex-grow-1">
          <Input
            label="Buscar"
            placeholder="Nombre, correo, tipo, comuna..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="text-end">
          <span className="text-muted small">
            {filteredUsers.length} usuario
            {filteredUsers.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="card card-body text-center">
          <p className="mb-2">No hay usuarios que coincidan con la búsqueda.</p>
          <Button variant="mint" onClick={() => setSearch("")}>
            Limpiar búsqueda
          </Button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>RUN</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Región</th>
                <th>Comuna</th>
                <th style={{ width: 160 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const isActive = u.activo !== false;
                const canToggle = u.tipoUsuario !== "SuperAdmin";

                return (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>
                      {u.run}-{u.dv}
                    </td>
                    <td>
                      {u.nombre} {u.apellidos}
                    </td>
                    <td>{u.correo}</td>
                    <td>{u.tipoUsuario}</td>
                    <td>
                      <span
                        className={`badge ${isActive ? "bg-success" : "bg-secondary"}`}
                      >
                        {isActive ? "Activo" : "Bloqueado"}
                      </span>
                    </td>
                    <td>{u.regionNombre}</td>
                    <td>{u.comuna}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="mint"
                          size="sm"
                          onClick={() => handleView(u)}
                        >
                          Ver
                        </Button>
                        <Button
                          variant="strawberry"
                          size="sm"
                          onClick={() => handleEdit(u)}
                        >
                          Editar
                        </Button>
                        {canToggle && (
                          <Button
                            variant={isActive ? "strawberry" : "mint"}
                            size="sm"
                            onClick={() =>
                              handleStatusChange(u, isActive ? "block" : "unblock")
                            }
                          >
                            {isActive ? "Bloquear" : "Activar"}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <UserFormModal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        usuario={selected}
        onSaved={handleSaved}
      />

      <UserViewModal
        open={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        usuario={selected}
      />

      <UserStatusModal
        open={isStatusOpen}
        onClose={() => {
          setIsStatusOpen(false);
          setStatusAction(null);
          setSelected(null);
        }}
        usuario={selected}
        mode={statusAction}
        onConfirm={confirmStatusChange}
      />
    </section>
  );
};

export default UsersPage;
