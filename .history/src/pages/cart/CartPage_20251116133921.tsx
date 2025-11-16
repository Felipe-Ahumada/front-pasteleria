import { Button } from "@/components/common";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/format/priceFormatter";

const CartPage = () => {
  const { items, totals, removeItem, updateQuantity, clear } = useCart();

  if (items.length === 0) {
    return (
      <section className="container py-5 text-center">
        <h1 className="section-title mb-3">Carrito de compras</h1>
        <p className="mb-4">
          Aún no tienes productos en tu carrito.  
          ¡Explora nuestra carta y agrega tus favoritos!
        </p>

        <Button as="link" to="/menu" variant="mint">
          Ir a la carta
        </Button>
      </section>
    );
  }

  return (
    <section className="container py-4 py-lg-5">
      <h1 className="section-title mb-4">Carrito de compras</h1>

      <div className="row g-4">
        {/* LISTA DE PRODUCTOS */}
        <div className="col-lg-8">
          <div className="d-flex flex-column gap-3">
            {items.map((item) => {
              const hasMessage = Boolean(item.mensaje?.trim());

              return (
                <div
                  key={`${item.codigo}-${item.mensaje ?? ""}`}
                  className="card card-soft shadow-soft p-3 d-flex flex-row gap-3 align-items-start"
                >
                  {/* Imagen */}
                  <div className="ratio ratio-1x1" style={{ width: "110px" }}>
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="object-fit-cover rounded"
                    />
                  </div>

                  {/* Información */}
                  <div className="flex-grow-1">
                    <h2 className="h6 mb-1">{item.nombre}</h2>

                    <p className="mb-1 text-muted small">
                      Código: <code>{item.codigo}</code>
                    </p>

                    {/* Mensaje personalizado */}
                    <p className="mb-2 small text-muted">
                      <strong>Mensaje:</strong>{" "}
                      {hasMessage ? (
                        <span className="text-dark">{item.mensaje}</span>
                      ) : (
                        <span className="fst-italic text-secondary opacity-75">
                          (Sin mensaje)
                        </span>
                      )}
                    </p>

                    {/* Precio */}
                    <p className="mb-2 fw-semibold">
                      {formatPrice(item.precio)} c/u
                    </p>

                    {/* Cantidad */}
                    <div className="d-flex align-items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        className="form-control"
                        style={{ width: "90px" }}
                        value={item.cantidad}
                        onChange={(e) =>
                          updateQuantity(item.codigo, item.mensaje ?? null, Number(e.target.value))
                        }
                      />

                      <Button
                        size="sm"
                        variant="strawberry"
                        onClick={() => removeItem(item.codigo, item.mensaje ?? null)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>

                  {/* Total parcial */}
                  <div className="text-end">
                    <p className="fw-bold mb-0">
                      {formatPrice(item.precio * item.cantidad)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RESUMEN */}
        <div className="col-lg-4">
          <div className="card card-soft shadow-soft p-4">
            <h3 className="h5 mb-3">Resumen</h3>

            <div className="d-flex justify-content-between mb-2">
              <span>Total productos:</span>
              <strong>{totals.totalCantidad}</strong>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <span>Total a pagar:</span>
              <strong>{formatPrice(totals.totalPrecio)}</strong>
            </div>

            <div className="d-grid gap-2">
              <Button variant="mint" size="lg">
                Proceder al pago
              </Button>

              <Button variant="strawberry" size="sm" onClick={clear}>
                Vaciar carrito
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
