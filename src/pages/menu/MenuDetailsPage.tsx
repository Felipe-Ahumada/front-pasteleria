import { Link } from "react-router-dom";

import { Button } from "@/components/common";
import type { BreadcrumbItem } from "@/components/common";

import cx from "@/utils/cx";

// Hooks limpios
import { useMenuDetails } from "@/hooks/details/useMenuDetails";

// Formato de precio
import { formatPrice } from "@/utils/format/priceFormatter";

const MAX_MESSAGE_LENGTH = 25;


const MenuDetailsPage = () => {
  const {
    /** Producto */
    producto,
    categoria,

    /** Recomendados */
    recommended,

    /** Cantidad */
    quantity,
    maxQuantity,
    handleQuantityChange,
    handleQuantityBlur,

    /** Mensaje */
    mensaje,
    handleMessageChange,

    /** Galería */
    primaryImage,
    gallery,
    selectedImage,
    setSelectedImage,

    /** Feedback */
    feedback,

    /** Stock */
    stockRestante,
    isOutOfStock,

    /** Carrito */
    addToCart,
  } = useMenuDetails();

  /** ---------------------------
   * Breadcrumb dinámico
   * --------------------------- */
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Inicio", to: "/" },
    { label: "Nuestra carta", to: "/menu" },
  ];

  if (producto && categoria) {
    breadcrumbItems.push({
      label: categoria,
      to: `/menu?categoria=${encodeURIComponent(categoria)}`,
    });
  }

  if (producto) {
    breadcrumbItems.push({ label: producto.nombre });
  }

  /** ---------------------------
   * Producto no encontrado
   * --------------------------- */
  if (!producto) {
    return (
      <main className="p-0">
        <section className="bg-cocoa-dark py-5 text-center min-vh-100 d-flex align-items-center justify-content-center">
          <div className="container">
            <div className="bg-cocoa-glass p-5 rounded-4 border-gold d-inline-block">
              <h2 className="text-gold mb-3">Producto no encontrado</h2>
              <p className="text-premium-body mb-4">
                Es posible que el código ingresado no exista o que el producto
                haya sido actualizado.
              </p>
              <Button
                as="link"
                to="/menu"
                variant="mint"
                className="fw-bold shadow-soft"
              >
                Volver a la Carta
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }
  return (
    <main className="p-0">
      <section className="bg-cocoa-dark py-5 min-vh-100">
        <div
          className="container"
          style={{ animation: "fadeInUp 0.8s ease-out" }}
        >
          <div className="mb-4">
             <Button
                as="link"
                to="/menu"
                size="sm"
                className="btn d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill bg-cocoa-glass text-gold border-gold shadow-sm transition-base"
                style={{ width: 'fit-content' }}
             >
                <i className="bi bi-arrow-left"></i>
                <span className="fw-bold text-uppercase small" style={{ letterSpacing: '1px' }}>Volver a la carta</span>
             </Button>
          </div>

          <div className="row g-5">
            {/* ======================
             * Galería de imágenes
             * ====================== */}
            <div className="col-lg-7">
              <div className="card bg-cocoa-glass border-gold shadow-lg h-100 p-3">
                <div className="d-flex flex-column flex-lg-row gap-3 h-100">
                  <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <div className="ratio ratio-4x3 w-100 rounded-3 overflow-hidden border border-secondary">
                      {selectedImage ?? primaryImage ? (
                        <img
                          src={selectedImage ?? primaryImage}
                          alt={producto.nombre}
                          className="w-100 h-100 object-fit-cover"
                        />
                      ) : (
                        <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-dark">
                          <i className="bi bi-image text-secondary fs-1" />
                        </div>
                      )}
                    </div>
                  </div>

                  {gallery.length > 1 && (
                    <div
                      className="menu-gallery__thumbs menu-gallery__thumbs--vertical"
                      role="list"
                    >
                      {gallery.map((img) => {
                        const isActive =
                          img === (selectedImage ?? primaryImage);
                        return (
                          <button
                            key={img}
                            type="button"
                            className={cx("menu-gallery__thumb", {
                              active: isActive,
                            })}
                            style={{
                              borderColor: isActive
                                ? "var(--title-tertiary)"
                                : "transparent",
                            }}
                            onClick={() => setSelectedImage(img)}
                            aria-pressed={isActive}
                            role="listitem"
                          >
                            <img
                              src={img}
                              alt={`${producto.nombre} vista adicional`}
                              className="object-fit-cover rounded"
                              loading="lazy"
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card bg-cocoa-glass border-gold shadow-lg h-100 p-4 p-md-5">
                <h1 className="h2 text-gold fw-bold mb-2">{producto.nombre}</h1>

                <div className="small mb-3 text-white-50">
                  <span className="me-2">Código:</span>
                  <code>{producto.id}</code>
                </div>

                <p className="display-6 text-white mb-4 fw-bold">
                  {formatPrice(producto.precio)}
                </p>

                <p className="text-premium-body lead mb-4">
                  {producto.descripcion}
                </p>

                <hr className="border-secondary my-4" />

                {/* ======================
                 * MENSAJE PERSONALIZADO
                 * ====================== */}
                <div className="mb-4">
                  <label
                    htmlFor="customMessage"
                    className="form-label text-gold fw-bold"
                  >
                    Mensaje personalizado (opcional)
                  </label>

                  <textarea
                    id="customMessage"
                    className="form-control bg-cocoa-input"
                    rows={2}
                    placeholder="¡Feliz cumpleaños, Marta!"
                    maxLength={MAX_MESSAGE_LENGTH}
                    value={mensaje}
                    onChange={handleMessageChange}
                  />

                  <div className="form-text text-white-50 text-end mt-1">
                    {mensaje.length}/{MAX_MESSAGE_LENGTH} caracteres
                  </div>
                </div>

                {/* ======================
                 * CANTIDAD
                 * ====================== */}
                <div className="row g-3 align-items-end mb-3">
                  <div className="col-4">
                    <label
                      className="form-label text-gold fw-bold"
                      htmlFor="productQuantity"
                    >
                      Cantidad
                    </label>

                    <input
                      type="number"
                      id="productQuantity"
                      className="form-control bg-cocoa-input"
                      min={1}
                      max={maxQuantity}
                      value={quantity}
                      onChange={handleQuantityChange}
                      onBlur={handleQuantityBlur}
                      disabled={isOutOfStock}
                    />
                  </div>

                  <div className="col-8">
                    <Button
                      type="button"
                      size="lg"
                      variant="mint"
                      block
                      onClick={addToCart}
                      disabled={isOutOfStock}
                      className="shadow-soft w-100 fw-bold"
                    >
                      {isOutOfStock
                        ? "Sin stock disponible"
                        : "Añadir al carrito"}
                    </Button>
                  </div>
                </div>

                {/* Texto de stock  */}
                <div className="text-end small text-white-50 mb-4">
                  {isOutOfStock ? (
                    <>No hay stock disponible para este producto.</>
                  ) : (
                    <>
                      Máximo {stockRestante}{" "}
                      {stockRestante === 1
                        ? "unidad disponible"
                        : "unidades disponibles"}
                    </>
                  )}
                </div>

                {/* ======================
                 * FEEDBACK
                 * ====================== */}
                {feedback && (
                  <div
                    className={cx("alert small", {
                      "alert-success": feedback.tone === "success",
                      "alert-danger": feedback.tone === "danger",
                    })}
                    role="status"
                    aria-live="polite"
                  >
                    {feedback.text}
                  </div>
                )}

                <ul className="list-unstyled text-premium-body small mt-auto">
                  <li className="mb-2">
                    <i className="bi bi-check2-circle text-gold me-2" />
                    Decoración personalizable
                  </li>
                  <li>
                    <i className="bi bi-truck text-gold me-2" />
                    Envíos en Concepción y alrededores
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ======================
           * RECOMENDADOS
           * ====================== */}
          <section className="mt-5 pt-5 border-top border-secondary">
            <h2 className="text-gold mb-4 text-center">
              También te podría gustar
            </h2>

            {recommended.length === 0 ? (
              <p className="text-center text-white-50">
                Pronto añadiremos más recomendaciones.
              </p>
            ) : (
              <div className="row row-cols-1 row-cols-md-3 g-4">
                {recommended.map((item) => (
                  <div className="col" key={item.id}>
                    <div className="card bg-cocoa-glass border-gold h-100 shadow-soft product-card">
                      <Link to={`/menu/${item.id}`} className="ratio ratio-4x3">
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="rounded-top w-100 h-100 object-fit-cover"
                          loading="lazy"
                        />
                      </Link>

                      <div className="card-body p-4 text-center">
                        <h5 className="text-gold fw-bold mb-2">
                          {item.nombre}
                        </h5>
                        <p className="text-white mb-3">
                          {formatPrice(item.precio)}
                        </p>
                        <Button
                          as="link"
                          to={`/menu/${item.id}`}
                          size="sm"
                          variant="mint"
                          className="w-100 rounded-pill shadow-soft fw-bold"
                        >
                          Ver detalle
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

export default MenuDetailsPage;
