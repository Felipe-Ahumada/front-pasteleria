import { useState, useEffect, useMemo } from "react";
import { userService, type Usuario } from "@/service/userService";

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

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return usuarios;

    const s = search.toLowerCase();

    return usuarios.filter((u) =>
      [
        u.nombre.toLowerCase(),
        u.apellidos.toLowerCase(),
        u.correo.toLowerCase(),
        u.tipoUsuario.toLowerCase(),
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
    deleteUser,
  };
};
