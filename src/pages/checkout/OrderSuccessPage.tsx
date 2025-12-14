import { useSearchParams } from "react-router-dom";
import { useOrders } from "@/context/orders";
import { Button } from "@/components/common";
import { formatPrice } from "@/utils/format/priceFormatter";

const OrderSuccessPage = () => {
  const [params] = useSearchParams();
  const id = params.get("id");

  const { orders } = useOrders();
  const order = orders.find((o) => o.id === id);

  // Helper para formatear fecha
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-CL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!order) {
    return (
      <section className="bg-cocoa-dark min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h1 className="text-gold font-title mb-4">Pedido no encontrado</h1>
          <Button variant="strawberry" as="link" to="/">
            Volver al inicio
          </Button>
        </div>
      </section>
    );
  }

  // Cálculos para el resumen
  const subtotal = order.items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  const discount = subtotal - order.total;

  return (
    <section className="bg-cocoa-dark min-vh-100 py-5 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="bg-cocoa-strong border-gold rounded-4 p-5 text-center shadow-lg text-white">
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-mint display-1"></i>
              </div>

              <h1 className="text-gold font-title display-5 mb-2">
                ¡Pedido Confirmado!
              </h1>
              <p className="text-white-50 mb-5">
                Gracias por tu compra. Hemos recibido tu pedido correctamente.
              </p>

              <div className="bg-cocoa-input border-gold rounded-3 p-4 mb-4 text-start">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-gold fw-bold">N° Pedido:</span>
                  <span className="font-monospace text-dark">{order.id}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-gold fw-bold">Estado:</span>
                  <span className="badge bg-mint text-dark text-uppercase">{order.status}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-gold fw-bold">Fecha Entrega:</span>
                  <span className="text-dark text-capitalize">{formatDate(order.fechaEntrega)}</span>
                </div>
              </div>

              <h4 className="text-gold font-title mb-3">Resumen del pedido</h4>
              <div className="bg-cocoa-input border-gold rounded-3 p-3 mb-4">
                <ul className="list-unstyled mb-0 text-start">
                  {order.items.map((i) => (
                    <li
                      key={i.codigo}
                      className="d-flex justify-content-between align-items-center py-2 border-bottom border-gold border-opacity-25 last-border-0"
                    >
                      <span className="text-dark">
                        {i.nombre} <small className="text-gold">x{i.cantidad}</small>
                      </span>
                      <span className="text-dark fw-bold">{formatPrice(i.precio * i.cantidad)}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-top border-gold mt-3 pt-2">
                  {/* SUBTOTAL */}
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="text-gold fw-semibold">Subtotal:</span>
                    <span className="text-dark fw-bold">{formatPrice(subtotal)}</span>
                  </div>

                  {/* DESCUENTO (si aplica) */}
                  {discount > 0 && (
                     <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-mint fw-bold">Descuento:</span>
                      <span className="text-mint fw-bold">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  
                  {/* TOTAL */}
                  <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top border-gold border-opacity-25">
                    <span className="text-gold fw-bold h5 mb-0">Total:</span>
                    <span className="text-gold fw-bold h4 mb-0">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-3 justify-content-center">
                <Button
                  variant="strawberry"
                  as="link"
                  to="/"
                  className="rounded-pill shadow-soft fw-bold px-4"
                >
                  Volver al Inicio
                </Button>
                <Button
                  variant="mint"
                  as="link"
                  to="/menu"
                  className="rounded-pill shadow-soft fw-bold px-4"
                >
                  Seguir Comprando
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderSuccessPage;
