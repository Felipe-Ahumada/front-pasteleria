import { useState, useCallback, useEffect } from "react";
import { showOffcanvas, hideOffcanvas } from "@/utils/offcanvas";

/**
 * Estado persistente para el menú móvil.
 */
const STORAGE_KEY = "mobile_nav_open";

export function useMobileNav() {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  // Guarda el estado en localStorage para persistencia
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(isOpen));
  }, [isOpen]);

  /**
   * Alterna el menú
   */
  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  /**
   * Cierra el menú
   */
  const closeMenu = useCallback(() => {
    setIsOpen(false);
    hideOffcanvas("offcanvasLogin");
  }, []);

  /**
   * Abre el menú
   */
  const openMenu = useCallback(() => {
    setIsOpen(true);
    showOffcanvas("offcanvasLogin");
  }, []);

  return {
    isOpen,
    toggleMenu,
    closeMenu,
    openMenu,
  };
}
