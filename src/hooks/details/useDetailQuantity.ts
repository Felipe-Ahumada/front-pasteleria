// hooks/details/useDetailQuantity.ts
import { useState, useEffect, type ChangeEvent } from "react";

export function useDetailQuantity(stockRestante: number) {
  const maxQuantity = stockRestante; // ← EL CAMBIO IMPORTANTE

  const [quantity, setQuantity] = useState<string>("");

  useEffect(() => {
    setQuantity("");
  }, [stockRestante]);

  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;

    if (raw === "") {
      setQuantity("");
      return;
    }

    if (!/^\d+$/.test(raw)) return;

    const num = Number(raw);

    if (num === 0) return;

    if (num > maxQuantity) {
      setQuantity(String(maxQuantity));
      return;
    }

    setQuantity(String(num));
  };

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
