import { useEffect, useState } from "react";
import { Modal, Button, Input } from "@/components/common";
import { useLocations } from "@/hooks/useLocations";

import { type Usuario } from "@/service/userService";

import { validateUserForm } from "@/utils/validations/userValidations";

// ==================================================
// Configuración
// ==================================================
const DEFAULT_PASSWORD_HASH =
  "fbd77bc68717f45eedbf71d09826c4a64c0447da1f42c7a6dbf608fa7c97f710";

const emptyUser: Usuario = {
  id: "",
  run: 0,
  dv: "",
  nombre: "",
  apellidos: "",
  correo: "",
  fechaNacimiento: "",
  tipoUsuario: "Cliente",
  regionId: "",
  regionNombre: "",
  comuna: "",
  direccion: "",
  password: "",
  activo: true,
};

// ==================================================
// COMPONENTE
// ==================================================
interface Props {
  open: boolean;
  onClose: () => void;
  usuario: Usuario | null;
  onSaved: (user: Usuario) => void;
}

const UserFormModal = ({ open, onClose, usuario, onSaved }: Props) => {
  const [form, setForm] = useState<Usuario>(emptyUser);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const { regions, comunas, fetchComunas } = useLocations();

  // ==================================================
  // Cargar datos al abrir
  // ==================================================
  useEffect(() => {
    if (!open) return;

    if (usuario) {
      // Modo edición
      setForm({
        ...usuario,
        password: "",
        activo: usuario.activo ?? true,
      });

      if (usuario.regionId) {
        fetchComunas(usuario.regionId);
      }
    } else {
      setForm({
        ...emptyUser,
        id: "", // Let backend handle ID
        activo: true,
      });
      // Clear comunas? useLocations doesn't have clearComunas, but fetching with empty string might work or we just ignore.
      // Actually fetchComunas("") clears it in useLocations.
      fetchComunas("");
    }

    setErrors({});
  }, [open, usuario]);

  // ==================================================
  // Handlers
  // ==================================================
  const handleChange = <K extends keyof Usuario>(key: K, value: Usuario[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegionChange = (regionId: string) => {
    const region = regions.find((r) => r.codigo === regionId);

    handleChange("regionId", regionId);
    handleChange("regionNombre", region?.nombre ?? "");
    handleChange("comuna", "");

    fetchComunas(regionId);
  };

  const handleComunaChange = (comunaNombre: string) => {
    handleChange("comuna", comunaNombre);
  };

  // ==================================================
  // Validación + Submit
  // ==================================================
  const handleSubmit = () => {
    const runBody = String(form.run);
    const runDigit = form.dv.toUpperCase();
    const fullRun = runBody && runDigit ? `${runBody}${runDigit}` : "";

    const { isValid, errors: validationErrors } = validateUserForm(
      {
        id: form.id,
        run: fullRun,
        runBody,
        runDigit,
        nombre: form.nombre,
        apellidos: form.apellidos,
        correo: form.correo,
        fechaNacimiento: form.fechaNacimiento,
        regionId: form.regionId,
        comuna: form.comuna,
        direccion: form.direccion,
        password: "",
        confirmPassword: "",
        termsAccepted: true,
      },
      { mode: "update", regions }
    );

    setErrors(validationErrors);

    if (!isValid) return;

    if (usuario?.tipoUsuario === "SuperAdmin") {
      alert("❌ No puedes editar al SuperAdmin.");
      return;
    }

    const finalUser: Usuario = {
      ...form,
      password: usuario?.password || DEFAULT_PASSWORD_HASH,
      activo: form.activo ?? usuario?.activo ?? true,
      createdAt: usuario?.createdAt ?? form.createdAt,
    };

    onSaved(finalUser);
    onClose();
  };

  // ==================================================
  // Render
  // ==================================================
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={usuario ? "Editar usuario" : "Nuevo usuario"}
    >
      <div className="d-flex flex-column gap-3">
        <Input label="ID" value={form.id} disabled />

        {/* RUN + DV */}
        <div className="d-flex gap-2">
          <Input
            label="RUN"
            type="number"
            value={form.run}
            errorText={errors.runBody || errors.run}
            onChange={(e) => handleChange("run", Number(e.target.value))}
          />
          <Input
            label="DV"
            value={form.dv}
            errorText={errors.runDigit}
            maxLength={1}
            onChange={(e) => handleChange("dv", e.target.value.toUpperCase())}
          />
        </div>

        {/* Nombre */}
        <Input
          label="Nombre"
          value={form.nombre}
          errorText={errors.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
        />

        {/* Apellidos */}
        <Input
          label="Apellidos"
          value={form.apellidos}
          errorText={errors.apellidos}
          onChange={(e) => handleChange("apellidos", e.target.value)}
        />

        {/* Correo */}
        <Input
          label="Correo"
          type="email"
          value={form.correo}
          errorText={errors.correo}
          onChange={(e) => handleChange("correo", e.target.value)}
        />

        {/* Fecha nacimiento */}
        <Input
          label="Fecha de nacimiento"
          type="date"
          value={form.fechaNacimiento}
          errorText={errors.fechaNacimiento}
          onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
        />

        {/* Tipo usuario */}
        <div>
          <label className="form-label">Tipo de Usuario</label>
          <select
            className="form-select"
            value={form.tipoUsuario}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "SuperAdmin") return;
              handleChange("tipoUsuario", value);
            }}
            disabled={usuario?.tipoUsuario === "SuperAdmin"}
          >
            {usuario?.tipoUsuario === "SuperAdmin" && (
              <option disabled>SuperAdmin</option>
            )}
            <option value="Administrador">Administrador</option>
            <option value="Vendedor">Vendedor</option>
            <option value="Cliente">Cliente</option>
          </select>
        </div>

        {/* Región */}
        <div>
          <label className="form-label">Región</label>
          <select
            className="form-select"
            value={form.regionId}
            onChange={(e) => handleRegionChange(e.target.value)}
          >
            <option value="">Seleccione región...</option>
            {regions.map((r) => (
              <option key={r.id} value={r.codigo}>
                {r.nombre}
              </option>
            ))}
          </select>
          {errors.regionId && (
            <p className="text-danger small">{errors.regionId}</p>
          )}
        </div>

        {/* Comuna */}
        <div>
          <label className="form-label">Comuna</label>
          <select
            className="form-select"
            value={form.comuna}
            onChange={(e) => handleComunaChange(e.target.value)}
            disabled={comunas.length === 0}
          >
            <option value="">Seleccione comuna...</option>
            {comunas.map((c) => (
              <option key={c.id} value={c.nombre}>
                {c.nombre}
              </option>
            ))}
          </select>
          {errors.comuna && (
            <p className="text-danger small">{errors.comuna}</p>
          )}
        </div>

        {/* Dirección */}
        <Input
          label="Dirección"
          value={form.direccion}
          errorText={errors.direccion}
          onChange={(e) => handleChange("direccion", e.target.value)}
        />

        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button variant="strawberry" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="mint" onClick={handleSubmit}>
            Guardar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UserFormModal;
