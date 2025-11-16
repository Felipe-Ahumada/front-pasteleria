import { useEffect, useState, useCallback } from "react";

const ABOUT_IMAGES = {
  about:
    "https://res.cloudinary.com/dx83p4455/image/upload/v1762263485/vista_pasteleria_mil_sabores_vi5hwh.jpg",
  mission:
    "https://res.cloudinary.com/dx83p4455/image/upload/v1762263484/diversos_productos_cautgn.jpg",
  vision:
    "https://res.cloudinary.com/dx83p4455/image/upload/v1762263485/persona_trabajando_en_una_cocina_f6nkxe.jpg",
  community:
    "https://res.cloudinary.com/dx83p4455/image/upload/v1762263484/estudiante_de_reposteria_aprendiendo_en_la_cocina_mv6hjy.jpg",
} as const;

export interface StoryBlock {
  id: string;
  title: string;
  description: string[];
  image: string;
  imageAlt: string;
  invert?: boolean;
}

/**
 * Contenido estático (simula lo que podría venir desde un CMS o backend)
 */
const STATIC_ABOUT_DATA: StoryBlock[] = [
  {
    id: "about",
    title: "Quiénes somos",
    description: [
      "En Pastelería Mil Sabores celebramos 50 años de historia endulzando momentos únicos y siendo un referente de la repostería chilena.",
      "Desde nuestro récord Guinness en 1995, cuando colaboramos en la creación de la torta más grande del mundo, mantenemos viva la tradición de innovar y sorprender con cada creación.",
      "Hoy renovamos nuestro sistema de ventas online para que nuestros clientes disfruten de una experiencia moderna y accesible, llevando la dulzura directamente a sus hogares.",
    ],
    image: ABOUT_IMAGES.about,
    imageAlt: "Tienda Pastelería Mil Sabores",
  },
  {
    id: "mission",
    title: "Misión",
    description: [
      "Ofrecer una experiencia dulce y memorable, proporcionando tortas y productos de repostería de alta calidad para todas las ocasiones.",
      "Celebramos nuestras raíces históricas y fomentamos la creatividad en la repostería chilena.",
    ],
    image: ABOUT_IMAGES.mission,
    imageAlt: "Diversos productos de repostería",
    invert: true,
  },
  {
    id: "vision",
    title: "Visión",
    description: [
      "Convertirnos en la tienda online líder de repostería en Chile, reconocida por la calidad, la innovación y el impacto positivo en la comunidad.",
      "Queremos ser una plataforma de impulso para las nuevas generaciones de talentos gastronómicos.",
    ],
    image: ABOUT_IMAGES.vision,
    imageAlt: "Persona trabajando en una cocina",
  },
  {
    id: "community",
    title: "Impacto comunitario",
    description: [
      "Cada compra apoya a estudiantes de gastronomía y a la comunidad local, contribuyendo a que nuevas generaciones de reposteros sigan creando y compartiendo su arte.",
    ],
    image: ABOUT_IMAGES.community,
    imageAlt: "Estudiante de repostería aprendiendo en la cocina",
    invert: true,
  },
];

/**
 * Clave para caché local
 */
const CACHE_KEY = "about_content_v1";

/**
 * Hook: gestiona datos, caché y carga del contenido
 */
export function useAboutPage() {
  const [blocks, setBlocks] = useState<StoryBlock[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAboutData = useCallback(() => {
    try {
      // 🔹 1. Buscar en caché local
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        setBlocks(JSON.parse(cached));
        setLoading(false);
        return;
      }

      // 🔹 2. Simular fetch (o carga estática)
      setTimeout(() => {
        setBlocks(STATIC_ABOUT_DATA);
        localStorage.setItem(CACHE_KEY, JSON.stringify(STATIC_ABOUT_DATA));
        setLoading(false);
      }, 300);
    } catch (err) {
      console.error("Error cargando contenido About:", err);
      setBlocks(STATIC_ABOUT_DATA);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAboutData();
  }, [loadAboutData]);

  return { blocks, loading };
}
