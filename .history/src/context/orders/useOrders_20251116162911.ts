import { useContext } from "react";
import { OrderContext } from "./OrderContext";

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error("useOrders debe usarse dentro de <OrderProvider>");
  }
  return ctx;
};
