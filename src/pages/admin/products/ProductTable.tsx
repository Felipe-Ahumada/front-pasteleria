import type { Producto } from "@/service/menuService";
import { Button } from "@/components/common";

interface Props {
  productos: Producto[];
  onEdit: (p: Producto) => void;
  onDelete: (p: Producto) => void;    // ← ahora recibe Producto
  onView: (p: Producto) => void;      // ← agregado correctamente
}

const ProductTable = ({ productos, onEdit, onDelete, onView }: Props) => {
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
            <th className="text-end">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productos.map((p) => (
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

              <td className="text-end">
                <Button
                  variant="mint"
                  className="me-2"
                  onClick={() => onView(p)}
                >
                  Ver
                </Button>

                <Button
                  variant="mint"
                  className="me-2"
                  onClick={() => onEdit(p)}
                >
                  Editar
                </Button>

                <Button
                  variant="strawberry"
                  onClick={() => onDelete(p)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
