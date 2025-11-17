import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@/index.css";

import AppRouter from "@/routes/AppRouter";
import { AuthProvider, ThemeProvider } from "@/context";
import { CartProvider } from "@/context/cart";
import { initLocalData } from "@/utils/storage/initLocalData";
import { OrderProvider } from "./context/orders/OrderProvider";
import { BlogProvider } from "@/context/blog/BlogProvider";

initLocalData();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <OrderProvider>
            <BlogProvider>
              <AppRouter />
            </BlogProvider>

          </OrderProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
