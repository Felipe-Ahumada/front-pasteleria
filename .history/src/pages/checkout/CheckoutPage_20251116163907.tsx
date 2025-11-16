import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import useAuth from "@/hooks/useAuth";
import { useOrders } from "@/context/orders";
import { Button } from "@/components/common";
import regionesData from "@/data/region_comuna.json";
import { generateOrderCode } from "@/utils/storage/generateOrderCode";
import { formatPrice } from "@/utils/format/priceFormatter";
import type { OrderStatus } from "@/types/order";

const CheckoutPage = () => {
  const { items, totals, clear } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();

  // ===========================
  // FORM STATE
  // ===========================
  const [form, setForm] = useState({
    run: "",
    correo: user?.email ?? "",
    nombres: "",
    apellidos: "",
    regionId: "",
    comuna: "",
    direccion: "",
    fecha: "",
    tipoEntrega: "",
    pago: "Webpay",
  });

  // Manejo genérico del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Lista de regiones
  const regiones = regionesData as {
    id: string;
    region: string;
    comunas: string[];
  }[];

  // Lista de comunas según región
  const comunas =
    regiones.find((r: any) => r.id === form.regionId)?.comunas ?? [];

  // ===========================
  // CONFIRMAR PEDIDO
  // ===========================
  const confirmar = () => {
    if (!form.fecha || !form.regionId || !form.comuna || !form.direccion) {
      return alert("Completa todos los campos obligatorios");
    }

    const order = {
      id: generateOrderCode(),
      userId: user!.id,
      items,
      fechaPedido: new Date().toISOString(),
      fechaEntrega: form.fecha,
      total: totals.totalPrecio,
      status: "pendiente" as OrderStatus,
      envio: {
        run: form.run,
        nombres: form.nombres,
        apellidos: form.apellidos,
        correo: form.correo,
        regionId: form.regionId,
        comuna: form.comuna,
        direccion: form.direccion,
        tipoEntrega: form.tipoEntrega,
        metodoPago: form.pago,
      },
    };

    createOrder(order);

    clear();
    window.location.href = "/order-success?id=" + order.id;
  };

  return (
    <section className="container py-5">
      {/* ===========================
          TÍTULO
      ============================ */}
      <h1 className="section-title text-center mb-5">
        Procesamiento de Pedidos
      </h1>

      {/* ===========================
          RESUMEN DEL CARRITO
      ============================ */}
      <div className="card card-soft shadow-soft p-4 mb-4">
        <h4 className="mb-3">Resumen del carrito</h4>

        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cant.</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={`${i.codigo}-${i.mensaje ?? ""}`}>
                <td>{i.nombre}</td>
                <td>{i.cantidad}</td>
                <td>{formatPrice(i.precio)}</td>
                <td>{formatPrice(i.precio * i.cantidad)}</td>
              </tr>
            ))}

            <tr className="fw-semibold">
              <td colSpan={3} className="text-end">
                Total
              </td>
              <td>{formatPrice(totals.totalPrecio)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ===========================
          FORMULARIO
      ============================ */}
      <div className="card card-soft shadow-soft p-4">
        <h4 className="mb-4">Información de Entrega</h4>

        <div className="row g-3">
          {/* RUN */}
          <div className="col-md-6">
            <label className="form-label">RUN</label>
            <input
              type="text"
              name="run"
              className="form-control"
              placeholder="12345678-9"
              value={form.run}
              onChange={handleChange}
            />
          </div>

          {/* CORREO */}
          <div className="col-md-6">
            <label className="form-label">Correo</label>
            <input
              type="email"
              name="correo"
              className="form-control"
              value={form.correo}
              onChange={handleChange}
            />
          </div>

          {/* NOMBRES */}
          <div className="col-md-6">
            <label className="form-label">Nombres</label>
            <input
              type="text"
              name="nombres"
              className="form-control"
              value={form.nombres}
              onChange={handleChange}
            />
          </div>

          {/* APELLIDOS */}
          <div className="col-md-6">
            <label className="form-label">Apellidos</label>
            <input
              type="text"
              name="apellidos"
              className="form-control"
              value={form.apellidos}
              onChange={handleChange}
            />
          </div>

          {/* REGIÓN */}
          <div className="col-md-6">
            <label className="form-label">Región</label>
            <select
              name="regionId"
              className="form-select"
              value={form.regionId}
              onChange={handleChange}
            >
              <option value="">Selecciona una región</option>
              {regiones.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* COMUNA */}
          <div className="col-md-6">
            <label className="form-label">Comuna</label>
            <select
              name="comuna"
              className="form-select"
              value={form.comuna}
              onChange={handleChange}
              disabled={!form.regionId}
            >
              <option value="">Selecciona una comuna...</option>
              {comunas.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* DIRECCIÓN */}
          <div className="col-12">
            <label className="form-label">Dirección</label>
            <input
              type="text"
              name="direccion"
              className="form-control"
              placeholder="Ej: Pasaje Los Álamos 123"
              value={form.direccion}
              onChange={handleChange}
            />
          </div>

          {/* FECHA */}
          <div className="col-md-4">
            <label className="form-label">Fecha preferida</label>
            <input
              type="date"
              name="fecha"
              className="form-control"
              value={form.fecha}
              onChange={handleChange}
            />
          </div>

          {/* TIPO ENTREGA */}
          <div className="col-md-4">
            <label className="form-label">Tipo de entrega</label>
            <select
              name="tipoEntrega"
              className="form-select"
              value={form.tipoEntrega}
              onChange={handleChange}
            >
              <option value="">Selecciona...</option>
              <option value="domicilio">Entrega a domicilio</option>
              <option value="retiro">Retiro en tienda</option>
            </select>
          </div>

          {/* MÉTODO PAGO */}
          <div className="col-md-4">
            <label className="form-label">Método de pago</label>
            <select
              name="pago"
              className="form-select"
              value={form.pago}
              onChange={handleChange}
            >
              <option value="Webpay">Webpay</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Efectivo">Efectivo</option>
            </select>
          </div>
        </div>

        {/* MENSAJE */}
        <div className="alert alert-warning mt-4">
          Lo sentimos, por el momento solo realizamos entregas en el Gran
          Concepción.
        </div>

        {/* BOTONES */}
        <div className="d-flex justify-content-between mt-4">
          <Button variant="strawberry" as="link" to="/cart">
            Volver al carrito
          </Button>

          <Button variant="mint" onClick={confirmar}>
            Confirmar y Pagar
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
