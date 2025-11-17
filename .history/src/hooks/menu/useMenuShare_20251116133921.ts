// hooks/menu/useMenuShare.ts
import type { EnrichedProduct } from "./useMenuFilters";

export const useMenuShare = () => {
  const handleShare = async (item: EnrichedProduct) => {
    const url = `${window.location.origin}/menu/${item.codigo_producto}`;

    const data: ShareData = {
      title: item.nombre_producto,
      text: `Descubre ${item.nombre_producto} en Pastelería Mil Sabores`,
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert("Enlace copiado al portapapeles");
      }
    } catch {
      alert("No fue posible compartir.");
    }
  };

  return { handleShare };
};
