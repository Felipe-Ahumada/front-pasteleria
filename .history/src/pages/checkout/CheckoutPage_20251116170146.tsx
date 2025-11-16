// pages/cart/CheckoutPage.tsx
import { useState, type ChangeEvent } from "react";
import { useCart } from "@/hooks/useCart";
import useAuth from "@/hooks/useAuth";
import { useOrders } from "@/context/orders";
import { Button } from "@/components/common";
import regionesData from "@/data/region_comuna.json";
import { generateOrderCode } from "@/utils/storage/generateOrderCode";
import { formatPrice } from "@/utils/format/priceFormatter";
import { getLocalItem } from "@/utils/storage/localStorageUtils";
import { LOCAL_STORAGE_KEYS } from "@/utils/storage/initLocalData";
import type { StoredUser } from "@/types/user";
import type { Order } from "@/types/order";

type RegionData = {
  id: string;
  region: string;
  comunas: string[];
};

const regiones = regionesData as RegionData[];

const CheckoutPage = () => {
  const { items, totals, clear } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();

  // Usuario completo desde localStorage (tiene run, direccion, etc.)
  const storedUser = getLocalItem<StoredUser>(LOCAL_STORAGE_KEYS.activeUser);

  // ===========================
  // FORM STATE
  // ===========================
  const [form, setForm] = useState({
    run: storedUser?.run ?? "",
    correo: storedUser?.correo ?? user?.email ?? "",
    nombres: storedUser?.nombre ?? "",
    apellidos: storedUser?.apellidos ?? "",
    regionId: storedUser?.regionId ?? "",
    comuna: storedUser?.comuna ?? "",
    direccion: storedUser?.direccion ?? "",
    fecha: "",
    tipoEntrega: "",
    pago: "Webpay",
  });

  // ===========================
  // FORM HANDLER
  // ===========================
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ===========================
  // COMUNAS SEGÚN REGIÓN
  // ===========================
  const comunas =
    regiones.find((r) => r.id === form.regionId)?.comunas ?? [];

  // ===========================
  // CONFIRMAR PEDIDO
  // ===========================
  const confirmar = () => {
    if (!form.fecha || !form.regionId || !form.comuna || !form.direccion) {
      // Aquí podrías usar un Alert bonito, pero para ahora:
      // eslint-disable-next-line no-alert
      alert("Completa todos los campos obligatorios");
      return;
    }

    const order: Order = {
      id: generateOrderCode(),
      userId: storedUser?.id ?? user!.id,
      items: items.map((i) => ({
        codigo: i.codigo,
        nombre: i.nombre,
        precio: i.precio,
        cantidad: i.cantidad,
        imagen: i.imagen,
        mensaje: i.mensaje ?? null,
      })),
      fechaPedido: new Date().toISOString(),
      fechaEntrega: form.fecha,
      total: totals.totalPagar, // total con descuento aplicado
      status: "pendiente",
      // Si en tu tipo Order tienes campo "envio", déjalo.
      // Si no, bórralo de aquí y del tipo.
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
    window.location.href = `/order-success?id=${order.id}`;
  };

  // ===========================
  // MIN DATE (bloquear pasadas)
  // ===========================
  const today = new Date().toISOString().split("T")[0];

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

          {/* SUBTOTAL */}
          <tr>
            <td colSpan={3} className="text-end fw-semibold">
              Subtotal
            </td>
            <td>{formatPrice(totals.subtotal)}</td>
          </tr>

          {/* DESCUENTO SI EXISTE */}
          {totals.discountAmount > 0 && totals.discountDescription && (
            <tr className="text-success fw-bold">
              <td colSpan={3} className="text-end">
                {totals.discountDescription}
              </td>
              <td>-{formatPrice(totals.discountAmount)}</td>
            </tr>
          )}

          {/* TOTAL FINAL */}
          <tr className="fw-bold">
            <td colSpan={3} className="text-end">
              Total a pagar
            </td>
            <td>{formatPrice(totals.totalPagar)}</td>
          </tr>
        </tbody>
        </table>
      </div>

      {/* ===========================
          FORMULARIO DE ENTREGA
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
              readOnly // <- no editable
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
              readOnly // <- no editable
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
                  {r.region}
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
              min={today} // ← evita fechas pasadas
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
          Lo sentimos, por el momento solo realizamos entregas en el Gran Concepción.
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
