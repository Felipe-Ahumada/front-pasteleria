import { Button } from "@/components/common";
import { useCart } from "@/hooks/useCart";
import useAuth from "@/hooks/useAuth";
import { formatPrice } from "@/utils/format/priceFormatter";

const CartPage = () => {
  const { items, totals, removeItem, updateQuantity, clear } = useCart();
  const { isAuthenticated } = useAuth();

  if (items.length === 0) {
    return (
      <main className="p-0">
        <section className="bg-cocoa-dark min-vh-100 d-flex align-items-center justify-content-center py-5">
          <div className="container text-center">
            <div className="bg-cocoa-glass p-5 rounded-4 border-gold d-inline-block shadow-lg">
              <div className="mb-4">
                <i className="bi bi-cart3 text-gold display-1"></i>
              </div>
              <h1 className="text-gold fw-bold mb-3 font-title display-5">
                Tu carrito está vacío
              </h1>
              <p className="text-premium-body lead mb-5">
                ¡Explora nuestra carta y agrega tus dulces favoritos!
              </p>

              <Button
                as="link"
                to="/menu"
                variant="mint"
                size="lg"
                className="fw-bold shadow-soft rounded-pill px-5"
              >
                Ir a la carta
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="p-0">
      <section className="bg-cocoa-dark min-vh-100 py-5">
        <div className="container pt-4">
          <h1 className="text-gold fw-bold mb-2 font-title display-5 text-center">
            Carrito de Compras
          </h1>
          <p className="text-premium-body text-center mb-5 lead">
            Revisa tus productos antes de finalizar la compra
          </p>

          <div className="row g-4">
            {/* LISTA DE PRODUCTOS */}
            <div className="col-lg-7">
              <div className="d-flex flex-column gap-3">
                {items.map((item) => {
                  const hasMessage = Boolean(item.mensaje?.trim());

                  return (
                    <div
                      key={`${item.codigo}-${item.mensaje ?? ""}`}
                      className="bg-cocoa-glass border-gold rounded-4 p-3 p-md-4 d-flex flex-column flex-md-row gap-4 align-items-center align-items-md-start shadow-sm"
                    >
                      {/* Imagen */}
                      <div
                        className="ratio ratio-1x1 flex-shrink-0 border border-gold rounded-3 overflow-hidden shadow-sm"
                        style={{ width: "120px" }}
                      >
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="object-fit-cover"
                        />
                      </div>

                      {/* Información */}
                      <div className="flex-grow-1 text-center text-md-start w-100">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2">
                          <h2 className="h4 text-gold fw-bold mb-1">
                            {item.nombre}
                          </h2>
                          <span className="text-white fw-bold fs-5">
                            {formatPrice(item.precio * item.cantidad)}
                          </span>
                        </div>

                        <p className="mb-1 text-white-50 small">
                          Código: <code className="text-gold">{item.codigo}</code>
                        </p>

                        <div className="mb-3">
                            {hasMessage ? (
                                <div className="p-2 rounded bg-cocoa-input border-gold-subtle d-inline-block d-md-block text-start">
                                    <small className="text-gold fw-bold d-block">Mensaje personalizado:</small>
                                    <span className="text-dark small fst-italic">"{item.mensaje}"</span>
                                </div>
                            ) : (
                                <span className="text-white-50 small fst-italic">(Sin mensaje personalizado)</span>
                            )}
                        </div>

                        <div className="d-flex align-items-center justify-content-center justify-content-md-between gap-3 flex-wrap">
                          <div className="d-flex align-items-center gap-2">
                            <label className="text-gold fw-bold small">Cant:</label>
                            <input
                              type="number"
                              min={1}
                              className="form-control bg-cocoa-input text-gold border-gold fw-bold text-center"
                              style={{ width: "80px" }}
                              value={item.cantidad}
                              onChange={(e) =>
                                updateQuantity(
                                  item.codigo,
                                  item.mensaje ?? null,
                                  Number(e.target.value)
                                )
                              }
                            />
                          </div>

                          <Button
                            size="sm"
                            variant="strawberry"
                            className="shadow-soft fw-bold px-3 rounded-pill"
                            onClick={() =>
                              removeItem(item.codigo, item.mensaje ?? null)
                            }
                          >
                            <i className="bi bi-trash3 me-1"></i> Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RESUMEN */}
            <div className="col-lg-5">
              <div
                className="bg-cocoa-strong rounded-4 p-4 sticky-top text-white"
                style={{ top: "100px", zIndex: 1 }}
              >
                <h3 className="h4 text-gold fw-bold mb-4 font-title text-center">
                  Resumen del Pedido
                </h3>

                {/* TABLA RESUMEN TIPO CHECKOUT */}
                <div className="table-responsive mb-4">
                  <table
                    className="table table-borderless text-white align-middle mb-0"
                    style={{ "--bs-table-bg": "transparent" } as any}
                  >
                    <thead className="border-bottom border-gold text-gold small text-uppercase">
                      <tr>
                        <th scope="col" className="text-gold">Producto</th>
                        <th scope="col" className="text-center text-gold">Cant.</th>
                        <th scope="col" className="text-end text-gold">Precio</th>
                        <th scope="col" className="text-end text-gold">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="border-bottom border-gold">
                      {items.map((item) => (
                        <tr key={`${item.codigo}-${item.mensaje ?? ""}`} className="text-white">
                          <td>
                            <div className="d-flex flex-column">
                              <span className="fw-semibold small text-white">{item.nombre}</span>
                              {item.mensaje && (
                                <small className="text-white-50 fst-italic" style={{ fontSize: '0.75rem' }}>
                                  Msg: {item.mensaje}
                                </small>
                              )}
                            </div>
                          </td>
                          <td className="text-center text-white">{item.cantidad}</td>
                          <td className="text-end small text-white">
                            {formatPrice(item.precio)}
                          </td>
                          <td className="text-end fw-bold text-white">
                            {formatPrice(item.precio * item.cantidad)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="fs-6">
                      {/* SUBTOTAL */}
                      <tr>
                        <td colSpan={3} className="text-end text-white pt-3">
                          Subtotal:
                        </td>
                        <td className="text-end fw-bold pt-3 text-white">
                          {formatPrice(totals.subtotal)}
                        </td>
                      </tr>

                      {/* DESCUENTOS */}
                      {totals.discountAmount > 0 && (
                        <tr className="text-mint">
                          <td colSpan={3} className="text-end text-mint">
                            <i className="bi bi-tag-fill me-1"></i>
                            {totals.discountDescription.join(", ")}
                          </td>
                          <td className="text-end fw-bold text-mint">
                            - {formatPrice(totals.discountAmount)}
                          </td>
                        </tr>
                      )}

                      {/* TOTAL FINAL */}
                      <tr>
                        <td colSpan={3} className="text-end pt-3">
                          <span className="h5 text-gold fw-bold">Total a pagar:</span>
                        </td>
                        <td className="text-end pt-3">
                          <span className="h4 text-gold fw-bold">
                            {formatPrice(totals.totalPagar)}
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="d-grid gap-3">
                  {isAuthenticated ? (
                    <Button
                      as="link"
                      to="/checkout"
                      variant="mint"
                      size="lg"
                      className="fw-bold shadow-soft rounded-pill"
                    >
                      Proceder al Pago <i className="bi bi-arrow-right ms-2"></i>
                    </Button>
                  ) : (
                    <div className="text-center">
                      <Button
                        disabled
                        variant="mint"
                        size="lg"
                        className="w-100 mb-2 opacity-50 rounded-pill"
                      >
                        Proceder al Pago
                      </Button>
                      <small className="text-strawberry fw-bold">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        Inicia sesión para continuar
                      </small>
                    </div>
                  )}

                  <Button
                    variant="strawberry"
                    size="sm"
                    className="fw-bold rounded-pill text-uppercase shadow-sm mt-2"
                    onClick={clear}
                  >
                    Vaciar carrito
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CartPage;
