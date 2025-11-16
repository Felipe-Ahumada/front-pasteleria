// service/userService.ts
import usuariosRaw from "@/data/usuarios.json";
import {
  getLocalData,
  setLocalData,
} from "@/utils/storage/localStorageUtils";

export interface Usuario {
  id: string;
  run: number;
  dv: string;
  nombre: string;
  apellidos: string;
  correo: string;
  fechaNacimiento: string;
  tipoUsuario: string;
  regionId: string;
  regionNombre: string;
  comuna: string;
  direccion: string;
  password: string;
}

const STORAGE_KEY = "usuarios-cache-v1";

let cache: Usuario[] | null = null;

/* ===============================================================
   Inicialización: JSON → LocalStorage
================================================================ */
const init = (): Usuario[] => {
  if (!cache) {
    const stored = getLocalData<Usuario>(STORAGE_KEY);
    cache = stored.length > 0 ? stored : usuariosRaw;
    setLocalData<Usuario>(STORAGE_KEY, cache);
  }
  return cache!;
};

/* ===============================================================
   SERVICE FINAL
================================================================ */
export const userService = {
  getAll(): Usuario[] {
    return init();
  },

  getById(id: string): Usuario | undefined {
    return init().find((u) => u.id === id);
  },

  add(user: Usuario) {
    const list = init();

    if (list.some((u) => u.id === user.id)) {
      throw new Error("Ya existe un usuario con este ID");
    }

    if (user.tipoUsuario === "SuperAdmin") {
      throw new Error("No puedes crear SuperAdmins");
    }

    list.push(user);
    cache = list;
    setLocalData<Usuario>(STORAGE_KEY, list);
  },

  update(updated: Usuario) {
    const list = init();

    const original = list.find((u) => u.id === updated.id);

    if (!original) throw new Error("Usuario no encontrado");

    if (original.tipoUsuario === "SuperAdmin") {
      // SuperAdmin no puede cambiar rol ni eliminarse
      updated.tipoUsuario = "SuperAdmin";
    }

    const newList = list.map((u) => (u.id === updated.id ? updated : u));
    cache = newList;
    setLocalData<Usuario>(STORAGE_KEY, newList);
  },

  delete(id: string) {
    const list = init();
    const user = list.find((u) => u.id === id);

    if (!user) return;

    if (user.tipoUsuario === "SuperAdmin") {
      throw new Error("No puedes eliminar al SuperAdmin");
    }

    const newList = list.filter((u) => u.id !== id);
    cache = newList;
    setLocalData<Usuario>(STORAGE_KEY, newList);
  },
};
