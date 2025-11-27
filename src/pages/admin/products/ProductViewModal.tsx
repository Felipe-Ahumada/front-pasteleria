import { Modal, Button } from "@/components/common";
import type { Producto } from "@/service/menuService";

interface Props {
  open: boolean;
  onClose: () => void;
  producto: Producto | null;
}

const ProductViewModal = ({ open, onClose, producto }: Props) => {
  if (!producto) return null;

  return (
    <Modal open={open} onClose={onClose} title="Detalle del Producto">
      <div className="d-flex flex-column gap-4">
        {/* IMAGEN PRINCIPAL */}
        <div className="text-center">
          {producto.imagen ? (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="rounded shadow-sm"
              style={{
                width: "100%",
                maxWidth: "260px",
                height: "260px",
                objectFit: "cover",
                margin: "0 auto",
              }}
            />
          ) : (
            <div
              className="rounded shadow-sm d-flex align-items-center justify-content-center bg-secondary-subtle"
              style={{
                width: "100%",
                maxWidth: "260px",
                height: "260px",
                margin: "0 auto",
              }}
            >
              <i className="bi bi-image text-secondary fs-1" />
            </div>
          )}
        </div>

        {/* MINI GALERÍA DETALLE */}
        {producto.imagenes_detalle.length > 0 && (
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            {producto.imagenes_detalle.map((img, i) => (
              <img
                key={i}
                src={img}
                className="rounded"
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  border: "2px solid #f7b7d1",
                }}
              />
            ))}
          </div>
        )}

        {/* INFORMACIÓN */}
        <div
          className="section p-3"
          style={{ background: "var(--surface-alt)" }}
        >
          <h4 className="mb-2" style={{ color: "var(--title-secondary)" }}>
            {producto.nombre}
          </h4>

          <p className="mb-2 text-muted">{producto.descripcion}</p>

          <div className="d-flex flex-column gap-1">
            <span>
              <strong>Categoría:</strong> {producto.categoria}
            </span>
            <span>
              <strong>Código:</strong> {producto.id}
            </span>
            <span>
              <strong>Precio:</strong> ${producto.precio.toLocaleString()}
            </span>

            <span>
              <strong>Stock:</strong>{" "}
              <span
                style={{
                  color:
                    producto.stock <= (producto.stock_critico ?? 3)
                      ? "#c0392b"
                      : "var(--title-secondary)",
                }}
              >
                {producto.stock}
              </span>
            </span>

            <span>
              <strong>Stock crítico:</strong> {producto.stock_critico ?? 3}
            </span>

            <span>
              <strong>Estado:</strong>{" "}
              {producto.activo === false ? "Bloqueado" : "Activo"}
            </span>
          </div>
        </div>

        {/* BOTÓN */}
        <div className="text-end">
          <Button variant="mint" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductViewModal;
