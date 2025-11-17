import { useMemo, useState, useEffect } from "react";
import type { Producto } from "@/service/menuService";

import {
  toSlug,
  detailImageMap,
  formatImagePath,
} from "@/utils/storage/imageHelpers";

/**
 * Hook que construye la galería completa del producto.
 */
export function useProductGallery(producto?: Producto) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Construir galería a partir de la imagen principal + extras
  const gallery = useMemo(() => {
    if (!producto) return [];

    // Slug basado en "nombre"
    const slug = toSlug(producto.nombre);

    // Imágenes extras desde el producto
    const extrasFromProduct = (producto.imagenes_detalle ?? []).map(
      formatImagePath
    );
    const extrasFromAssets = detailImageMap[slug] ?? [];
    const extras = [...extrasFromProduct, ...extrasFromAssets];

    // Imagen principal normalizada
    const main = formatImagePath(producto.imagen);

    return Array.from(new Set([main, ...extras]));
  }, [producto]);

  // Mantener o seleccionar imagen inicial
  useEffect(() => {
    if (!gallery.length) {
      setSelectedImage(null);
      return;
    }

    setSelectedImage((prev) =>
      prev && gallery.includes(prev) ? prev : gallery[0]
    );
  }, [gallery]);

  const primaryImage = selectedImage ?? gallery[0] ?? null;

  return {
    gallery,
    primaryImage,
    selectedImage,
    setSelectedImage,
  };
}
