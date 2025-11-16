// routes/AppRouter.tsx
import { Suspense, lazy } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import LoginRoute from "@/routes/LoginRoute";
import AdminRoute from "@/routes/AdminRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";

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
const BlogDetailPage = lazy(() => import("@/pages/blog/BlogDetailPage"));
const CartPage = lazy(() => import("@/pages/cart/CartPage"));
const RegisterUserPage = lazy(() => import("@/pages/auth/RegisterUserPage"));
const PrivacyPage = lazy(() => import("@/pages/legal/PrivacyPage"));
const TermsPage = lazy(() => import("@/pages/legal/TermsPage"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));
const CheckoutPage = lazy(() => import("@/pages/checkout/CheckoutPage"));
const OrderSuccessPage = lazy(() =>
  import("@/pages/checkout/OrderSuccessPage")
);

// Páginas de pedidos
const MyOrdersPage = lazy(() => import("@/pages/orders/MyOrdersPage"));
const OrderDetailPage = lazy(() => import("@/pages/orders/OrderDetailPage"));

// Páginas admin
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const ProductsPage = lazy(() => import("@/pages/admin/products/ProductsPage"));
const UsersPage = lazy(() => import("@/pages/admin/users/UsersPage"));
const BlogAdminPage = lazy(() => import("@/pages/admin/blog/BlogAdminPage"));

// Blog create
const BlogCreatePage = lazy(() => import("@/pages/blog/BlogCreatePage"));

// 🆕 Gestión de pedidos admin
const OrdersAdminPage = lazy(() =>
  import("@/pages/admin/orders/OrdersAdminPage")
);

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

        // BLOG
        { path: "blog", element: <BlogPage /> },
        {
          path: "blog/create",
          element: (
            <ProtectedRoute>
              <BlogCreatePage />
            </ProtectedRoute>
          ),
        },
        { path: "blog/:id", element: <BlogDetailPage /> },

        // 🛒 Carrito
        { path: "cart", element: <CartPage /> },

        // 👤 Perfil
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          ),
        },

        // 📝 Pedidos usuario
        {
          path: "orders",
          element: (
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "orders/:id",
          element: (
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          ),
        },

        // 🧾 Legal
        { path: "privacy", element: <PrivacyPage /> },
        { path: "terms", element: <TermsPage /> },

        // 🔐 Auth
        { path: "reset-password", element: <ResetPasswordPage /> },

        // 💳 Compra
        {
          path: "checkout",
          element: (
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "order-success",
          element: (
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          ),
        },
      ],
    },

    // 🔥 ADMIN AREA
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
        { path: "users", element: <UsersPage /> },

        // 🆕 ESTA ES LA RUTA CORRECTA
        { path: "orders", element: <OrdersAdminPage /> },

        { path: "reports", element: <div>Reportes</div> },
        { path: "blogs", element: <BlogAdminPage /> },
      ],
    },

    // 👤 AUTH
    { path: "/login", element: <LoginRoute /> },
    { path: "/register", element: <RegisterUserPage /> },

    // 🚫 404
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
