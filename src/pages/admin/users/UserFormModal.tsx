// pages/admin/users/UserFormModal.tsx
import { useEffect, useState } from "react";
import { Modal, Button, Input } from "@/components/common";
import regionesData from "@/data/region_comuna.json";

import {
  userService,
  type Usuario,
} from "@/service/userService";

import { validateUserForm } from "@/utils/validations/userValidations";

// ==================================================
// Configuración
// ==================================================
const DEFAULT_PASSWORD_HASH =
  "fbd77bc68717f45eedbf71d09826c4a64c0447da1f42c7a6dbf608fa7c97f710";

const getNextUserId = (): string => {
  const all = userService.getCached();
  if (all.length === 0) return "1";

  const max = all
    .map((u) => Number(u.id))
    .filter((n) => !Number.isNaN(n))
    .reduce((m, n) => (n > m ? n : m), 0);

  return String(max + 1);
};

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
  password: DEFAULT_PASSWORD_HASH,
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
  const [comunasDisponibles, setComunasDisponibles] = useState<string[]>([]);

  // ==================================================
  // Cargar datos al abrir
  // ==================================================
  useEffect(() => {
    if (!open) return;

    if (usuario) {
      // Modo edición
      setForm({ ...usuario });

      const region = regionesData.find((r) => r.id === usuario.regionId);
      setComunasDisponibles(region?.comunas ?? []);
    } else {
      setForm({
        ...emptyUser,
        id: getNextUserId(),
      });
      setComunasDisponibles([]);
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
    const region = regionesData.find((r) => r.id === regionId);

    handleChange("regionId", regionId);
    handleChange("regionNombre", region?.region ?? "");
    handleChange("comuna", "");

    setComunasDisponibles(region?.comunas ?? []);
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
        password: form.password,
        confirmPassword: form.password,
        termsAccepted: true,
      },
      { mode: usuario ? "update" : "create" }
    );

    setErrors(validationErrors);

    if (!isValid) return;

    if (usuario?.tipoUsuario === "SuperAdmin") {
      alert("❌ No puedes editar al SuperAdmin.");
      return;
    }

    const finalUser: Usuario = {
      ...form,
      password: form.password || usuario?.password || DEFAULT_PASSWORD_HASH,
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
            onChange={(e) =>
              handleChange("dv", e.target.value.toUpperCase())
            }
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
            {regionesData.map((r) => (
              <option key={r.id} value={r.id}>
                {r.region}
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
            onChange={(e) => handleChange("comuna", e.target.value)}
            disabled={comunasDisponibles.length === 0}
          >
            <option value="">Seleccione comuna...</option>
            {comunasDisponibles.map((c) => (
              <option key={c} value={c}>
                {c}
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
