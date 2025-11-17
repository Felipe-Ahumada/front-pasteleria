import { useState, useEffect } from "react";
import type { Producto } from "@/service/menuService";
import { Modal, Button, Input } from "@/components/common";
import { CATEGORIAS } from "@/utils/categories";
import { validateProduct } from "@/utils/validations/productValidations";
import { generateProductCode } from "@/utils/code/generateProductCode";
import { defaultProductImage } from "@/assets";

interface Props {
  open: boolean;
  onClose: () => void;
  producto: Producto | null;
  onSaved: (p: Producto) => void;
}

const ProductFormModal = ({ open, onClose, producto, onSaved }: Props) => {
  const [form, setForm] = useState<Producto>({
    id: "",
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    categoria: "",
    stock_critico: 3,
    imagen: "",
    imagenes_detalle: [],
    activo: true,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof Producto, string>>
  >({});

  // Cargar datos al abrir modal
  useEffect(() => {
    if (!open) return;

    if (producto) {
      // Modo edición
      setForm(JSON.parse(JSON.stringify(producto)));
    } else {
      // Modo nuevo
      const categoriaInicial = CATEGORIAS[0] ?? "General";

      setForm({
        id: generateProductCode(categoriaInicial),
        nombre: "",
        descripcion: "",
        precio: 0,
        stock: 0,
        categoria: categoriaInicial,
        stock_critico: 3,
        imagen: defaultProductImage,
        imagenes_detalle: [],
        activo: true,
      });
    }

    setErrors({});
  }, [open, producto]);

  const handleChange = <K extends keyof Producto>(
    key: K,
    value: Producto[K]
  ) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    const { valid, errors: validationErrors } = validateProduct(form);

    setErrors(validationErrors);
    if (!valid) return;

    onSaved(form);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={producto ? "Editar producto" : "Nuevo producto"}
    >
      <div className="d-flex flex-column gap-3">
        {/* Código */}
        <Input
          label="Código"
          value={form.id}
          errorText={errors.id}
          onChange={(e) => handleChange("id", e.target.value.toUpperCase())}
        />

        {/* Nombre */}
        <Input
          label="Nombre"
          value={form.nombre}
          errorText={errors.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
        />

        {/* Descripción */}
        <Input
          label="Descripción"
          value={form.descripcion}
          onChange={(e) => handleChange("descripcion", e.target.value)}
        />

        {/* Precio / Stock / Stock crítico */}
        <div className="d-flex gap-2">
          <Input
            label="Precio"
            type="number"
            min={1000}
            value={form.precio}
            errorText={errors.precio}
            onChange={(e) => handleChange("precio", Number(e.target.value))}
          />

          <Input
            label="Stock"
            type="number"
            value={form.stock}
            errorText={errors.stock}
            onChange={(e) => handleChange("stock", Number(e.target.value))}
          />

          <Input
            label="Stock crítico"
            type="number"
            value={form.stock_critico}
            errorText={errors.stock_critico}
            onChange={(e) =>
              handleChange("stock_critico", Number(e.target.value))
            }
          />
        </div>

        {/* Categoría con LABEL */}
        <div>
          <label className="form-label">Categoría</label>
          <select
            className="form-select"
            value={form.categoria}
            onChange={(e) => {
              const nuevaCat = e.target.value;

              // Regenerar código solo en creación
              if (!producto) {
                const newCode = generateProductCode(nuevaCat);
                setForm((prev) => ({
                  ...prev,
                  categoria: nuevaCat,
                  id: newCode,
                }));
              } else {
                handleChange("categoria", nuevaCat);
              }
            }}
          >
            <option value="">Seleccione categoría...</option>
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.categoria && (
            <small className="text-danger">{errors.categoria}</small>
          )}
        </div>

        {/* Imagen */}
        <Input
          label="URL de imagen"
          value={form.imagen}
          onChange={(e) => handleChange("imagen", e.target.value)}
        />

        {/* Botones */}
        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button variant="strawberry" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="mint" onClick={handleSubmit}>
            Guardar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductFormModal;
