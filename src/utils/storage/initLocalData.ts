import { defaultProfileImage } from "@/assets";
import usuariosSeed from "@/data/usuarios.json";
import region_comunas from "@/data/region_comuna.json";

import type { StoredUser, UserRoleName } from "@/types/user";

import { readArray, writeJSON } from "./localStorageUtils";
import { ensureHashedPassword } from "@/utils/security/password";
import type { BlogPost } from "@/types/blog";

const isBrowser = typeof window !== "undefined";

export const LOCAL_STORAGE_KEYS = {
  usuarios: "dataUsuarios",
  regiones: "dataRegiones",
  comunas: "dataComunas",
  activeUser: "usuarioActivo",
  contactMessages: "contactMessages",
  menuFilters: "menuFilters",
  blogs: "dataBlogs", // <<--- AGREGADO
} as const;

export type RegionSeed = {
  id: string;
  region: string;
  comunas: string[];
};

type UsuarioSeed = {
  id: string;
  run: number;
  dv: string;
  nombre: string;
  apellidos: string;
  correo: string;
  fechaNacimiento?: string;
  tipoUsuario: string;
  regionId: string;
  regionNombre: string;
  comuna: string;
  direccion: string;
  password: string;
  avatarUrl?: string;
  codigoDescuento?: string;
  activo?: boolean;
};

type ComunaSeed = {
  id: string;
  regionId: string;
  regionNombre: string;
  nombre: string;
};

let initialized = false;

const buildComunasSeed = (regions: RegionSeed[]): ComunaSeed[] =>
  regions.flatMap((region) =>
    region.comunas.map((nombre) => ({
      id: `${region.id}-${nombre}`,
      regionId: region.id,
      regionNombre: region.region,
      nombre,
    }))
  );

const normalizedSeedRegions: RegionSeed[] = region_comunas
  .map((entry) => ({
    id: entry.id,
    region: entry.region.trim(),
    comunas: entry.comunas
      .map((comuna) => comuna.trim())
      .filter((c) => c.length > 0),
  }))
  .filter((r) => r.region.length > 0);

export const initLocalData = (force = false) => {
  if (!isBrowser || (initialized && !force)) return;

  initialized = true;

  try {
    // -------------------------------------------------------
    // USUARIOS
    // -------------------------------------------------------
    const usuarios = readArray<StoredUser>(LOCAL_STORAGE_KEYS.usuarios);

    if (!usuarios.length) {
      const normalized = (usuariosSeed as UsuarioSeed[]).map(
        ({ dv, run, tipoUsuario, avatarUrl, password, activo, ...rest }) => {
          const combinedRun = `${run}${dv}`.toUpperCase();
          return {
            ...rest,
            tipoUsuario: tipoUsuario as UserRoleName,
            run: combinedRun,
            avatarUrl: avatarUrl ?? defaultProfileImage,
            password: ensureHashedPassword(password ?? ""),
            activo: activo ?? true,
          };
        }
      );

      writeJSON(LOCAL_STORAGE_KEYS.usuarios, normalized);
    } else {
      const sanitizedUsuarios = usuarios.map((user) => ({
        ...user,
        password: ensureHashedPassword(user.password ?? ""),
        activo: user.activo ?? true,
      }));

      const hasChanges = sanitizedUsuarios.some((u, i) => {
        const original = usuarios[i];
        return (
          u.password !== original?.password ||
          (u.activo ?? true) !== (original?.activo ?? true)
        );
      });

      if (hasChanges) {
        writeJSON(LOCAL_STORAGE_KEYS.usuarios, sanitizedUsuarios);
      }
    }

    // -------------------------------------------------------
    // REGIONES
    // -------------------------------------------------------
    const storedRegions = readArray<RegionSeed>(LOCAL_STORAGE_KEYS.regiones);

    const shouldResetRegions =
      force ||
      storedRegions.length !== normalizedSeedRegions.length ||
      storedRegions.some((region) => {
        const seed = normalizedSeedRegions.find((r) => r.id === region.id);
        return (
          !seed ||
          seed.comunas.length !== region.comunas.length ||
          region.comunas.length === 0
        );
      });

    const effectiveRegions = shouldResetRegions
      ? normalizedSeedRegions
      : storedRegions;

    if (shouldResetRegions) {
      writeJSON(LOCAL_STORAGE_KEYS.regiones, normalizedSeedRegions);
    }

    // -------------------------------------------------------
    // COMUNAS
    // -------------------------------------------------------
    const storedComunas = readArray<ComunaSeed>(LOCAL_STORAGE_KEYS.comunas);

    if (force || shouldResetRegions || !storedComunas.length) {
      writeJSON(
        LOCAL_STORAGE_KEYS.comunas,
        buildComunasSeed(effectiveRegions)
      );
    }

    // -------------------------------------------------------
    // BLOGS (SEED)
    // -------------------------------------------------------
    const existingBlogs = readArray<BlogPost>(LOCAL_STORAGE_KEYS.blogs);

    if (!existingBlogs.length) {
      const exampleBlog = {
        id: "blog-ejemplo-1",
        titulo: "Bienvenidos al Blog de Mil Sabores",
        descripcion:
          "Este es un artículo de ejemplo creado automáticamente para mostrar cómo funciona el blog.",
        contenido:
          "En Mil Sabores compartimos recetas, tips, novedades y trucos de pastelería. Este post sirve como demostración inicial.",
        autorId: "sistema",
        autorNombre: "Pastelería Mil Sabores",
        fecha: new Date().toISOString().split("T")[0],
        portada: "/images/blog/default.jpg",
        status: "aprobado",
      };

      writeJSON(LOCAL_STORAGE_KEYS.blogs, [exampleBlog]);
    }
  } catch (error) {
    console.error("No fue posible inicializar los datos locales", error);
  }
};
