import { useAdminOrders } from "@/hooks/admin/useAdminOrders";
import OrderAdminModal from "./OrderAdminModal";
import { Button } from "@/components/common";

const OrdersAdminPage = () => {
  const {
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filtered,
    selectedOrder,
    openOrder,
    closeOrder,
    changeStatus,
  } = useAdminOrders();

  return (
    <div className="container py-4">
      <h2 className="mb-4">Gestión de Pedidos</h2>

      {/* Filtros */}
      <div className="d-flex gap-3 mb-4">
        <input
          className="form-control"
          placeholder="Buscar por ID, RUN o correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="form-select"
          style={{ maxWidth: "250px" }}
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as any)
          }
        >
          <option value="todos">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="preparando">Preparando</option>
          <option value="en_camino">En camino</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {/* Tabla de pedidos */}
      <div className="table-responsive shadow-sm">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Correo</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.envio.nombres} {order.envio.apellidos}</td>
                <td>{order.envio.correo}</td>
                <td>{order.fechaPedido}</td>
                <td>${order.total.toLocaleString()}</td>
                <td>
                  <span className="badge bg-info">
                    {order.status}
                  </span>
                </td>
                <td>
                  <Button
                    variant="mint"
                    onClick={() => openOrder(order)}
                  >
                    Ver
                  </Button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No se encontraron pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedOrder && (
        <OrderAdminModal
          order={selectedOrder}
          onClose={closeOrder}
          onStatusChange={changeStatus}
        />
      )}
    </div>
  );
};

export default OrdersAdminPage;
