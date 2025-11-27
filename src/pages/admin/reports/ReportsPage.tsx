import { useEffect, useMemo, useState } from "react";
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

import apiClient from "@/config/axiosConfig";
import { userService } from "@/service/userService";
import { orderService } from "@/service/orderService";

// Registrar módulos
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

/* ============================================================
   SECCIÓN COLAPSABLE
============================================================ */
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
        <span style={{ fontSize: "20px" }}>{open ? "▾" : "▸"}</span>
      </button>

      {open && <div className="p-4">{children}</div>}
    </div>
  );
};

/* ============================================================
   PÁGINA PRINCIPAL
============================================================ */
const ReportsPage = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [comentariosCount, setComentariosCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await userService.getAll();
        setUsuarios(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }

      try {
        // Assuming commentService is available and has getAll
        const { commentService } = await import("@/service/commentService");
        const comments = await commentService.getAll();
        setComentariosCount(comments.length);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }

      try {
        const { data: categories } = await apiClient.get<any[]>("/categorias");
        const allProducts = categories.flatMap((cat) =>
          cat.productos.map((p: any) => ({
            ...p,
            id: p.id.toString(),
            categoria: cat.nombre,
            stock_critico: p.stockCritico,
          }))
        );
        setProductos(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }

      try {
        const orders = await orderService.getAll();
        setPedidos(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchData();
  }, []);

  /* ============================
     Normalización de fechas
  ============================ */
  const getDate = (isoString: string) => isoString.split("T")[0];

  const today = new Date().toISOString().split("T")[0];

  /* ============================================================
     RESUMEN PRODUCTOS
  ============================================================= */
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

  /* ============================================================
     RESUMEN PEDIDOS
  ============================================================= */
  const pedidosHoy = pedidos.filter((p) => getDate(p.fechaPedido) === today);

  // Ventas agrupadas por día
  const ventasAgrupadas = pedidos.reduce((acc, p) => {
    const fecha = getDate(p.fechaPedido);
    acc[fecha] = (acc[fecha] ?? 0) + p.total;
    return acc;
  }, {} as Record<string, number>);

  /* ============================================================
     CHART 1: Productos por categoría
  ============================================================= */
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

  /* ============================================================
     CHART 2: Pedidos por estado
  ============================================================= */
  const estados = [
    "pendiente",
    "preparando",
    "en_camino",
    "entregado",
    "cancelado",
  ];

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

  /* ============================================================
     CHART 3: Ventas por día
  ============================================================= */
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
      <h2 className="fw-bold mb-4">📊 Reportes del Sistema</h2>

      {/* ============================================================
          PRODUCTOS
      ============================================================= */}
      <Section title="📦 Productos">
        <div className="row g-4">
          <div className="col-md-6">
            <h6 className="mb-3">Productos por Categoría</h6>
            <Bar data={barData} />
          </div>

          <div className="col-md-6">
            <h6 className="mb-3">Detalle por Categoría</h6>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th>Variedades</th>
                    <th>Sin Stock</th>
                    <th>Con Stock Bajo</th>
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

      {/* ============================================================
          PEDIDOS
      ============================================================= */}
      <Section title="🛒 Pedidos">
        <div className="row g-4">
          {/* KPI pedidos hoy */}
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

          {/* Ventas por día */}
          <div className="col-md-8">
            <h6 className="mb-3">Ventas por Día</h6>
            <Line data={lineData} />
          </div>
        </div>
      </Section>

      {/* ============================================================
          USUARIOS
      ============================================================= */}
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
              <span className="text-muted">Comentarios registrados</span>
              <h3 className="fw-bold">{comentariosCount}</h3>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default ReportsPage;
