import { useEffect, useMemo, useState } from "react";
import { Carousel } from "bootstrap";
import { menuService, type Producto } from "@/service/menuService";

export interface CarouselItem {
  id: string;
  image: string;
  alt: string;
  caption?: {
    type?: "internal" | "external";
    ctaLabel: string;
    to: string;
  };
  overlay?: {
    title: string;
    subtitle: string;
    highlight: string;
  };
}

const carouselId = "homeCarousel";

const carouselData: CarouselItem[] = [
  {
    id: "menu",
    image: new URL("@/assets/images/carrusel/carrusel_carta.jpg", import.meta.url).href,
    alt: "Torta con frutas",
    caption: { type: "internal", ctaLabel: "Ver carta", to: "/menu" },
  },
  {
    id: "about",
    image: new URL("@/assets/images/carrusel/carrusel_nosotros.jpg", import.meta.url).href,
    alt: "Vitrina de pastelería",
    caption: { type: "internal", ctaLabel: "Conócenos", to: "/about" },
  },
  {
    id: "blog",
    image: new URL("@/assets/images/carrusel/carrusel_blog.jpg", import.meta.url).href,
    alt: "Persona usando laptop",
    caption: { type: "internal", ctaLabel: "Visita nuestro blog", to: "/blog" },
  },
  {
    id: "social",
    image: new URL("@/assets/images/carrusel/diversidad_pasteles.jpg", import.meta.url).href,
    alt: "Vitrina con variedad de pasteles",
    overlay: {
      title: "TRIVIA MIL SABORES",
      subtitle: "Síguenos en Instagram y participa",
      highlight: "Gana descuentos permanentes",
    },
    caption: {
      type: "external",
      ctaLabel: "Ir a Instagram",
      to: "https://www.instagram.com/pasteleria1000sabores",
    },
  },
];

/** ======================================
 *  Tipo seguro para Bootstrap.getInstance
 *  ====================================== */
type CarouselStatic = {
  getInstance?: (element: Element) => InstanceType<typeof Carousel> | null;
  new (element: Element, config?: Record<string, unknown>): InstanceType<typeof Carousel>;
};

const SafeCarousel = Carousel as unknown as CarouselStatic;

export function useHomePage() {
  const [productos, setProductos] = useState<Producto[]>([]);

  /** ===============================
   *  1) Cargar productos del service
   *  =============================== */
  useEffect(() => {
    async function load() {
      const data = await menuService.getAll();
      setProductos(data);
    }
    load();
  }, []);

  /** ===============================
   *  2) Inicializar carrusel
   *  =============================== */
  useEffect(() => {
    const el = document.getElementById(carouselId);
    if (!el) return;

    // tipo totalmente seguro
    const instance =
      SafeCarousel.getInstance?.(el) ||
      new SafeCarousel(el, {
        interval: 3000,
        pause: "hover",
        touch: true,
      });

    instance.cycle?.();

    return () => {
      instance.pause?.();
    };
  }, []);

  /** ===============================
   *  3) Categorías destacadas
   *  =============================== */
  const featuredCategories = useMemo(() => {
    if (productos.length === 0) return [];

    const map: Record<
      string,
      { id: string; name: string; productCount: number; image: string }
    > = {};

    for (const producto of productos) {
      const categoria = producto.categoria;

      if (!map[categoria]) {
        map[categoria] = {
          id: categoria,
          name: categoria,
          productCount: 1,
          image: producto.imagen,
        };
      } else {
        map[categoria].productCount++;
      }
    }

    return Object.values(map);
  }, [productos]);

  return {
    carouselId,
    carouselData,
    featuredCategories,
  };
}
