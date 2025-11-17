import { Button } from "@/components/common";
import type { Order, OrderStatus } from "@/types/order";

type Props = {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: "Pendiente",
  preparando: "Preparando",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  pendiente: "preparando",
  preparando: "en_camino",
  en_camino: "entregado",
  entregado: null,
  cancelado: null,
};

const OrderAdminModal = ({ order, onClose, onStatusChange }: Props) => {
  const next = NEXT_STATUS[order.status];

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-box-custom">
        <h3 className="mb-3">Pedido #{order.id}</h3>

        <p><b>Estado actual:</b> {STATUS_LABELS[order.status]}</p>
        <p><b>Fecha:</b> {order.fechaPedido}</p>
        <p><b>Total:</b> ${order.total.toLocaleString()}</p>

        <hr />

        <h5>Datos del Cliente</h5>
        <p>{order.envio.nombres} {order.envio.apellidos}</p>
        <p>RUN: {order.envio.run}</p>
        <p>Email: {order.envio.correo}</p>

        <h5 className="mt-3">Envío</h5>
        <p>{order.envio.direccion}, {order.envio.comuna}</p>
        <p>Región ID: {order.envio.regionId}</p>
        <p><b>Método pago:</b> {order.envio.metodoPago}</p>

        <hr />

        <h5>Productos</h5>
        {order.items.map((item) => (
          <div key={item.codigo} className="d-flex gap-3 mb-2">
            <img
              src={item.imagen}
              alt={item.nombre}
              width="60"
              height="60"
              className="rounded"
              style={{ objectFit: "cover" }}
            />
            <div>
              <b>{item.nombre}</b>
              <p className="mb-0 small">
                {item.cantidad} × ${item.precio.toLocaleString()}
              </p>
            </div>
          </div>
        ))}

        <div className="d-flex justify-content-between mt-4">
          <Button variant="strawberry" onClick={onClose}>
            Cerrar
          </Button>

          {next && (
            <Button
              variant="mint"
              onClick={() => onStatusChange(order.id, next)}
            >
              Avanzar a "{STATUS_LABELS[next]}"
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderAdminModal;
