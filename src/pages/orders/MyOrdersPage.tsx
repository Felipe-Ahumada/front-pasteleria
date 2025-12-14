import { useOrders } from "@/context/orders/useOrders";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/common";
import { formatPrice } from "@/utils/format/priceFormatter";

const MyOrdersPage = () => {
  const { orders } = useOrders();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container py-5">
        <h2 className="mb-3 text-gold">Mis pedidos</h2>
        <p className="text-white">Debes iniciar sesión para ver tus pedidos.</p>
        <Button as="link" to="/login" variant="mint">Ir a iniciar sesión</Button>
      </div>
    );
  }

  const myOrders = orders.filter((o) => o.userId === user.id);

  // Helper para formatear fecha (mismo estilo que OrderSuccess)
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    // Verificar si es fecha válida
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

  return (
    <main className="py-5 bg-cocoa-dark min-vh-100">
      <div className="container">
        <h2 className="fw-bold mb-4 text-gold text-center">Mis pedidos</h2>

        {myOrders.length === 0 ? (
          <div className="alert bg-cocoa-glass text-white border-gold text-center">
            Aún no has realizado pedidos.
          </div>
        ) : (
          <div className="row g-4 justify-content-center">
            {myOrders.map((o) => (
              <div key={o.id} className="col-12 col-md-6 col-lg-5">
                <div className="card-cocoa shadow-lg h-100">
                  <div className="card-body p-4 text-center d-flex flex-column align-items-center justify-content-between">
                    <div>
                        <h5 className="fw-bold text-gold mb-3">Pedido #{o.id}</h5>
                        <p className="text-premium-body small mb-2">
                          <i className="bi bi-calendar-event me-1 text-gold"></i>
                          <b className="text-white text-capitalize">{formatDate(o.fechaPedido)}</b>
                        </p>
                        <p className="text-premium-body small mb-3">
                          <span className={`badge ${o.status === 'entregado' ? 'bg-success' : 'bg-mint text-dark'} text-uppercase px-3 py-2`}>
                              {o.status}
                          </span>
                        </p>
                    </div>
                    
                    <div className="mt-3 w-100">
                        <p className="fw-semibold text-white h5 mb-3">
                          {formatPrice(o.total)}
                        </p>
                        <Button
                          as="link"
                          to={`/orders/${o.id}`}
                          variant="mint"
                          className="w-100 rounded-pill fw-bold"
                        >
                          Ver detalles
                        </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrdersPage;
