// hooks/details/useDetailRecommend.ts
import { useMemo } from "react";
import type { Producto } from "@/service/menuService";

export function useDetailRecommend(producto?: Producto, all: Producto[] = []) {
  return useMemo(() => {
    if (!producto) return [];

    const pool = all.filter((p) => p.id !== producto.id);

    // hacemos un shuffle una sola vez
    const shuffled = [...pool]
      .sort((a, b) => a.id.localeCompare(b.id)) // orden estable
      .sort(() => Math.random() - 0.5);        // aleatorio solo 1 vez

    return shuffled.slice(0, 3);
  }, [producto]); // ❗ ojo: solo depende del producto
}