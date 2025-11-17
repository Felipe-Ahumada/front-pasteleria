import { useCallback, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import "./admin.css";
import { logoImage } from "@/assets";
import useAuth from "@/hooks/useAuth";
import type { UserRole } from "@/context";

type NavItemConfig = {
  to: string;
  icon: string;
  label: string;
  end?: boolean;
  badge?: number;
  roles?: UserRole[];
};

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);

  const role = user?.role ?? "customer";

  const navItems = useMemo<NavItemConfig[]>(
    () => [
      {
        to: "/admin",
        icon: "bi-speedometer2",
        label: "Dashboard",
        end: true,
        roles: ["admin", "superadmin", "seller"],
      },
      {
        to: "/admin/products",
        icon: "bi-basket",
        label: "Productos",
        roles: ["admin", "superadmin", "seller"],
      },
      {
        to: "/admin/orders",
        icon: "bi-receipt",
        label: "Pedidos",
        roles: ["admin", "superadmin", "seller"],
      },
      {
        to: "/admin/users",
        icon: "bi-people",
        label: "Usuarios",
        roles: ["admin", "superadmin"],
      },
      {
        to: "/admin/comments",
        icon: "bi-chat-left-dots",
        label: "Comentarios",
        badge: 53,
        roles: ["admin", "superadmin"],
      },
      {
        to: "/admin/reports",
        icon: "bi-bar-chart",
        label: "Reportes",
        roles: ["admin", "superadmin"],
      },
      {
        to: "/admin/blogs",
        icon: "bi-journal-text",
        label: "Blogs",
        roles: ["admin", "superadmin"],
      },
    ],
    []
  );

  const visibleNavItems = useMemo(
    () =>
      navItems.filter((item) => {
        if (!item.roles) {
          return true;
        }

        return item.roles.includes(role);
      }),
    [navItems, role]
  );

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
          {visibleNavItems.map(({ roles: _roles, ...item }) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        <div className="admin-footer">
          <Link to="/" className="admin-return">
            ← Volver a tienda
          </Link>

          <button type="button" className="admin-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
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
