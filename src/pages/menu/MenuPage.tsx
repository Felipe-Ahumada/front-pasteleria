// pages/menu/MenuPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/common";

import menuData from "@/data/menu_datos.json";
import MenuFilters from "@/components/menu/MenuFilters";

import { useCart } from "@/hooks/useCart";
import {
  useMenuFilters,
  type EnrichedProduct,
} from "@/hooks/menu/useMenuFilters";

import { useMenuShare } from "@/hooks/menu/useMenuShare";
import { menuService } from "@/service/menuService";

/* ===========================================================
   IMÁGENES DEL CATÁLOGO
=========================================================== */
const catalogImages = import.meta.glob("@/assets/images/catalog/**/*", {
  import: "default",
  eager: true,
}) as Record<string, string>;

const catalogImageMap = Object.entries(catalogImages).reduce<
  Record<string, string>
>((acc, [path, src]) => {
  const fileName = path.split("/").pop();
  if (fileName) acc[fileName] = src;
  return acc;
}, {});

const formatImagePath = (relativePath: string) => {
  const fileName = relativePath.split("/").pop();

  if (fileName && catalogImageMap[fileName]) {
    return catalogImageMap[fileName];
  }

  const normalized = relativePath
    .replace(/^img\//, "images/")
    .replace("catalogo", "catalog");

  return new URL(`@/assets/${normalized}`, import.meta.url).href;
};

const formatPrice = (value: number) =>
  value.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });

/* ===========================================================
   PROCESAR DATOS
=========================================================== */

const allProducts: EnrichedProduct[] = menuData.categorias.flatMap(
  (categoria) =>
    categoria.productos.map((p) => ({
      codigo_producto: p.codigo_producto,
      nombre_producto: p.nombre_producto,
      precio_producto: p.precio_producto,
      imagen_producto: p.imagen_producto,
      descripción_producto: p.descripción_producto,
      categoriaId: categoria.id_categoria,
      categoriaNombre: categoria.nombre_categoria,
      stock: p.stock,
    }))
);

/* ===========================================================
   COMPONENTE PRINCIPAL
=========================================================== */

const MenuPage = () => {
  const collator = useMemo(
    () => new Intl.Collator("es", { sensitivity: "base" }),
    []
  );

  /* ================= HOOK DE FILTROS ================= */
  const {
    selectedCategory,
    selectedProductCode,
    minPrice,
    maxPrice,
    sortOrder,
    errors,

    productOptions,
    filteredProducts,

    handleCategoryChange,
    onProductChange,
    handleMinPriceChange,
    handleMaxPriceChange,
    onSortChange,
    resetFilters,
  } = useMenuFilters(allProducts, collator);

  const totalProductos = filteredProducts.length;

  /* ================= HOOK DEL CARRITO ================= */
  const { addItem, items } = useCart();

  /* ================= SHARING ================= */
  const { handleShare } = useMenuShare();

  /* ================= FEEDBACK ================= */
  type FeedbackState = { text: string; tone: "success" | "danger" };
  const [cardFeedbacks, setCardFeedbacks] = useState<
    Record<string, FeedbackState | null>
  >({});
  const timeouts = useRef<Record<string, number | null>>({});

  const scheduleCardFeedback = (key: string, next: FeedbackState) => {
    setCardFeedbacks((prev) => ({ ...prev, [key]: next }));

    if (timeouts.current[key]) {
      window.clearTimeout(timeouts.current[key]!);
    }

    timeouts.current[key] = window.setTimeout(() => {
      setCardFeedbacks((prev) => ({ ...prev, [key]: null }));
    }, 3000);
  };

  /* Helper: cuántas unidades de este producto hay en el carrito (todas las variantes) */
  const getCantidadEnCarrito = (codigo: string) =>
    items
      .filter((i) => i.codigo === codigo)
      .reduce((acc, i) => acc + i.cantidad, 0);

  /* ================= AÑADIR AL CARRITO ================= */
  const handleAddToCart = (item: EnrichedProduct) => {
    // Stock real desde menuService
    const productos = menuService.getCached();
    const real = productos.find((p) => p.id === item.codigo_producto);
    const stockReal = real?.stock ?? 0;

    // Ya no solo stockReal: usamos stock restante
    const enCarrito = getCantidadEnCarrito(item.codigo_producto);
    const disponible = stockReal - enCarrito;

    if (disponible <= 0) {
      scheduleCardFeedback(item.codigo_producto, {
        text: "Sin stock disponible",
        tone: "danger",
      });
      return;
    }

    // Ahora sí es válido agregar (hay al menos 1 disponible)
    addItem({
      codigo: item.codigo_producto,
      nombre: item.nombre_producto,
      precio: item.precio_producto,
      imagen: formatImagePath(item.imagen_producto),
      cantidad: 1,
    });

    scheduleCardFeedback(item.codigo_producto, {
      text: "Producto agregado al carrito 🧁",
      tone: "success",
    });
  };

  /* ================= LIMPIAR TIMEOUTS ================= */
  useEffect(
    () => () => {
      Object.values(timeouts.current).forEach((id) => id && clearTimeout(id));
    },
    []
  );

  /* ===========================================================
     RENDER
  ============================================================ */
  return (
    <section className="py-4 py-lg-5">
      <div className="container">
        <header className="text-center mb-4 mb-lg-5">
          <h1 className="section-title mb-2">Nuestra Carta</h1>
          <p className="mb-0">
            Explora nuestras categorías y encuentra el postre ideal.
          </p>
        </header>

        {/* FILTROS */}
        <MenuFilters
          categories={menuData.categorias}
          productOptions={productOptions}
          orderOptions={[
            { value: "name-asc", label: "Nombre: A → Z" },
            { value: "name-desc", label: "Nombre: Z → A" },
            { value: "price-asc", label: "Precio: menor a mayor" },
            { value: "price-desc", label: "Precio: mayor a menor" },
          ]}
          selectedCategory={selectedCategory}
          selectedProductCode={selectedProductCode}
          minPrice={minPrice}
          maxPrice={maxPrice}
          sortOrder={sortOrder}
          errors={errors}
          onCategoryChange={handleCategoryChange}
          onProductChange={onProductChange}
          onMinPriceChange={handleMinPriceChange}
          onMaxPriceChange={handleMaxPriceChange}
          onSortChange={onSortChange}
          onReset={resetFilters}
        />

        {/* CONTADOR */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="mb-0">
            {totalProductos === 0
              ? "Sin productos visibles."
              : `${totalProductos} ${
                  totalProductos === 1
                    ? "producto disponible"
                    : "productos disponibles"
                }`}
          </p>
        </div>

        {/* LISTADO */}
        {totalProductos === 0 ? (
          <div className="menu-empty card-soft text-center py-5">
            <p className="mb-2 fw-semibold">
              No encontramos productos con los filtros aplicados.
            </p>
            <Button variant="mint" onClick={resetFilters}>
              Ver carta completa
            </Button>
          </div>
        ) : (
          <div className="row g-4">
            {filteredProducts.map((item) => {
              // Stock real
              const productos = menuService.getCached();
              const real = productos.find(
                (p) => p.id === item.codigo_producto
              );
              const stockReal = real?.stock ?? 0;

              // Stock restante considerando lo que ya está en el carrito
              const enCarrito = getCantidadEnCarrito(item.codigo_producto);
              const disponible = stockReal - enCarrito;

              return (
                <div
                  className="col-12 col-md-6 col-lg-4"
                  key={item.codigo_producto}
                >
                  <div className="card card-soft shadow-soft h-100 product-card">
                    <Link
                      to={`/menu/${item.codigo_producto}`}
                      className="ratio ratio-4x3"
                    >
                      <img
                        src={formatImagePath(item.imagen_producto)}
                        alt={item.nombre_producto}
                        className="w-100 h-100 object-fit-cover"
                        loading="lazy"
                      />
                    </Link>

                    <div className="card-body d-flex flex-column text-center gap-2">
                      <p className="text-uppercase small text-muted mb-1">
                        {item.categoriaNombre}
                      </p>

                      <h3 className="h5 mb-0">{item.nombre_producto}</h3>

                      <p className="fw-semibold mb-0">
                        {formatPrice(item.precio_producto)}
                      </p>

                      <p className="text-muted flex-grow-1">
                        {item.descripción_producto}
                      </p>

                      <div className="d-grid gap-2">
                        <Button
                          as="link"
                          to={`/menu/${item.codigo_producto}`}
                          variant="strawberry"
                          block
                        >
                          Ver detalle y personalizar
                        </Button>

                        {/* BOTÓN AÑADIR / SIN STOCK RESTANTE */}
                        <Button
                          variant="mint"
                          block
                          disabled={disponible <= 0}
                          onClick={() => handleAddToCart(item)}
                          className={disponible <= 0 ? "opacity-75" : ""}
                        >
                          {disponible <= 0 ? (
                            <>
                              <i className="bi bi-x-circle" /> Sin stock
                              disponible
                            </>
                          ) : (
                            <>
                              <i className="bi bi-cart-plus" /> Añadir al
                              carrito
                            </>
                          )}
                        </Button>

                        {/* MENSAJE DE STOCK */}
                        {disponible <= 0 && (
                          <p className="small text-danger mb-0">
                            No hay stock disponible para este producto.
                          </p>
                        )}

                        <Button
                          variant="mint"
                          block
                          onClick={() => handleShare(item)}
                        >
                          <i className="bi bi-share" /> Compartir
                        </Button>

                        {cardFeedbacks[item.codigo_producto] && (
                          <div
                            className={`small ${
                              cardFeedbacks[item.codigo_producto]?.tone ===
                              "danger"
                                ? "text-danger"
                                : "text-success"
                            }`}
                          >
                            {cardFeedbacks[item.codigo_producto]?.text}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuPage;
