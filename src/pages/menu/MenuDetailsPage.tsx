import { Link } from "react-router-dom";

import { Breadcrumbs, Button } from "@/components/common";
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
      <section className="container py-5">
        <div className="card card-soft shadow-soft p-5 text-center">
          <h1 className="section-title mb-3">Producto no encontrado</h1>
          <p className="mb-4">
            Es posible que el código ingresado no exista o que el producto haya
            sido actualizado.
          </p>
          <Button as="link" to="/menu" variant="mint">
            Volver a la carta
          </Button>
        </div>
      </section>
    );
  }
  return (
    <section className="container py-4 py-lg-5">
      <Breadcrumbs items={breadcrumbItems} className="mb-4" />

      <div className="row g-4">
        {/* ======================
         * Galería de imágenes
         * ====================== */}
        <div className="col-lg-7">
          <div className="card card-soft shadow-soft h-100 d-flex">
            <div className="card-body p-3 d-flex flex-column flex-lg-row gap-3 h-100">
              <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                <div className="ratio ratio-4x3 w-100">
                  {selectedImage ?? primaryImage ? (
                    <img
                      src={selectedImage ?? primaryImage}
                      alt={producto.nombre}
                      className="w-100 h-100 object-fit-cover rounded"
                    />
                  ) : (
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-secondary-subtle rounded">
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
                    const isActive = img === (selectedImage ?? primaryImage);
                    return (
                      <button
                        key={img}
                        type="button"
                        className={cx("menu-gallery__thumb", {
                          active: isActive,
                        })}
                        onClick={() => setSelectedImage(img)}
                        aria-pressed={isActive}
                        role="listitem"
                      >
                        <img
                          src={img}
                          alt={`${producto.nombre} vista adicional`}
                          className="object-fit-cover"
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
          <div className="card card-soft card-soft--compact shadow-soft h-100">
            <div className="card-body d-flex flex-column gap-1">
              <div>
                <h1 className="h3 mb-1">{producto.nombre}</h1>

                <div className="small mb-1">
                  <span className="me-2">Código:</span>
                  <code>{producto.id}</code>
                </div>

                <p className="h4 mb-2">{formatPrice(producto.precio)}</p>
              </div>

              <p className="mb-2">{producto.descripcion}</p>

              <hr className="my-2" />

              {/* ======================
               * MENSAJE PERSONALIZADO
               * ====================== */}
              <div>
                <label htmlFor="customMessage" className="form-label">
                  Mensaje personalizado (opcional)
                </label>

                <textarea
                  id="customMessage"
                  className="form-control"
                  rows={2}
                  placeholder="¡Feliz cumpleaños, Marta!"
                  maxLength={MAX_MESSAGE_LENGTH}
                  value={mensaje}
                  onChange={handleMessageChange}
                />

                <div className="form-text text-end mt-0">
                  {mensaje.length}/{MAX_MESSAGE_LENGTH} caracteres
                </div>
              </div>

              {/* ======================
               * CANTIDAD
               * ====================== */}
              <div className="mt-1">
                <div className="row g-3 align-items-end">
                  <div className="col-12 col-sm-6">
                    <label className="form-label" htmlFor="productQuantity">
                      Cantidad
                    </label>

                    <input
                      type="number"
                      id="productQuantity"
                      className="form-control"
                      min={1}
                      max={maxQuantity}
                      value={quantity}
                      onChange={handleQuantityChange}
                      onBlur={handleQuantityBlur}
                      disabled={isOutOfStock}
                    />
                  </div>

                  <div className="col-12 col-sm-6 d-grid">
                    <Button
                      type="button"
                      size="lg"
                      variant="mint"
                      block
                      onClick={addToCart}
                      disabled={isOutOfStock}
                    >
                      {isOutOfStock
                        ? "Sin stock disponible"
                        : "Añadir al carrito"}
                    </Button>
                  </div>
                </div>

                {/* Texto de stock  */}
                <div className="form-text text-end text-sm-start mt-1">
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
              </div>

              {/* ======================
               * FEEDBACK
               * ====================== */}
              {feedback && (
                <div
                  className={cx("small mt-1", {
                    "text-success": feedback.tone === "success",
                    "text-danger": feedback.tone === "danger",
                  })}
                  role="status"
                  aria-live="polite"
                >
                  {feedback.text}
                </div>
              )}

              <hr className="my-2" />

              <ul className="list-unstyled small mb-0">
                <li>
                  <i className="bi bi-check2-circle me-2" />Decoración
                  personalizable
                </li>
                <li>
                  <i className="bi bi-truck me-2" />
                  Envíos en Concepción y alrededores
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ======================
       * RECOMENDADOS
       * ====================== */}
      <section className="mt-5">
        <h2 className="h5 mb-3">Productos recomendados</h2>

        {recommended.length === 0 ? (
          <p>Pronto añadiremos más recomendaciones.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-3 g-3">
            {recommended.map((item) => (
              <div className="col" key={item.id}>
                <div className="card card-soft h-100 shadow-soft product-card">
                  <Link to={`/menu/${item.id}`} className="ratio ratio-4x3">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="rounded-top w-100 h-100 object-fit-cover"
                      loading="lazy"
                    />
                  </Link>

                  <div className="card-body d-flex flex-column gap-2">
                    <h3 className="h6 mb-0">{item.nombre}</h3>
                    <p className="mb-0">{formatPrice(item.precio)}</p>
                    <Button
                      as="link"
                      to={`/menu/${item.id}`}
                      size="sm"
                      variant="strawberry"
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
    </section>
  );
};

export default MenuDetailsPage;
