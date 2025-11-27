// hooks/details/useMenuDetails.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { menuService } from "@/service/menuService";
import type { Producto } from "@/service/menuService";

import { useDetailQuantity } from "./useDetailQuantity";
import { useDetailMessage } from "./useDetailMessage";
import { useProductGallery } from "./useProductGallery";
import { useDetailRecommend } from "./useDetailRecommend";
import { useCardFeedback } from "./useCardFeedback";
import { useDetailCart } from "./useDetailCart";

export function useMenuDetails() {
  const { productCode } = useParams<{ productCode: string }>();
  const code = (productCode ?? "").toUpperCase();

  const [productosActivos, setProductosActivos] = useState<Producto[]>([]);

  // Todos los productos desde el service (cacheado)
  const refreshProductos = useCallback(async () => {
    try {
      const data = await menuService.getActive();
      setProductosActivos(data);
    } catch (error) {
      console.error("Error loading details products:", error);
    }
  }, []);

  useEffect(() => {
    refreshProductos();
  }, [refreshProductos]);

  // Producto activo
  const producto = useMemo(
    () => productosActivos.find((p) => p.id.toUpperCase() === code),
    [productosActivos, code]
  );

  const categoria = producto?.categoria ?? null;

  // Carrito + stock restante
  const cart = useDetailCart(producto);
  const stockRestante = cart.getRemainingStock();
  const isOutOfStock = stockRestante <= 0;

  // CANTIDAD
  const quantity = useDetailQuantity(stockRestante);

  // MENSAJE
  const message = useDetailMessage(producto);

  // GALERÍA
  const gallery = useProductGallery(producto);

  // FEEDBACK
  const feedback = useCardFeedback();

  // RECOMENDADOS
  const recommended = useDetailRecommend(producto, productosActivos);

  // AÑADIR AL CARRITO
  const addToCart = () => {
    if (!producto || isOutOfStock) return;

    const cantidad = Number(quantity.quantity);
    const msg = message.mensaje;

    if (!cantidad || cantidad <= 0) {
      feedback.scheduleFeedback({
        text: "Debes seleccionar una cantidad válida.",
        tone: "danger",
      });
      return;
    }

    // Respeta stock restante
    cart.addToCart(cantidad, msg);

    feedback.scheduleFeedback({
      text: `${cantidad} ${
        cantidad === 1 ? "unidad" : "unidades"
      } añadidas al carrito`,
      tone: "success",
    });

    // Reset de cantidad y mensaje
    quantity.resetQuantity();
    message.resetMessage();
  };

  return {
    producto,
    categoria,
    recommended,

    /** Cantidad */
    quantity: quantity.quantity,
    maxQuantity: quantity.maxQuantity,
    handleQuantityChange: quantity.handleQuantityChange,
    handleQuantityBlur: quantity.handleQuantityBlur,
    resetQuantity: quantity.resetQuantity,

    /** Mensaje */
    mensaje: message.mensaje,
    handleMessageChange: message.handleMessageChange,
    resetMessage: message.resetMessage,

    /** Galería */
    gallery: gallery.gallery,
    primaryImage: gallery.primaryImage,
    selectedImage: gallery.selectedImage,
    setSelectedImage: gallery.setSelectedImage,

    /** Feedback */
    feedback: feedback.feedback,
    scheduleFeedback: feedback.scheduleFeedback,

    /** Carrito */
    addToCart,

    /** Stock */
    stockRestante,
    isOutOfStock,
  };
}
