import type { Producto } from "@/service/menuService";
import { Button } from "@/components/common";

interface Props {
  productos: Producto[];
  onEdit?: (p: Producto) => void;
  onToggleStatus?: (p: Producto) => void;
  onView: (p: Producto) => void;
}

const ProductTable = ({ productos, onEdit, onToggleStatus, onView }: Props) => {
  const canEdit = typeof onEdit === "function";
  const canToggle = typeof onToggleStatus === "function";

  return (
    <div className="table-responsive card-soft p-3">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Código</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productos.map((p) => {
            const isBlocked = p.activo === false;

            return (
              <tr key={p.id}>
              <td style={{ width: 80 }}>
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  className="rounded"
                  style={{ width: 60, height: 60, objectFit: "cover" }}
                />
              </td>

              <td>{p.nombre}</td>
              <td>{p.id}</td>
              <td>${p.precio.toLocaleString()}</td>
              <td>{p.stock}</td>
              <td>
                <span
                  className={
                    isBlocked ? "badge bg-secondary" : "badge bg-success"
                  }
                >
                  {isBlocked ? "Bloqueado" : "Activo"}
                </span>
              </td>

              <td className="text-end">
                <Button
                  variant="mint"
                  className={canEdit || canToggle ? "me-2" : undefined}
                  onClick={() => onView(p)}
                >
                  Ver
                </Button>

                {canEdit && onEdit ? (
                  <Button
                    variant="mint"
                    className={canToggle ? "me-2" : undefined}
                    onClick={() => onEdit(p)}
                  >
                    Editar
                  </Button>
                ) : null}

                {canToggle && onToggleStatus ? (
                  <Button
                    variant={isBlocked ? "mint" : "strawberry"}
                    onClick={() => onToggleStatus(p)}
                  >
                    {isBlocked ? "Desbloquear" : "Bloquear"}
                  </Button>
                ) : null}
              </td>
            </tr>
          );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
