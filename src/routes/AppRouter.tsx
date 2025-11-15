// routes/AppRouter.tsx
import { Suspense, lazy } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import LoginRoute from "@/routes/LoginRoute";
import AdminRoute from "@/routes/AdminRoute";

// Layouts
const AppLayout = lazy(() => import("@/layouts/AppLayout"));
const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));

// Páginas públicas
const HomePage = lazy(() => import("@/pages/home/HomePage"));
const AboutPage = lazy(() => import("@/pages/about/AboutPage"));
const ContactPage = lazy(() => import("@/pages/contact/ContactPage"));
const MenuPage = lazy(() => import("@/pages/menu/MenuPage"));
const MenuDetailsPage = lazy(() => import("@/pages/menu/MenuDetailsPage"));
const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"));
const BlogPage = lazy(() => import("@/pages/blog/BlogPage"));
const CartPage = lazy(() => import("@/pages/cart/CartPage"));
const RegisterUserPage = lazy(() => import("@/pages/auth/RegisterUserPage"));
const PrivacyPage = lazy(() => import("@/pages/legal/PrivacyPage"));
const TermsPage = lazy(() => import("@/pages/legal/TermsPage"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));

// Admin pages
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const ProductsPage = lazy(() => import("@/pages/admin/products/ProductsPage"));

const basename = (import.meta.env.BASE_URL ?? "/").replace(/\/*$/, "") || "/";

const router = createBrowserRouter(
  [
    // 🌸 RUTAS PÚBLICAS
    {
      element: <AppLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "about", element: <AboutPage /> },
        { path: "contact", element: <ContactPage /> },
        { path: "menu", element: <MenuPage /> },
        { path: "menu/:productCode", element: <MenuDetailsPage /> },
        { path: "blog", element: <BlogPage /> },
        { path: "cart", element: <CartPage /> },
        { path: "profile", element: <ProfilePage /> },
        { path: "privacy", element: <PrivacyPage /> },
        { path: "terms", element: <TermsPage /> },
        { path: "reset-password", element: <ResetPasswordPage /> },
      ],
    },

    // 🔥 ÁREA ADMIN PROTEGIDA
    {
      path: "/admin",
      element: (
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      ),
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: "products", element: <ProductsPage /> },
        { path: "orders", element: <div>Gestión de Pedidos</div> },
        { path: "users", element: <div>Gestión de Usuarios</div> },
        { path: "comments", element: <div>Comentarios</div> },
        { path: "reports", element: <div>Reportes</div> },
        { path: "blogs", element: <div>Blogs</div> },
      ],
    },

    // 👤 AUTENTICACIÓN
    { path: "/login", element: <LoginRoute /> },
    { path: "/register", element: <RegisterUserPage /> },

    // 🚫 NOT FOUND → HOME
    { path: "*", element: <Navigate to="/" replace /> },
  ],
  { basename }
);

const AppRouter = () => (
  <Suspense
    fallback={
      <div className="py-5 text-center">
        <span className="spinner-border" role="status" aria-hidden="true" />
      </div>
    }
  >
    <RouterProvider router={router} />
  </Suspense>
);

export default AppRouter;
