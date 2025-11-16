import { useParams } from "react-router-dom";
import { useOrders } from "@/context/orders/useOrders";
import { formatPrice } from "@/utils/format/priceFormatter";

const OrderDetailPage = () => {
  const { id } = useParams();
  const { orders } = useOrders();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="container py-5">
        <h2>Pedido no encontrado</h2>
      </div>
    );
  }

  return (
    <main className="py-5 bg-light-subtle">
      <div className="container">
        <h2 className="fw-bold mb-4">Pedido #{order.id}</h2>

        <div className="card mb-4 shadow-sm border-0">
          <div className="card-body">
            <p><b>Estado:</b> {order.status}</p>
            <p><b>Fecha del pedido:</b> {order.fechaPedido}</p>
            <p><b>Total:</b> {formatPrice(order.total)}</p>
          </div>
        </div>

        <h4 className="fw-bold mb-3">Productos</h4>

        {order.items.map((item) => (
          <div key={item.codigo} className="card mb-2 shadow-sm border-0">
            <div className="card-body d-flex gap-3 align-items-center">
              <img
                src={item.imagen}
                alt={item.nombre}
                width={70}
                height={70}
                className="rounded"
                style={{ objectFit: "cover" }}
              />
              <div>
                <h6 className="fw-bold">{item.nombre}</h6>
                <p className="mb-0 text-muted small">
                  {item.cantidad} × {formatPrice(item.precio)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default OrderDetailPage;
