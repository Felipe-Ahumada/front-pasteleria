import { useState, useEffect, useMemo } from "react";
import { userService, type Usuario } from "@/service/userService";

export const useAdminUsers = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Campo de búsqueda
  const [search, setSearch] = useState("");

  const load = () => {
    setUsuarios(userService.getAll());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const addUser = (user: Usuario) => {
    userService.add(user);
    load();
  };

  const updateUser = (updated: Usuario) => {
    userService.update(updated);
    load();
  };

  const deleteUser = (id: string) => {
    userService.delete(id);
    load();
  };

  // ================================================================
  // 📌 FILTRADO MEMOIZADO
  // ================================================================
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return usuarios;

    const lower = search.toLowerCase();

    return usuarios.filter((u) => {
      return (
        u.nombre.toLowerCase().includes(lower) ||
        u.apellidos.toLowerCase().includes(lower) ||
        u.correo.toLowerCase().includes(lower) ||
        u.tipoUsuario.toLowerCase().includes(lower) ||
        u.regionNombre.toLowerCase().includes(lower) ||
        u.comuna.toLowerCase().includes(lower) ||
        `${u.run}-${u.dv}`.toLowerCase().includes(lower)
      );
    });
  }, [search, usuarios]);

  return {
    usuarios,
    filteredUsers,
    search,
    setSearch,
    loading,
    addUser,
    updateUser,
    deleteUser,
  };
};
