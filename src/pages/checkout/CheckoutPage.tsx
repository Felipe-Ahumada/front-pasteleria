// pages/cart/CheckoutPage.tsx
import { useState, useEffect, type ChangeEvent } from "react";
import { useCart } from "@/hooks/useCart";
import useAuth from "@/hooks/useAuth";
import { useOrders } from "@/context/orders";
import { Button } from "@/components/common";
import { useLocations } from "@/hooks/useLocations";

import { formatPrice } from "@/utils/format/priceFormatter";
import { getLocalItem } from "@/utils/storage/localStorageUtils";
import { LOCAL_STORAGE_KEYS } from "@/utils/storage/initLocalData";
import type { StoredUser } from "@/types/user";
import type { Order } from "@/types/order";

const CheckoutPage = () => {
  const { items, totals, clear } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const { regions, comunas, fetchComunas } = useLocations();

  // Usuario completo
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

  // Cargar comunas si ya hay una región seleccionada (ej: usuario guardado)
  useEffect(() => {
    if (form.regionId) {
      // Necesitamos el código de la región, no el ID.
      // Pero storedUser.regionId probablemente guarda el código (ej: "13")
      // Vamos a asumir que guarda el código por ahora.
      fetchComunas(form.regionId);
    }
  }, [form.regionId]); // Solo al montar o si cambia externamente

  // ===========================
  // FORM HANDLER
  // ===========================
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "regionId") {
      fetchComunas(value);
      setForm((prev) => ({ ...prev, regionId: value, comuna: "" }));
    }
  };

  // ===========================
  // CONFIRMAR PEDIDO
  // ===========================
  // ===========================
  // CONFIRMAR PEDIDO
  // ===========================
  const confirmar = async () => {
    if (!form.fecha || !form.regionId || !form.comuna || !form.direccion) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    const order: Order = {
      id: "", // Backend generates ID
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
      fechaEntrega: form.fecha, // Mapped to backend field
      total: totals.totalPagar, // total con descuento aplicado
      status: "pendiente", // Frontend type expects lowercase

      // Keep these for frontend display if needed, but backend stores flattened
      envio: {
        run: form.run,
        nombres: form.nombres,
        apellidos: form.apellidos,
        correo: form.correo,
        regionId: form.regionId,
        regionNombre:
          regions.find((r) => r.codigo === form.regionId)?.nombre || "",
        comuna: form.comuna,
        direccion: form.direccion,
        tipoEntrega: form.tipoEntrega,
        metodoPago: form.pago,
      },
    };

    try {
      const createdOrder = await createOrder(order);
      // menuService.consumeStock(order.items); // Handled by backend now
      clear();
      window.location.href = `/order-success?id=${createdOrder.id}`;
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Hubo un error al crear el pedido. Inténtalo nuevamente.");
    }
  };

  // ===========================
  // MIN DATE (bloquear pasadas)
  // ===========================
  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="bg-cocoa-dark min-vh-100 py-5">
      <div className="container">
      {/* ===========================
          TÍTULO
      ============================ */}
      <h1 className="section-title text-center mb-5 text-gold fw-bold font-title display-5">
        Procesamiento de Pedidos
      </h1>

      {/* ===========================
          RESUMEN DEL CARRITO
      ============================ */}
      {/* ===========================
          RESUMEN DEL CARRITO
      ============================ */}
      <div className="bg-cocoa-strong border-gold rounded-4 p-4 mb-4 text-white shadow-lg">
        <h4 className="mb-3 text-gold fw-bold font-title">Resumen del carrito</h4>

        <table className="table table-borderless" style={{ "--bs-table-bg": "transparent" } as any}>
          <thead className="border-bottom border-gold">
            <tr>
              <th className="text-gold">Producto</th>
              <th className="text-gold">Cant.</th>
              <th className="text-gold">Precio</th>
              <th className="text-gold">Subtotal</th>
            </tr>
          </thead>

          <tbody className="border-bottom border-gold">
            {items.map((i) => (
              <tr key={`${i.codigo}-${i.mensaje ?? ""}`}>
                <td className="text-white">{i.nombre}</td>
                <td className="text-white">{i.cantidad}</td>
                <td className="text-white">{formatPrice(i.precio)}</td>
                <td className="text-white">{formatPrice(i.precio * i.cantidad)}</td>
              </tr>
            ))}

            {/* SUBTOTAL */}
            <tr>
              <td colSpan={3} className="text-end fw-semibold text-white">
                Subtotal
              </td>
              <td className="text-white">{formatPrice(totals.subtotal)}</td>
            </tr>

            {/* DESCUENTO SI EXISTE */}
            {totals.discountAmount > 0 && totals.discountDescription && (
              <tr className="text-mint fw-bold">
                <td colSpan={3} className="text-end text-mint">
                  {totals.discountDescription}
                </td>
                <td className="text-mint">-{formatPrice(totals.discountAmount)}</td>
              </tr>
            )}

            {/* TOTAL FINAL */}
            <tr className="fw-bold">
              <td colSpan={3} className="text-end text-gold h5">
                Total a pagar
              </td>
              <td className="text-gold h4">{formatPrice(totals.totalPagar)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ===========================
          FORMULARIO DE ENTREGA
      ============================ */}
      <div className="bg-cocoa-strong border-gold rounded-4 p-4 shadow-lg text-white">
        <h4 className="mb-4 text-gold fw-bold font-title">Información de Entrega</h4>

        <div className="row g-3">
          {/* RUN */}
          <div className="col-md-6">
            <label className="form-label text-gold fw-bold">RUN</label>
            <input
              type="text"
              name="run"
              className="form-control bg-cocoa-input border-gold"
              placeholder="12345678-9"
              value={form.run}
              onChange={handleChange}
              readOnly
            />
          </div>

          {/* CORREO */}
          <div className="col-md-6">
            <label className="form-label text-gold fw-bold">Correo</label>
            <input
              type="email"
              name="correo"
              className="form-control bg-cocoa-input border-gold"
              value={form.correo}
              onChange={handleChange}
              readOnly
            />
          </div>

          {/* NOMBRES */}
          <div className="col-md-6">
            <label className="form-label text-gold fw-bold">Nombres</label>
            <input
              type="text"
              name="nombres"
              className="form-control bg-cocoa-input border-gold"
              value={form.nombres}
              onChange={handleChange}
            />
          </div>

          {/* APELLIDOS */}
          <div className="col-md-6">
            <label className="form-label text-gold fw-bold">Apellidos</label>
            <input
              type="text"
              name="apellidos"
              className="form-control bg-cocoa-input border-gold"
              value={form.apellidos}
              onChange={handleChange}
            />
          </div>

          {/* REGIÓN */}
          <div className="col-md-6">
            <label className="form-label text-gold fw-bold">Región</label>
            <select
              name="regionId"
              className="form-select bg-cocoa-input border-gold"
              value={form.regionId}
              onChange={handleChange}
            >
              <option value="">Selecciona una región</option>
              {regions
                .filter((r) => r.nombre.includes("Biobío"))
                .map((r) => (
                  <option key={r.id} value={r.codigo}>
                    {r.nombre}
                  </option>
                ))}
            </select>
          </div>

          {/* COMUNA */}
          <div className="col-md-6">
            <label className="form-label text-gold fw-bold">Comuna</label>
            <select
              name="comuna"
              className="form-select bg-cocoa-input border-gold"
              value={form.comuna}
              onChange={handleChange}
              disabled={!form.regionId}
            >
              <option value="">Selecciona una comuna...</option>
              {comunas
                .filter((c) =>
                  [
                    "Concepción",
                    "Talcahuano",
                    "Hualpén",
                    "San Pedro de la Paz",
                    "Chiguayante",
                    "Coronel",
                    "Lota",
                    "Penco",
                    "Hualqui",
                    "Tomé",
                    "Santa Juana",
                  ].includes(c.nombre)
                )
                .map((c) => (
                  <option key={c.id} value={c.nombre}>
                    {c.nombre}
                  </option>
                ))}
            </select>
          </div>

          {/* DIRECCIÓN */}
          <div className="col-12">
            <label className="form-label text-gold fw-bold">Dirección</label>
            <input
              type="text"
              name="direccion"
              className="form-control bg-cocoa-input border-gold"
              placeholder="Ej: Pasaje Los Álamos 123"
              value={form.direccion}
              onChange={handleChange}
            />
          </div>

          {/* FECHA */}
          <div className="col-md-4">
            <label className="form-label text-gold fw-bold">Fecha preferida</label>
            <input
              type="date"
              name="fecha"
              className="form-control bg-cocoa-input border-gold"
              min={today} // evita fechas pasadas
              value={form.fecha}
              onChange={handleChange}
            />
          </div>

          {/* TIPO ENTREGA */}
          <div className="col-md-4">
            <label className="form-label text-gold fw-bold">Tipo de entrega</label>
            <select
              name="tipoEntrega"
              className="form-select bg-cocoa-input border-gold"
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
            <label className="form-label text-gold fw-bold">Método de pago</label>
            <select
              name="pago"
              className="form-select bg-cocoa-input border-gold"
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
        <div className="alert bg-cocoa-input border-gold text-gold mt-4">
          <i className="bi bi-info-circle me-2"></i>
          Lo sentimos, por el momento solo realizamos entregas en el Gran
          Concepción.
        </div>

        {/* BOTONES */}
        <div className="d-flex justify-content-between mt-4">
          <Button variant="strawberry" as="link" to="/cart" className="rounded-pill shadow-soft fw-bold">
            <i className="bi bi-arrow-left me-2"></i>
             Volver al carrito
          </Button>

          <Button variant="mint" onClick={confirmar} className="rounded-pill shadow-soft fw-bold">
            Confirmar y Pagar <i className="bi bi-check2-circle ms-2"></i>
          </Button>
        </div>
      </div>
     </div>
    </section>
  );
};

export default CheckoutPage;
