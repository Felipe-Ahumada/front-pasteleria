// pages/menu/MenuPage.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { menuService, type Producto } from "@/service/menuService";
import { formatImagePath } from "@/utils/storage/imageHelpers";

const formatPrice = (value: number) =>
  value.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });


const ScrollRevealSection = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-hidden ${isVisible ? "reveal-visible" : "slide-from-bottom"}`}
      style={{ transition: "all 1s ease-out" }}
    >
      {children}
    </div>
  );
};

const MENU_HERO_IMAGE = "https://res.cloudinary.com/dx83p4455/image/upload/v1762263515/carrusel_carta_oznheh.jpg";

/* ===========================================================
   NORMALIZAR PRODUCTOS PARA FILTROS
=========================================================== */

const mapToEnrichedProducts = (productos: Producto[]): EnrichedProduct[] =>
  productos.map((p) => {
    const categoriaOriginal = menuData.categorias.find(
      (c) => c.nombre_categoria === p.categoria
    );

    return {
      codigo_producto: p.id,
      nombre_producto: p.nombre,
      precio_producto: p.precio,
      imagen_producto: p.imagen,
      descripción_producto: p.descripcion,

      categoriaId: categoriaOriginal?.id_categoria ?? 0,
      categoriaNombre: p.categoria,

      stock: p.stock,
    };
  });

/* ===========================================================
   COMPONENTE PRINCIPAL
=========================================================== */

const MenuPage = () => {
  const [allProducts, setAllProducts] = useState<EnrichedProduct[]>([]);

  const refreshProducts = useCallback(async () => {
    const activos = await menuService.getActive();
    setAllProducts(mapToEnrichedProducts(activos));
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const collator = useMemo(
    () => new Intl.Collator("es", { sensitivity: "base" }),
    []
  );

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

  const { addItem, items } = useCart();
  const { handleShare } = useMenuShare();

  const [cardFeedbacks, setCardFeedbacks] = useState<
    Record<string, { text: string; tone: "success" | "danger" } | null>
  >({});
  const timeouts = useRef<Record<string, number | null>>({});

  const scheduleCardFeedback = (
    key: string,
    next: { text: string; tone: "success" | "danger" }
  ) => {
    setCardFeedbacks((prev) => ({ ...prev, [key]: next }));

    if (timeouts.current[key]) clearTimeout(timeouts.current[key]!);

    timeouts.current[key] = window.setTimeout(() => {
      setCardFeedbacks((prev) => ({ ...prev, [key]: null }));
    }, 3000);
  };

  const getCantidadEnCarrito = (codigo: string) =>
    items
      .filter((i) => i.codigo === codigo)
      .reduce((acc, i) => acc + i.cantidad, 0);

  const handleAddToCart = (item: EnrichedProduct) => {
    // Check stock directly from the item (which comes from backend)
    const stockReal = item.stock;

    const enCarrito = getCantidadEnCarrito(item.codigo_producto);
    const disponible = stockReal - enCarrito;

    if (disponible <= 0) {
      scheduleCardFeedback(item.codigo_producto, {
        text: "Sin stock disponible",
        tone: "danger",
      });
      return;
    }

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

  useEffect(
    () => () => {
      Object.values(timeouts.current).forEach((id) => id && clearTimeout(id));
    },
    []
  );

  const totalProductos = filteredProducts.length;

  /* ===========================================================
     RENDER
  ============================================================ */

  return (
    <main className="p-0">
      {/* Hero Section */}
      <div className="about-hero" style={{ backgroundImage: `url(${MENU_HERO_IMAGE})` }}>
        <div className="about-hero-content">
          <h1 className="about-hero-title">CARTA</h1>
        </div>

        <div className="about-sidebar-decoration">
          <a
            href="https://www.instagram.com/pasteleria1000sabores"
            target="_blank"
            rel="noreferrer"
            className="about-sidebar-link"
          >
            <i className="bi bi-instagram"></i>
            <span>Síguenos</span>
          </a>
          <div className="about-sidebar-line"></div>
        </div>
      </div>

      <section className="bg-cocoa-dark py-5 position-relative">
        <ScrollRevealSection>
          <div className="container">
            <div className="bg-cocoa-glass p-4 rounded-4 mb-5 border-gold shadow-lg text-center">
              <h1 className="section-title mb-2 text-gold">Nuestras Delicias</h1>
              <p className="mb-0 text-premium-body">
                Explora nuestras categorías y encuentra el postre ideal.
              </p>
            </div>

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
              <p className="mb-0 text-white-50">
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
              <div className="menu-empty bg-cocoa-glass rounded-4 border-gold text-center py-5">
                <p className="mb-2 fw-semibold text-white">
                  No encontramos productos con los filtros aplicados.
                </p>
                <Button variant="mint" onClick={resetFilters}>
                  Ver carta completa
                </Button>
              </div>
            ) : (
              <div
                className="row g-4"
                key={`${selectedCategory}-${selectedProductCode}-${sortOrder}-${minPrice}-${maxPrice}`}
              >
                {filteredProducts.map((item, index) => {
                  const stockReal = item.stock;
                  const enCarrito = getCantidadEnCarrito(item.codigo_producto);
                  const disponible = stockReal - enCarrito;

                  return (
                    <div
                      className="col-12 col-md-6 col-lg-4"
                      key={item.codigo_producto}
                      style={{
                        animation: "fadeInUp 0.6s ease-out forwards",
                        animationDelay: `${index * 0.1}s`,
                        opacity: 0,
                      }}
                    >
                      <div className="card bg-cocoa-glass border-gold shadow-lg h-100 product-card">
                        <Link
                          to={`/menu/${item.codigo_producto}`}
                          className="ratio ratio-4x3"
                        >
                          <img
                            src={formatImagePath(item.imagen_producto)}
                            alt={item.nombre_producto}
                            className="w-100 h-100 object-fit-cover rounded-top-4"
                            loading="lazy"
                          />
                        </Link>

                        <div className="card-body d-flex flex-column text-center gap-2">
                          <p className="text-uppercase small text-white-50 mb-1">
                            {item.categoriaNombre}
                          </p>

                          <h3 className="h5 mb-0 text-gold">{item.nombre_producto}</h3>

                          <p className="fw-semibold mb-0 text-white">
                            {formatPrice(item.precio_producto)}
                          </p>

                          <p className="text-premium-body flex-grow-1">
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
        </ScrollRevealSection>
      </section>
    </main>
  );
};

export default MenuPage;
