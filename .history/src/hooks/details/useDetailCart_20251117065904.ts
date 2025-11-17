import { useCart } from "@/hooks/useCart";
import type { Producto } from "@/service/menuService";

export function useDetailCart(producto?: Producto) {
  const { items, addItem } = useCart();

  // Retorna cuántas unidades de este producto ya están en el carrito 
  const getUnitsInCart = () => {
    if (!producto) return 0;

    return items
      .filter((i) => i.codigo === producto.id)
      .reduce((acc, curr) => acc + curr.cantidad, 0);
  };

  // Stock real considerando lo ya agregado al carrito 
  const getRemainingStock = () => {
    if (!producto) return 0;

    return Math.max(0, producto.stock - getUnitsInCart());
  };

  // Agregar al carrito respetando stock 
  const addToCart = (cantidad: number, mensaje: string) => {
    if (!producto) return;

    const remaining = getRemainingStock();
    if (remaining <= 0) return;

    const finalQty = Math.min(cantidad, remaining);

    addItem({
      codigo: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: finalQty,
      mensaje: mensaje.trim() || undefined,
    });
  };

  return {
    addToCart,
    getRemainingStock,
  };
}
