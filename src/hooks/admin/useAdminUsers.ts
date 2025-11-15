// hooks/admin/useAdminUsers.ts
import { useState, useEffect } from "react";
import { userService, type Usuario } from "@/service/userService";

export const useAdminUsers = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

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

  return {
    usuarios,
    loading,
    addUser,
    updateUser,
    deleteUser
  };
};
