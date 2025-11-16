// utils/storage/localStorageUtils.ts

const isBrowser = typeof window !== "undefined";

/** Parseo seguro */
const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn("No fue posible leer datos de localStorage:", error);
    return fallback;
  }
};

/** Leer JSON tipado */
export const readJSON = <T>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;

  const raw = window.localStorage.getItem(key);
  return safeParse<T>(raw, fallback);
};

/** Guardar JSON tipado */
export const writeJSON = (key: string, value: unknown): void => {
  if (!isBrowser) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("No fue posible guardar datos en localStorage:", error);
  }
};

/** Eliminar */
export const removeJSON = (key: string): void => {
  if (!isBrowser) return;
  window.localStorage.removeItem(key);
};

/** Leer array garantizado */
export const readArray = <T>(key: string): T[] => {
  return readJSON<T[]>(key, []);
};

/** Agregar elemento a un array */
export const pushToArray = <T>(key: string, item: T): void => {
  const arr = readArray<T>(key);
  arr.push(item);
  writeJSON(key, arr);
};

/* -------------------------------------------------------------
 * ALIAS DE COMPATIBILIDAD (NO BORRAR - NECESARIOS PARA TU APP)
 * ------------------------------------------------------------- */

/** LEGACY: getLocalData */
export const getLocalData = <T>(key: string): T[] => {
  return readArray<T>(key);
};

/** LEGACY: setLocalData */
export const setLocalData = <T>(key: string, data: T[]): void => {
  writeJSON(key, data);
};

/** LEGACY: getLocalItem (devuelve un objeto o null) */
export const getLocalItem = <T>(key: string): T | null => {
  return readJSON<T | null>(key, null);
};

/** LEGACY: setLocalItem */
export const setLocalItem = <T>(key: string, value: T): void => {
  writeJSON(key, value);
};

/** LEGACY: removeLocalItem */
export const removeLocalItem = (key: string): void => {
  removeJSON(key);
};
/** LEGACY: appendLocalData (alias de pushToArray) */
export const appendLocalData = <T>(key: string, item: T): void => {
  pushToArray(key, item);
};
