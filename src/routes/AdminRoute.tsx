// routes/AdminRoute.tsx
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import useAuth from "@/hooks/useAuth";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user } = useAuth();

  // No autenticado → al login
  if (!user) return <Navigate to="/login" replace />;

  // Rol no permitido → al perfil
  if (user.role !== "admin" && user.role !== "superadmin") {
    return <Navigate to="/profile" replace />;
  }

  // Usuario válido → renderiza lo que envuelvas
  return <>{children}</>;
};

export default AdminRoute;
