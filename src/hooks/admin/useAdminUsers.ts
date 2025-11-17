import { useState, useEffect, useMemo } from "react";
import {
  userService,
  type Usuario,
  USERS_CACHE_UPDATED_EVENT,
} from "@/service/userService";
import {
  exportUsersCSV,
  exportUsersExcel,
  exportUsersPDF,
} from "@/utils/exporters";

export const useAdminUsers = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const load = () => {
    setUsuarios(userService.getAll());
    setLoading(false);
  };

  useEffect(() => {
    load();

    if (typeof window === "undefined") return;

    const handleUpdate = () => load();
    window.addEventListener(USERS_CACHE_UPDATED_EVENT, handleUpdate);

    return () => {
      window.removeEventListener(USERS_CACHE_UPDATED_EVENT, handleUpdate);
    };
  }, []);

  const addUser = (user: Usuario) => {
    userService.add(user);
    load();
  };

  const updateUser = (updated: Usuario) => {
    userService.update(updated);
    load();
  };

  const blockUser = (id: string) => {
    userService.block(id);
    load();
  };

  const unblockUser = (id: string) => {
    userService.unblock(id);
    load();
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
        (u.activo !== false ? "activo" : "bloqueado"),
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
