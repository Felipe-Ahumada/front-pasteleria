import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import "./admin.css";
import { logoImage } from "@/assets";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`admin-shell ${collapsed ? "collapsed" : ""}`}>
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img
            src={logoImage}
            alt="Mil Sabores"
            className="admin-logo"
          />
          <h2>Mil Sabores Admin</h2>
          <p className="admin-user">Panel de administración</p>
        </div>

        <nav className="admin-nav">
          <NavItem to="/admin" icon="bi-speedometer2" label="Dashboard" end />
          <NavItem to="/admin/products" icon="bi-basket" label="Productos" />
          <NavItem to="/admin/orders" icon="bi-receipt" label="Pedidos" />
          <NavItem to="/admin/users" icon="bi-people" label="Usuarios" />
          <NavItem
            to="/admin/comments"
            icon="bi-chat-left-dots"
            label="Comentarios"
            badge={53}
          />
          <NavItem to="/admin/reports" icon="bi-bar-chart" label="Reportes" />
          <NavItem to="/admin/blogs" icon="bi-journal-text" label="Blogs" />
        </nav>

        <div className="admin-footer">
          <Link to="/profile" className="admin-return">
            ← Volver a perfil
          </Link>

          <button className="admin-logout">Cerrar sesión</button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="admin-content">
        {/* HEADER */}
        <header className="admin-header">
          <button
            className="toggle-sidebar"
            onClick={() => setCollapsed(!collapsed)}
          >
            <i className="bi bi-layout-sidebar-inset"></i>
          </button>

          <h1>Panel de Administración</h1>
        </header>

        <div className="admin-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

const NavItem = ({
  to,
  icon,
  label,
  end,
  badge,
}: {
  to: string;
  icon: string;
  label: string;
  end?: boolean;
  badge?: number;
}) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      "admin-link" + (isActive ? " admin-active" : "")
    }
  >
    <i className={`bi ${icon}`} />
    <span>{label}</span>

    {badge ? <span className="admin-badge">{badge}</span> : null}
  </NavLink>
);
