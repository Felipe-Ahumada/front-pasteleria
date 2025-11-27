import type { CartItem } from "@/context/cart/CartContext";

export interface DiscountInfo {
  isDuocStudent: boolean;
  isBirthday: boolean;
  age: number;
  discountCode?: string;
}

/** Verifica si hoy es cumpleaños */
export const isBirthdayToday = (fechaNacimiento?: string): boolean => {
  if (!fechaNacimiento) return false;

  const birthday = new Date(fechaNacimiento);
  const today = new Date();

  return (
    birthday.getDate() === today.getDate() &&
    birthday.getMonth() === today.getMonth()
  );
};

/** Calcula edad del usuario */
export const getAge = (fechaNacimiento?: string): number => {
  if (!fechaNacimiento) return 0;

  const today = new Date();
  const birth = new Date(fechaNacimiento);

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

/** Devuelve true si el usuario tiene correo DUOC */
export const isDuocStudent = (email: string): boolean => {
  if (!email) return false;
  return email.endsWith("@duoc.cl") || email.endsWith("@profesor.duoc.cl");
};

/** Devuelve true si el producto es torta */
const isTorta = (codigo: string): boolean => {
  return (
    codigo.startsWith("TC") ||
    codigo.startsWith("TT") ||
    codigo.startsWith("TE")
  );
};

/** DESCUENTOS PRINCIPALES */
export const calculateUserDiscounts = (
  userInfo: DiscountInfo | null,
  items: CartItem[],
  subtotal: number
) => {
  if (!userInfo) {
    return {
      totalDiscount: 0,
      finalPrice: subtotal,
      description: [],
    };
  }

  const descriptions: string[] = [];
  let discount = 0;

  const { age, isBirthday, isDuocStudent: isDuoc, discountCode } = userInfo;

  /* ----------------------------
   1) DESCUENTO: MAYORES DE 50
  ----------------------------- */
  if (age >= 50) {
    const d = subtotal * 0.5;
    discount += d;
    descriptions.push("Descuento 50% por ser mayor de 50 años");
  }

  /* ----------------------------
   2) DESCUENTO: CÓDIGO FELICES50
  ----------------------------- */
  if (discountCode === "FELICES50") {
    const d = subtotal * 0.1;
    discount += d;
    descriptions.push("Descuento 10% por usar código FELICES50");
  }

  /* ----------------------------
   3) TORTA GRATIS POR CUMPLEAÑOS
  ----------------------------- */
  if (isBirthday && isDuoc) {
    const tortas = items.filter((i) => isTorta(i.codigo));

    if (tortas.length > 0) {
      const tortaValue = tortas.reduce(
        (acc, t) => acc + t.precio * t.cantidad,
        0
      );
      discount += tortaValue;
      descriptions.push("Torta GRATIS por cumpleaños (correo DUOC)");
    }
  }

  /* ----------------------------
   FINAL
  ----------------------------- */
  const finalPrice = Math.max(0, subtotal - discount);

  return {
    totalDiscount: discount,
    finalPrice,
    description: descriptions,
  };
};
