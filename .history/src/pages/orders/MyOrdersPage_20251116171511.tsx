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
        <h2 className="mb-3">Mis pedidos</h2>
        <p>Debes iniciar sesión para ver tus pedidos.</p>
        <Button as="link" to="/login" variant="mint">Ir a iniciar sesión</Button>
      </div>
    );
  }

  const myOrders = orders.filter((o) => o.userId === user.id);

  return (
    <main className="py-5 bg-light-subtle">
      <div className="container">
        <h2 className="fw-bold mb-4">Mis pedidos</h2>

        {myOrders.length === 0 ? (
          <div className="alert alert-info">
            Aún no has realizado pedidos.
          </div>
        ) : (
          <div className="row g-3">
            {myOrders.map((o) => (
              <div key={o.id} className="col-12 col-md-6 col-lg-4">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="fw-bold">Pedido #{o.id}</h5>
                    <p className="text-muted small mb-1">
                      Fecha pedido: <b>{o.fechaPedido}</b>
                    </p>
                    <p className="text-muted small mb-1">
                      Estado: <span className="badge bg-info">{o.status}</span>
                    </p>
                    <p className="fw-semibold mt-3">
                      Total: {formatPrice(o.total)}
                    </p>
                    <Button
                      as="link"
                      to={`/orders/${o.id}`}
                      variant="mint"
                      className="mt-2"
                    >
                      Ver detalles
                    </Button>
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
