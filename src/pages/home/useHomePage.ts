import { useCallback, useEffect, useMemo, useState } from "react";
import { Carousel } from "bootstrap";
import {
  menuService,
  type Producto,
} from "@/service/menuService";
import menuData from "@/data/menu_datos.json";

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

const CAROUSEL_IMAGES = {
  menu: "https://res.cloudinary.com/dx83p4455/image/upload/v1762263515/carrusel_carta_oznheh.jpg",
  about:
    "https://res.cloudinary.com/dx83p4455/image/upload/v1762263484/diversos_productos_cautgn.jpg",
  blog: "https://res.cloudinary.com/dx83p4455/image/upload/v1762263515/carrusel_blog_knmeix.jpg",
  social:
    "https://res.cloudinary.com/dx83p4455/image/upload/v1762263516/diversidad_pasteles_ttxbx1.jpg",
} as const;

const carouselData: CarouselItem[] = [
  {
    id: "menu",
    image: CAROUSEL_IMAGES.menu,
    alt: "Torta con frutas",
    caption: { type: "internal", ctaLabel: "Ver carta", to: "/menu" },
  },
  {
    id: "about",
    image: CAROUSEL_IMAGES.about,
    alt: "Vitrina de pastelería",
    caption: { type: "internal", ctaLabel: "Conócenos", to: "/about" },
  },
  {
    id: "blog",
    image: CAROUSEL_IMAGES.blog,
    alt: "Persona usando laptop",
    caption: { type: "internal", ctaLabel: "Visita nuestro blog", to: "/blog" },
  },
  {
    id: "social",
    image: CAROUSEL_IMAGES.social,
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

type CarouselStatic = {
  getInstance?: (element: Element) => InstanceType<typeof Carousel> | null;
  new (element: Element, config?: Record<string, unknown>): InstanceType<
    typeof Carousel
  >;
};

const SafeCarousel = Carousel as unknown as CarouselStatic;

export function useHomePage() {
  const [productos, setProductos] = useState<Producto[]>([]);

  /** ===============================
   *  1) Cargar productos del service
   *  =============================== */
  /** ===============================
   *  1) Cargar productos del service
   *  =============================== */
  const refreshProducts = useCallback(async () => {
    try {
      const data = await menuService.getActive();
      setProductos(data);
    } catch (error) {
      console.error("Error loading home products:", error);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

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
      { id: string; name: string; productCount: number; image: string; categoryId: number }
    > = {};

    for (const producto of productos) {
      const categoria = producto.categoria;

      if (!map[categoria]) {
        const catData = menuData.categorias.find((c) => c.nombre_categoria === categoria);
        const realId = catData?.id_categoria ?? 0;

        map[categoria] = {
          id: categoria,
          name: categoria,
          productCount: 1,
          image: producto.imagen,
          categoryId: realId,
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
