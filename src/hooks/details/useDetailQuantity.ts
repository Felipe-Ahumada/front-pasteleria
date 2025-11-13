// hooks/details/useDetailQuantity.ts
import { useState, useEffect, type ChangeEvent } from "react";
import type { Producto } from "@/service/menuService";

export function useDetailQuantity(producto?: Producto) {
  const maxQuantity = producto?.stock ?? 1;

  const [quantity, setQuantity] = useState<string>("");

  /** Reset cuando cambia el producto */
  useEffect(() => {
    setQuantity("");
  }, [producto]);

  /** Solo permitir dígitos 0-9 en la escritura */
  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;

    // Permitir campo vacío temporal
    if (raw === "") {
      setQuantity("");
      return;
    }

    // ❌ Si contiene algo que no sea dígito → ignorar
    if (!/^\d+$/.test(raw)) {
      return;
    }

    // Convertir a número
    const num = Number(raw);

    // ❌ 0 no permitido
    if (num === 0) {
      return;
    }

    // ❌ No permitir sobrepasar el stock
    if (num > maxQuantity) {
      setQuantity(String(maxQuantity));
      return;
    }

    // Valor válido
    setQuantity(String(num));
  };

  /** Normalizar al perder el foco */
  const handleQuantityBlur = () => {
    if (quantity === "") return;

    const num = Number(quantity);

    if (Number.isNaN(num) || num <= 0) {
      setQuantity("");
      return;
    }

    const normalized = Math.min(num, maxQuantity);
    setQuantity(String(normalized));
  };

  const resetQuantity = () => setQuantity("");

  return {
    quantity,
    maxQuantity,
    handleQuantityChange,
    handleQuantityBlur,
    resetQuantity,
  };
}
