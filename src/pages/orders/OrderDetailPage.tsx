import { useParams } from "react-router-dom";
import { useOrders } from "@/context/orders/useOrders";
import { formatPrice } from "@/utils/format/priceFormatter";

const OrderDetailPage = () => {
  const { id } = useParams();
  const { orders } = useOrders();

  const order = orders.find((o) => o.id === id);

  // Helper para formatear fecha
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("es-CL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-gold">Pedido no encontrado</h2>
      </div>
    );
  }

  return (
    <main className="py-5 bg-cocoa-dark min-vh-100">
      <div className="container">
        <h2 className="fw-bold mb-4 text-gold text-center">Detalle del Pedido #{order.id}</h2>

        <div className="card-cocoa mb-4 shadow-lg">
          <div className="card-body p-4 text-white">
            <div className="row">
                <div className="col-md-6 mb-3">
                    <p className="mb-2 text-uppercase small text-gold fw-bold">Estado del pedido</p>
                    <span className="badge bg-mint text-dark px-3 py-2 fs-6">{order.status}</span>
                </div>
                <div className="col-md-6 mb-3">
                    <p className="mb-2 text-uppercase small text-gold fw-bold">Fecha realizada</p>
                    <p className="fs-5 text-capitalize text-white">{formatDate(order.fechaPedido)}</p>
                </div>
            </div>
            <div className="border-top border-gold pt-3 mt-2">
                <div className="d-flex justify-content-between align-items-center">
                    <span className="h4 text-gold mb-0">Total Pagado</span>
                    <span className="h3 mb-0 text-white">{formatPrice(order.total)}</span>
                </div>
            </div>
          </div>
        </div>

        <h4 className="fw-bold mb-3 text-gold">Productos</h4>

        {order.items.map((item) => (
          <div key={item.codigo} className="card-cocoa mb-2 shadow-sm">
            <div className="card-body d-flex gap-3 align-items-center">
              <img
                src={item.imagen}
                alt={item.nombre}
                width={70}
                height={70}
                className="rounded border border-secondary"
                style={{ objectFit: "cover" }}
              />
              <div>
                <h6 className="fw-bold text-white mb-1">{item.nombre}</h6>
                <p className="mb-0 text-premium-body small">
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
