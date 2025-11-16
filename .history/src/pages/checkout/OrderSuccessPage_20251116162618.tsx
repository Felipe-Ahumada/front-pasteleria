import { useSearchParams } from "react-router-dom";
import { useOrders } from "@/context/orders";

const OrderSuccessPage = () => {
  const [params] = useSearchParams();
  const id = params.get("id");

  const { orders } = useOrders();
  const order = orders.find(o => o.id === id);

  if (!order) return <p>Pedido no encontrado</p>;

  return (
    <section className="container py-4">
      <h1 className="section-title">¡Pedido confirmado!</h1>

      <p><strong>N° Pedido:</strong> {order.id}</p>
      <p><strong>Estado:</strong> {order.status}</p>
      <p><strong>Entrega:</strong> {order.fechaEntrega}</p>

      <h3 className="mt-4">Resumen</h3>
      <ul>
        {order.items.map(i => (
          <li key={i.codigo}>
            {i.nombre} × {i.cantidad}
          </li>
        ))}
      </ul>

      <h4>Total: ${order.total.toLocaleString()}</h4>
    </section>
  );
};

export default OrderSuccessPage;
