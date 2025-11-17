import { Button } from "@/components/common";
import useAuth from "@/hooks/useAuth";

type AdminRole = "admin" | "superadmin" | "seller";

type DashboardSection = {
  id: string;
  iconClass: string;
  title: string;
  description: string;
  to: string;
  cta: string;
  roles?: AdminRole[];
};

const sections: DashboardSection[] = [
  {
    id: "products",
    iconClass: "bi bi-basket text-primary",
    title: "Gestión de Productos",
    description: "Encontrarás todos los productos disponibles en la tienda.",
    to: "/admin/products",
    cta: "Ir a Productos",
    roles: ["admin", "superadmin", "seller"],
  },
  {
    id: "orders",
    iconClass: "bi bi-receipt text-info",
    title: "Gestión de Pedidos",
    description: "Consulta y gestiona los pedidos de tus clientes.",
    to: "/admin/orders",
    cta: "Ir a Pedidos",
    roles: ["admin", "superadmin", "seller"],
  },
  {
    id: "users",
    iconClass: "bi bi-people text-success",
    title: "Gestión de Usuarios",
    description: "Administra clientes, vendedores y administradores.",
    to: "/admin/users",
    cta: "Ir a Usuarios",
    roles: ["admin", "superadmin"],
  },
  {
    id: "comments",
    iconClass: "bi bi-chat-dots text-danger",
    title: "Comentarios",
    description: "Revisa y responde comentarios enviados por clientes.",
    to: "/admin/comments",
    cta: "Ver Comentarios",
    roles: ["admin", "superadmin"],
  },
  {
    id: "reports",
    iconClass: "bi bi-bar-chart text-warning",
    title: "Reportes",
    description: "Visualiza estadísticas de ventas y stock crítico.",
    to: "/admin/reports",
    cta: "Ver Reportes",
    roles: ["admin", "superadmin"],
  },
  {
    id: "blogs",
    iconClass: "bi bi-journal-text text-dark",
    title: "Gestión de Blogs",
    description: "Revisa y aprueba los blogs creados por usuarios.",
    to: "/admin/blogs",
    cta: "Ir a Blogs",
    roles: ["admin", "superadmin"],
  },
];

const isAdminRole = (value?: string): value is AdminRole =>
  value === "admin" || value === "superadmin" || value === "seller";

const AdminDashboard = () => {
  const { user } = useAuth();
  const role = isAdminRole(user?.role) ? user?.role : undefined;

  const visibleSections = sections.filter((section) => {
    if (!section.roles) {
      return true;
    }

    if (!role) {
      return false;
    }

    return section.roles.includes(role);
  });

  return (
    <main className="py-5 bg-light-subtle">
      <div className="container">
        <h1 className="fw-bold text-center mb-4">Panel de Administración</h1>

        <div className="row g-4">
          {visibleSections.map((section) => (
            <div key={section.id} className="col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body text-center p-4">
                  <i className={section.iconClass} style={{ fontSize: "3rem" }} />
                  <h2 className="h5 mt-3">{section.title}</h2>
                  <p className="small text-muted">{section.description}</p>
                  <Button as="link" to={section.to} variant="mint" block>
                    {section.cta}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
