import usuariosRaw from "@/data/usuarios.json";
import { LOCAL_STORAGE_KEYS } from "@/utils/storage/initLocalData";
import {
  getLocalData,
  setLocalData,
  getLocalItem,
  setLocalItem,
  removeLocalItem,
} from "@/utils/storage/localStorageUtils";
import type { StoredUser, UserRoleName } from "@/types/user";

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
  activo?: boolean;
}

type UsuarioSeed = Omit<Usuario, "activo"> & { activo?: boolean };

const STORAGE_KEY = "usuarios-cache-v1";
const ACTIVE_USER_KEY = LOCAL_STORAGE_KEYS.activeUser;
export const USERS_CACHE_UPDATED_EVENT = "users:cache-updated";

const isBrowser = typeof window !== "undefined";

let cache: Usuario[] | null = null;

const dispatchUsersUpdate = () => {
  if (isBrowser) {
    window.dispatchEvent(new CustomEvent(USERS_CACHE_UPDATED_EVENT));
  }
};

const clone = <T>(value: T): T => {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
};

const ensureActiveFlag = (usuario: Usuario): Usuario => ({
  ...usuario,
  activo: usuario.activo ?? true,
});

const mergeTimestamps = (usuario: Usuario, fallback?: Usuario): Usuario => {
  if (usuario.createdAt) {
    return usuario;
  }

  return {
    ...usuario,
    createdAt: fallback?.createdAt ?? new Date().toISOString(),
  };
};

const toStoredRun = (run: number, dv: string): string => {
  const body = String(run).replace(/[^0-9]/g, "");
  const verifier = (dv ?? "").toString().trim().toUpperCase();
  return `${body}${verifier}`;
};

const resolveRole = (usuario: Usuario, existing?: StoredUser): UserRoleName => {
  if (existing?.tipoUsuario === "SuperAdmin") {
    return "SuperAdmin";
  }

  return usuario.tipoUsuario as UserRoleName;
};

const syncAuthRecord = (usuario: Usuario) => {
  if (!isBrowser) return;

  const stored = getLocalData<StoredUser>(LOCAL_STORAGE_KEYS.usuarios);
  const index = stored.findIndex((user) => user.id === usuario.id);
  const timestamp = new Date().toISOString();

  const buildRecord = (existing?: StoredUser): StoredUser => {
    const nextRole = resolveRole(usuario, existing);
    return {
      ...existing,
      id: usuario.id,
      run: toStoredRun(usuario.run, usuario.dv),
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      correo: usuario.correo.trim().toLowerCase(),
      fechaNacimiento: usuario.fechaNacimiento || existing?.fechaNacimiento,
      tipoUsuario: nextRole,
      regionId: usuario.regionId,
      regionNombre: usuario.regionNombre,
      comuna: usuario.comuna,
      direccion: usuario.direccion,
      password: usuario.password,
      avatarUrl: existing?.avatarUrl,
      codigoDescuento: existing?.codigoDescuento,
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp,
      activo: usuario.activo ?? existing?.activo ?? true,
    };
  };

  if (index === -1) {
    stored.push(buildRecord());
  } else {
    stored[index] = buildRecord(stored[index]);
  }

  setLocalData(LOCAL_STORAGE_KEYS.usuarios, stored);

  const active = getLocalItem<StoredUser>(ACTIVE_USER_KEY);
  if (active?.id === usuario.id) {
    if (usuario.activo === false) {
      removeLocalItem(ACTIVE_USER_KEY);
    } else {
      const updated = index === -1 ? stored[stored.length - 1] : stored[index];
      setLocalItem(ACTIVE_USER_KEY, updated);
    }
  }
};

const persist = (list: Usuario[]) => {
  const normalized = list.map((item) => ensureActiveFlag(mergeTimestamps(item)));
  cache = normalized;
  setLocalData<Usuario>(STORAGE_KEY, normalized);
};

const init = (): Usuario[] => {
  if (!cache) {
    const stored = getLocalData<Usuario>(STORAGE_KEY);

    if (stored.length > 0) {
      cache = stored.map((item) => ensureActiveFlag(mergeTimestamps(item)));
    } else {
      const seeded = (usuariosRaw as UsuarioSeed[]).map((item) =>
        ensureActiveFlag(
          mergeTimestamps({
            ...item,
          } as Usuario)
        )
      );

      cache = seeded;
      setLocalData<Usuario>(STORAGE_KEY, seeded);
    }
  }

  return cache!;
};

/* ===============================================================
   SERVICIO FINAL (igual estilo que menuService)
================================================================ */
export const userService = {
  getAll(): Usuario[] {
    return clone(init());
  },

  getCached(): Usuario[] {
    return clone(init());
  },

  getActive(): Usuario[] {
    return this.getCached().filter((u) => u.activo !== false);
  },

  getById(id: string): Usuario | undefined {
    const list = init();
    const found = list.find((u) => u.id === id);
    return found ? { ...found } : undefined;
  },

  add(user: Usuario) {
    const list = clone(init());
    if (list.some((u) => u.id === user.id)) {
      throw new Error("Ya existe un usuario con este ID");
    }

    const nuevo = ensureActiveFlag(mergeTimestamps(user));
    list.push(nuevo);
    persist(list);
    syncAuthRecord(nuevo);
    dispatchUsersUpdate();
  },

  update(updated: Usuario) {
    const list = clone(init());
    const index = list.findIndex((u) => u.id === updated.id);
    if (index === -1) {
      throw new Error("Usuario no encontrado");
    }

    const merged = ensureActiveFlag(
      mergeTimestamps({
        ...list[index],
        ...updated,
      }, list[index])
    );

    list[index] = merged;
    persist(list);
    syncAuthRecord(merged);
    dispatchUsersUpdate();
  },

  setStatus(id: string, activo: boolean) {
    const list = clone(init());
    const index = list.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error("Usuario no encontrado");
    }

    if (list[index].tipoUsuario === "SuperAdmin" && !activo) {
      throw new Error("No puedes bloquear al SuperAdmin");
    }

    const updated = ensureActiveFlag({
      ...list[index],
      activo,
    });

    list[index] = updated;
    persist(list);
    syncAuthRecord(updated);
    dispatchUsersUpdate();
  },

  block(id: string) {
    this.setStatus(id, false);
  },

  unblock(id: string) {
    this.setStatus(id, true);
  },

  delete(id: string) {
    // Compatibilidad hacia atrás: borrar pasa a bloquear
    this.block(id);
  },
};
