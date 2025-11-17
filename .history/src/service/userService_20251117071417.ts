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
  createdAt?: string;
}

const STORAGE_KEY = "usuarios-cache-v1";

let cache: Usuario[] | null = null;

/* ===============================================================
   Inicialización desde localStorage → si no existe usa JSON base
================================================================ */
const init = (): Usuario[] => {
  if (!cache) {
    const stored = getLocalData<Usuario>(STORAGE_KEY);

    cache = stored.length > 0 ? stored : usuariosRaw;

    // Guardar primera vez
    setLocalData<Usuario>(STORAGE_KEY, cache);
  }

  return cache!;
};

/* ===============================================================
   SERVICIO
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
    list.push(user);

    cache = list;
    setLocalData<Usuario>(STORAGE_KEY, list);
  },

  update(updated: Usuario) {
    const list = init().map((u) => (u.id === updated.id ? updated : u));
    cache = list;

    setLocalData<Usuario>(STORAGE_KEY, list);
  },

  delete(id: string) {
    const list = init().filter((u) => u.id !== id);
    cache = list;

    setLocalData<Usuario>(STORAGE_KEY, list);
  },

  getCached(): Usuario[] {
    return init();
  },
};
