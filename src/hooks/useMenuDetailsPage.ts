import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { menuService, MENU_CACHE_UPDATED_EVENT, type Producto } from "@/service/menuService";

export interface FeedbackState {
  text: string;
  tone: "success" | "danger" | "info";
}

const CART_KEY = "carrito";

export const useMenuDetailsPage = () => {
  const { productCode } = useParams<{ productCode: string }>();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [recommended, setRecommended] = useState<Producto[]>([]);
  const [quantity, setQuantity] = useState<number | string>("");
  const [mensaje, setMensaje] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const feedbackTimeout = useRef<number | null>(null);

  const refreshProducto = useCallback(() => {
    const all = menuService.getActive();
    const found = all.find((p) => p.id.toLowerCase() === productCode?.toLowerCase()) ?? null;
    setProducto(found);

    const others = all.filter((p) => p.id !== found?.id);
    setRecommended(others.slice(0, 3));
  }, [productCode]);

  useEffect(() => {
    refreshProducto();
  }, [refreshProducto]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = () => refreshProducto();
    window.addEventListener(MENU_CACHE_UPDATED_EVENT, handler);

    return () => {
      window.removeEventListener(MENU_CACHE_UPDATED_EVENT, handler);
    };
  }, [refreshProducto]);

  useEffect(() => {
    // Reinicia cantidad y mensaje al cambiar de producto
    setQuantity("");
    setMensaje("");
  }, [productCode]);

  const scheduleFeedback = useCallback((next: FeedbackState) => {
    setFeedback(next);
    if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
    feedbackTimeout.current = window.setTimeout(() => setFeedback(null), 3500);
  }, []);

  /**
   * ✅ Controla que solo se puedan ingresar números positivos.
   * Si el usuario escribe 0 o negativo, se corrige automáticamente a vacío.
   */
  const handleQuantityChange = useCallback((value: string) => {
    if (!/^\d*$/.test(value)) return; // ignora caracteres no numéricos

    const parsed = Number(value);
    if (parsed <= 0) {
      setQuantity("");
    } else {
      setQuantity(parsed);
    }
  }, []);

  const addToCart = useCallback(() => {
    if (!producto) return;
    const parsed = Number(quantity);
    if (Number.isNaN(parsed) || parsed <= 0) {
      scheduleFeedback({ text: "Cantidad inválida.", tone: "danger" });
      return;
    }

    const current = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    const idx = current.findIndex((i: { id: string }) => i.id === producto.id);

    if (idx >= 0) current[idx].cantidad += parsed;
    else current.push({ ...producto, cantidad: parsed });

    localStorage.setItem(CART_KEY, JSON.stringify(current));

    scheduleFeedback({ text: "Producto agregado al carrito 🎂", tone: "success" });
    setQuantity("");
    setMensaje("");
  }, [producto, quantity, scheduleFeedback]);

  return {
    producto,
    recommended,
    quantity,
    mensaje,
    feedback,
    setMensaje,
    addToCart,
    handleQuantityChange, // ✅ nuevo método para manejar entrada segura
  };
};
