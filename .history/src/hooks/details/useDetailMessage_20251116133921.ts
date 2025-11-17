// hooks/details/useDetailMessage.ts
import { useState, useEffect, useCallback } from "react";
import { readJSON, writeJSON } from "@/utils/storage/localStorageUtils";
import type { Producto } from "@/service/menuService";

const KEY_MSGS = "mensajesCarrito";
const MAX_LENGTH = 25;

export function useDetailMessage(producto?: Producto) {
  const [mensaje, setMensaje] = useState("");

  /** ------------------------------
   *  Cargar mensaje guardado (draft)
   * ------------------------------ */
  useEffect(() => {
    if (!producto) {
      setMensaje("");
      return;
    }

    const drafts = readJSON<Record<string, string>>(KEY_MSGS, {});
    setMensaje(drafts[producto.id] ?? "");
  }, [producto]);

  /** ------------------------------
   *  Guardar mensaje al escribir
   * ------------------------------ */
  const handleMessageChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!producto) return;

      const value = event.target.value.slice(0, MAX_LENGTH);
      setMensaje(value);

      const drafts = readJSON<Record<string, string>>(KEY_MSGS, {});
      drafts[producto.id] = value;
      writeJSON(KEY_MSGS, drafts);
    },
    [producto]
  );

  /** ------------------------------
   *  Resetear mensaje (UI + localStorage)
   * ------------------------------ */
  const resetMessage = useCallback(() => {
    if (!producto) return;

    setMensaje("");

    const drafts = readJSON<Record<string, string>>(KEY_MSGS, {});
    delete drafts[producto.id];
    writeJSON(KEY_MSGS, drafts);
  }, [producto]);

  return {
    mensaje,
    handleMessageChange,
    resetMessage,
    maxMessageLength: MAX_LENGTH,
  };
}
