// routes/AdminRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import useAuth from "@/hooks/useAuth";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  // No autenticado → volver a la tienda
  if (!user) return <Navigate to="/" replace />;

  // Rol no permitido → al perfil
  if (user.role !== "admin" && user.role !== "superadmin" && user.role !== "seller") {
    return <Navigate to="/profile" replace />;
  }

  if (user.role === "seller") {
    const currentPath = location.pathname;
    const allowedBasePaths = ["/admin", "/admin/products", "/admin/orders"];

    const isDirectMatch = allowedBasePaths.includes(currentPath);
    const isNestedMatch = allowedBasePaths
      .filter((path) => path !== "/admin")
      .some((path) => currentPath.startsWith(`${path}/`));

    if (!isDirectMatch && !isNestedMatch) {
      return <Navigate to="/admin" replace />;
    }
  }

  // Usuario válido → renderiza lo que envuelvas
  return <>{children}</>;
};

export default AdminRoute;
