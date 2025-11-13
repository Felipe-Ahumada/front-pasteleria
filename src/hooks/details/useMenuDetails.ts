// hooks/details/useMenuDetails.ts
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

  const all: Producto[] = useMemo(() => menuService.getCached(), []);

  const producto = useMemo(
    () => all.find((p) => p.id.toUpperCase() === code),
    [all, code]
  );

  const categoria = producto?.categoria ?? null;

  const quantity = useDetailQuantity(producto);
  const message = useDetailMessage(producto);
  const gallery = useProductGallery(producto);
  const feedback = useCardFeedback();
  const recommended = useDetailRecommend(producto, all);

  const cart = useDetailCart(producto);

  const stockRestante = cart.getRemainingStock();
  const isOutOfStock = stockRestante <= 0;

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

    cart.addToCart(cantidad, msg);

    feedback.scheduleFeedback({
      text: `${cantidad} ${cantidad === 1 ? "unidad" : "unidades"} añadidas al carrito`,
      tone: "success",
    });

    quantity.resetQuantity();
    message.resetMessage();
  };

  return {
    producto,
    categoria,
    recommended,

    quantity: quantity.quantity,
    maxQuantity: quantity.maxQuantity,
    handleQuantityChange: quantity.handleQuantityChange,
    handleQuantityBlur: quantity.handleQuantityBlur,
    resetQuantity: quantity.resetQuantity,

    mensaje: message.mensaje,
    handleMessageChange: message.handleMessageChange,
    resetMessage: message.resetMessage,

    gallery: gallery.gallery,
    primaryImage: gallery.primaryImage,
    selectedImage: gallery.selectedImage,
    setSelectedImage: gallery.setSelectedImage,

    feedback: feedback.feedback,
    scheduleFeedback: feedback.scheduleFeedback,

    addToCart,

    stockRestante,
    isOutOfStock,
  };
}
