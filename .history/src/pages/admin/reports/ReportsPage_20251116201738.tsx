import { useMemo, useState } from "react";

import { menuService } from "@/service/menuService";
import { orderService } from "@/service/orderService";
import { userService } from "@/service/userService";
import { commentService } from "@/service/commentService";

/* ============================================================
   UTILIDADES LOCALES
============================================================ */
const todayString = new Date().toISOString().slice(0, 10);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-4 border rounded shadow-sm bg-white">
      <button
        className="w-100 text-start px-4 py-3 border-bottom bg-light d-flex justify-content-between align-items-center"
        onClick={() => setOpen(!open)}
        style={{ cursor: "pointer" }}
      >
        <span className="fw-semibold">{title}</span>
        <span>{open ? "▾" : "▸"}</span>
      </button>

      {open && <div className="p-4">{children}</div>}
    </div>
  );
};

/* ============================================================
   PÁGINA PRINCIPAL
============================================================ */
const ReportsPage = () => {
  /* =========================
     1. DATOS REALES DEL SISTEMA
  =============================*/
  const productos = menuService.getCached();
  const pedidos = orderService.getAll();
  const usuarios = userService.getCached();
  /* =========================
     2. Cálculo de estadísticas
  =============================*/

  /** Productos **/
  const totalCategorias = useMemo(() => {
    const set = new Set(productos.map((p) => p.categoria));
    return set.size;
  }, [productos]);

  const stockCritico = productos.filter((p) => p.stock <= (p.stock_critico ?? 0));
  const stockAgotado = productos.filter((p) => p.stock <= 0);

  /** Resumen por categoría **/
  const resumenCategorias = useMemo(() => {
    const map: Record<
      string,
      { productos: number; agotados: number; criticos: number }
    > = {};

    productos.forEach((p) => {
      if (!map[p.categoria]) {
        map[p.categoria] = { productos: 0, agotados: 0, criticos: 0 };
      }
      map[p.categoria].productos++;
      if (p.stock <= 0) map[p.categoria].agotados++;
      if (p.stock <= (p.stock_critico ?? 0)) map[p.categoria].criticos++;
    });

    return map;
  }, [productos]);

  /** Pedidos **/
  const pedidosHoy = pedidos.filter((p) => p.fechaPedido.startsWith(todayString));
  const pedidosDomicilio = pedidosHoy.filter(
    (p) => p.envio.tipoEntrega === "domicilio"
  );
  const pedidosTienda = pedidosHoy.filter(
    (p) => p.envio.tipoEntrega === "tienda"
  );
  const ventasHoy = pedidosHoy.reduce((acc, p) => acc + p.total, 0);

  const pedidosRecientes = pedidos.slice().reverse().slice(0, 5);

  /** Usuarios **/
  const totalUsuarios = usuarios.length;
  const nuevosHoy = usuarios.filter(
    (u) => u.createdAt?.startsWith(todayString)
  ).length;

  /** Comentarios **/
  const comentariosPendientes = JSON.parse(localStorage.getItem("comments") || "[]").length;

  /* ============================================================
     RENDER
  ============================================================= */
  return (
    <div className="container py-4">

      <h2 className="fw-bold mb-4">Reportes</h2>

      {/* ======================
         PRODUCTOS
       ====================== */}
      <Section title="📦 Productos">
        {/* Tarjetas superiores */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card shadow-sm p-3">
              <span className="text-muted small">Total Categorías</span>
              <h3 className="fw-bold">{totalCategorias}</h3>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card shadow-sm p-3">
              <span className="text-muted small">Total productos</span>
              <h3 className="fw-bold">{productos.length}</h3>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card shadow-sm p-3">
              <span className="text-muted small">Stock crítico</span>
              <h3 className="fw-bold text-warning">{stockCritico.length}</h3>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card shadow-sm p-3">
              <span className="text-muted small">Agotados</span>
              <h3 className="fw-bold text-danger">{stockAgotado.length}</h3>
            </div>
          </div>
        </div>

        {/* Stock crítico */}
        <h5 className="fw-semibold mt-4 mb-2">⚠ En stock crítico</h5>
        <div className="table-responsive mb-4">
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {stockCritico.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-muted py-3">
                    Sin productos en nivel crítico.
                  </td>
                </tr>
              ) : (
                stockCritico.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nombre}</td>
                    <td>{p.stock}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Agotados */}
        <h5 className="fw-semibold mt-4 mb-2">⛔ Agotados</h5>
        <div className="table-responsive mb-4">
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
              </tr>
            </thead>
            <tbody>
              {stockAgotado.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-muted py-3">
                    Sin productos agotados.
                  </td>
                </tr>
              ) : (
                stockAgotado.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nombre}</td>
                    <td>{p.categoria}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Resumen categorías */}
        <h5 className="fw-semibold mt-4 mb-2">📊 Resumen por categoría</h5>
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Productos</th>
                <th>Agotados</th>
                <th>Stock crítico</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(resumenCategorias).map(([cat, data]) => (
                <tr key={cat}>
                  <td>{cat}</td>
                  <td>{data.productos}</td>
                  <td>{data.agotados}</td>
                  <td>{data.criticos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ======================
         PEDIDOS
       ====================== */}
      <Section title="🛒 Pedidos">
        {/* Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card shadow-sm p-3">
              <span className="text-muted small">Pedidos de hoy</span>
              <h3 className="fw-bold">{pedidosHoy.length}</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm p-3">
              <span className="text-muted small">Pedidos a domicilio</span>
              <h3 className="fw-bold">{pedidosDomicilio.length}</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm p-3">
              <span className="text-muted small">Pedidos retiro tienda</span>
              <h3 className="fw-bold">{pedidosTienda.length}</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm p-3">
              <span className="text-muted small">Ventas de hoy</span>
              <h3 className="fw-bold">${ventasHoy.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* Pedidos recientes */}
        <h5 className="fw-semibold mb-3">📦 Pedidos recientes</h5>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {pedidosRecientes.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    <span className="badge bg-secondary">
                      {p.status}
                    </span>
                  </td>
                  <td>${p.total.toLocaleString()}</td>
                  <td>{p.fechaPedido}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ======================
         USUARIOS
       ====================== */}
      <Section title="👤 Usuarios">
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card shadow-sm p-3">
              <span className="text-muted small">Total usuarios</span>
              <h3 className="fw-bold">{totalUsuarios}</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm p-3">
              <span className="text-muted small">Nuevos hoy</span>
              <h3 className="fw-bold">{nuevosHoy}</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm p-3">
              <span className="text-muted small">Comentarios pendientes</span>
              <h3 className="fw-bold">{comentariosPendientes}</h3>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default ReportsPage;
