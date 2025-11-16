import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import useAuth from "@/hooks/useAuth";
import { useOrders } from "@/context/orders";
import { Button } from "@/components/common";
import { generateOrderCode } from "@/utils/storage/generateOrderCode";
import type { Order } from "@/types/order";

const CheckoutPage = () => {
  const { items, totals, clear } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();

  const [fechaEntrega, setFechaEntrega] = useState("");

  const confirmar = () => {
    if (!fechaEntrega) return alert("Selecciona una fecha de entrega");

    const order: Order = {
      id: generateOrderCode(),
      userId: user!.id,
      items,
      fechaPedido: new Date().toISOString(),
      fechaEntrega,
      total: totals.totalPrecio,
      status: "pendiente", // ahora sí válido
    };

    createOrder(order);

    clear();
    window.location.href = "/order-success?id=" + order.id;
  };

  return (
    <section className="container py-4">
      <h1 className="section-title mb-4">Confirmar pedido</h1>

      <label>Fecha de entrega</label>
      <input
        type="date"
        className="form-control mb-3"
        value={fechaEntrega}
        onChange={(e) => setFechaEntrega(e.target.value)}
      />

      <p className="lead">
        <strong>Total a pagar: </strong>{" "}
        ${totals.totalPrecio.toLocaleString()}
      </p>

      <Button variant="mint" onClick={confirmar}>
        Confirmar pedido
      </Button>
    </section>
  );
};

export default CheckoutPage;
