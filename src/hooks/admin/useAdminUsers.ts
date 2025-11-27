import { useState, useEffect, useMemo } from "react";
import { userService, type Usuario } from "@/service/userService";
import {
  exportUsersCSV,
  exportUsersExcel,
  exportUsersPDF,
} from "@/utils/exporters";

export const useAdminUsers = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const load = async () => {
    const data = await userService.getAll();
    setUsuarios(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const addUser = async (user: Usuario) => {
    await userService.add(user);
    await load();
  };

  const updateUser = async (updated: Usuario) => {
    await userService.update(updated);
    await load();
  };

  const blockUser = async (id: string) => {
    await userService.block(id);
    await load();
  };

  const unblockUser = async (id: string) => {
    await userService.unblock(id);
    await load();
  };

  const exportCSV = () => exportUsersCSV(usuarios);
  const exportExcel = () => exportUsersExcel(usuarios);
  const exportPDF = () => exportUsersPDF(usuarios);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return usuarios;

    const s = search.toLowerCase();

    return usuarios.filter((u) =>
      [
        u.nombre.toLowerCase(),
        u.apellidos.toLowerCase(),
        u.correo.toLowerCase(),
        u.tipoUsuario.toLowerCase(),
        u.activo !== false ? "activo" : "bloqueado",
        u.regionNombre.toLowerCase(),
        u.comuna.toLowerCase(),
        `${u.run}-${u.dv}`.toLowerCase(),
      ].some((field) => field.includes(s))
    );
  }, [search, usuarios]);

  return {
    usuarios,
    filteredUsers,
    search,
    setSearch,
    loading,
    addUser,
    updateUser,
    blockUser,
    unblockUser,
    exportCSV,
    exportExcel,
    exportPDF,
  };
};
