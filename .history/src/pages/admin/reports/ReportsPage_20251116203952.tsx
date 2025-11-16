// pages/admin/reports/ReportsPage.tsx
import { useMemo } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { menuService } from "@/service/menuService";
import { orderService } from "@/service/orderService";
import { userService } from "@/service/userService";

// Registrar Chart.js
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// Sección colapsable
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="mb-4 border rounded bg-white shadow-sm">
      <div className="p-3 bg-light border-bottom fw-semibold">{title}</div>
      <div className="p-4">{children}</div>
    </div>
  );
};

const ReportsPage = () => {
  const productos = menuService.getCached();
  const pedidos = orderService.getAll();
  const usuarios = userService.getCached();

  const today = new Date().toISOString().slice(0, 10);

  /* =======================================================
     PRODUCTOS — RESUMEN POR CATEGORÍA
  ======================================================= */
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

  /* =======================================================
     PEDIDOS — RESUMEN + KPIs
  ======================================================= */

  // Pedidos HOY (KPI)
  const pedidosHoy = pedidos.filter((p) => p.fechaPedido.startsWith(today));

  // Ventas agrupadas por día
  const ventasPorDia = pedidos.map((p) => ({
    fecha: p.fechaPedido.slice(0, 10),
    total: p.total,
  }));

  const ventasAgrupadas = ventasPorDia.reduce(
    (acc, v) => ({
      ...acc,
      [v.fecha]: (acc[v.fecha] || 0) + v.total,
    }),
    {} as Record<string, number>
  );

  /* =======================================================
     GRÁFICOS
  ======================================================= */

  // 1. Productos por categoría
  const barData = {
    labels: Object.keys(resumenCategorias),
    datasets: [
      {
        label: "Productos",
        data: Object.values(resumenCategorias).map((x) => x.productos),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // 2. Pedidos por estado
  const estados = ["pendiente", "preparando", "en_camino", "entregado", "cancelado"];
  const doughnutData = {
    labels: estados,
    datasets: [
      {
        data: estados.map(
          (est) => pedidos.filter((p) => p.status === est).length
        ),
        backgroundColor: [
          "#8ecae6",
          "#219ebc",
          "#ffb703",
          "#fb8500",
          "#d00000",
        ],
      },
    ],
  };

  // 3. Ventas diarias
  const lineData = {
    labels: Object.keys(ventasAgrupadas),
    datasets: [
      {
        label: "Ventas (CLP)",
        data: Object.values(ventasAgrupadas),
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
      },
    ],
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Reportes</h2>

      {/* =======================================================
          SECCIÓN PRODUCTOS
      ======================================================= */}
      <Section title="📦 Productos">
        <div className="row g-4">
          {/* Gráfico */}
          <div className="col-md-6">
            <h6 className="mb-3">Productos por Categoría</h6>
            <Bar data={barData} />
          </div>

          {/* Tabla */}
          <div className="col-md-6">
            <h6 className="mb-3">Detalle por Categoría</h6>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th>Productos</th>
                    <th>Agotados</th>
                    <th>Stock crítico</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(resumenCategorias).map(([cat, stats]) => (
                    <tr key={cat}>
                      <td>{cat}</td>
                      <td>{stats.productos}</td>
                      <td>{stats.agotados}</td>
                      <td>{stats.criticos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>

      {/* =======================================================
          SECCIÓN PEDIDOS
      ======================================================= */}
      <Section title="🛒 Pedidos">
        <div className="row g-4">

          {/* KPI: Pedidos hoy */}
          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <span className="text-muted">Pedidos de hoy</span>
              <h3 className="fw-bold">{pedidosHoy.length}</h3>
            </div>
          </div>

          {/* Gráfico donut */}
          <div className="col-md-4">
            <h6 className="mb-3">Pedidos por Estado</h6>
            <Doughnut data={doughnutData} />
          </div>

          {/* Gráfico línea */}
          <div className="col-md-8">
            <h6 className="mb-3">Ventas por Día</h6>
            <Line data={lineData} />
          </div>
        </div>
      </Section>

      {/* =======================================================
          SECCIÓN USUARIOS
      ======================================================= */}
      <Section title="👤 Usuarios">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <span className="text-muted">Total usuarios</span>
              <h3 className="fw-bold">{usuarios.length}</h3>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <span className="text-muted">Comentarios pendientes</span>
              <h3 className="fw-bold">
                {JSON.parse(localStorage.getItem("comments-v1") || "[]").length}
              </h3>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default ReportsPage;
