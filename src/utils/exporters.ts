import type { Producto } from "@/service/menuService";

/* ---------------------------------------
   FORMATEO DE TABLA (uso común)
----------------------------------------- */
const buildHtmlTable = (productos: Producto[]) => {
  return `
    <table border="1" style="border-collapse:collapse;">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Categoría</th>
        </tr>
      </thead>
      <tbody>
        ${productos
          .map(
            (p) => `
          <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>${p.descripcion}</td>
            <td>${p.precio}</td>
            <td>${p.stock}</td>
            <td>${p.categoria}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
};

/* ---------------------------------------
   EXPORTAR CSV
----------------------------------------- */
export const exportCSV = (productos: Producto[]) => {
  const header = "ID,Nombre,Descripción,Precio,Stock,Categoría\n";

  const rows = productos
    .map(
      (p) =>
        `${p.id},"${p.nombre}","${p.descripcion}",${p.precio},${p.stock},"${p.categoria}"`
    )
    .join("\n");

  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "productos.csv";
  a.click();
};

/* ---------------------------------------
   EXPORTAR EXCEL (XLS)
----------------------------------------- */
export const exportExcel = (productos: Producto[]) => {
  const table = buildHtmlTable(productos);

  const blob = new Blob([table], {
    type: "application/vnd.ms-excel",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "productos.xls";
  a.click();
};

/* ---------------------------------------
   EXPORTAR PDF (sin librerías)
----------------------------------------- */
export const exportPDF = (productos: Producto[]) => {
  const table = buildHtmlTable(productos);

  const html = `
    <html>
      <head>
        <title>Reporte de Productos</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { color: #b13e63; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
          th { background: #f7b7d1; }
        </style>
      </head>
      <body>
        <h2>Reporte de Productos</h2>
        ${table}
      </body>
    </html>
  `;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow!.document;
  doc.open();
  doc.write(html);
  doc.close();

  iframe.onload = () => {
    iframe.contentWindow!.focus();
    iframe.contentWindow!.print();
    document.body.removeChild(iframe);
  };
};
