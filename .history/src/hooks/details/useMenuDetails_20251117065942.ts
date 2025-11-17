import { useMemo } from "react";
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

  // Todos los productos desde el service (cacheado)
  const all: Producto[] = useMemo(() => menuService.getCached(), []);

  // Producto activo
  const producto = useMemo(
    () => all.find((p) => p.id.toUpperCase() === code),
    [all, code]
  );

  const categoria = producto?.categoria ?? null;

  // Carrito + stock restante
  const cart = useDetailCart(producto);
  const stockRestante = cart.getRemainingStock();
  const isOutOfStock = stockRestante <= 0;

  // CANTIDAD (corregido → ahora depende del stockRestante)
  const quantity = useDetailQuantity(stockRestante);

  // MENSAJE
  const message = useDetailMessage(producto);

  // GALERÍA
  const gallery = useProductGallery(producto);

  // FEEDBACK
  const feedback = useCardFeedback();

  // RECOMENDADOS
  const recommended = useDetailRecommend(producto, all);

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
      text: `${cantidad} ${cantidad === 1 ? "unidad" : "unidades"} añadidas al carrito`,
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
