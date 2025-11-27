const isBrowser = typeof window !== "undefined";

export const LOCAL_STORAGE_KEYS = {
  usuarios: "dataUsuarios", // DEPRECATED: No longer used
  regiones: "dataRegiones", // DEPRECATED: No longer used
  comunas: "dataComunas", // DEPRECATED: No longer used
  activeUser: "usuarioActivo",
  contactMessages: "contactMessages",
  menuFilters: "menuFilters",
  blogs: "dataBlogs",
} as const;

export type RegionSeed = {
  id: string;
  region: string;
  comunas: string[];
};

let initialized = false;

export const initLocalData = (force = false) => {
  if (!isBrowser || (initialized && !force)) return;

  initialized = true;

  try {
    // -------------------------------------------------------
    // CLEANUP DEPRECATED DATA
    // -------------------------------------------------------
    if (isBrowser) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.usuarios);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.regiones);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.comunas);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.blogs);
      localStorage.removeItem("likes-v1");
      localStorage.removeItem("menu_cache_v1");
    }

    // -------------------------------------------------------
    // BLOGS (SEED) - DEPRECATED
    // -------------------------------------------------------
    // Logic removed. Blogs are now managed by the backend.
  } catch (error) {
    console.error("No fue posible inicializar los datos locales", error);
  }
};
