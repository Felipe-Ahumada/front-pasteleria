import { useState, useMemo } from "react";
import { useOrders } from "@/context/orders/useOrders";
import type { Order, OrderStatus } from "@/types/order";

export const useAdminOrders = () => {
  const { orders, updateStatus } = useOrders();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "todos">("todos");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Búsqueda + filtro
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.id.includes(search) ||
        o.envio.run.toLowerCase().includes(search.toLowerCase()) ||
        o.envio.correo.toLowerCase().includes(search.toLowerCase());

      const matchStatus = filterStatus === "todos" || o.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [orders, search, filterStatus]);

  const openOrder = (order: Order) => setSelectedOrder(order);
  const closeOrder = () => setSelectedOrder(null);

  const changeStatus = (id: string, status: OrderStatus) => {
    updateStatus(id, status);

    // Actualizar modal si estamos dentro del modal
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  return {
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filtered,
    selectedOrder,
    openOrder,
    closeOrder,
    changeStatus,
  };
};
