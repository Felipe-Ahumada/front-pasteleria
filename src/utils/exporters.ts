import type { Producto } from "@/service/menuService";
import type { Usuario } from "@/service/userService";

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
          <th>Estado</th>
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
            <td>${p.activo === false ? "Bloqueado" : "Activo"}</td>
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
  const header = "ID,Nombre,Descripción,Precio,Stock,Categoría,Estado\n";

  const rows = productos
    .map(
      (p) =>
        `${p.id},"${p.nombre}","${p.descripcion}",${p.precio},${p.stock},"${p.categoria}",${p.activo === false ? "Bloqueado" : "Activo"}`
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

/* ---------------------------------------
   EXPORTADORES PARA USUARIOS
----------------------------------------- */

const buildUsersHtmlTable = (usuarios: Usuario[]) => {
  return `
    <table border="1" style="border-collapse:collapse;">
      <thead>
        <tr>
          <th>ID</th>
          <th>RUN</th>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Tipo</th>
          <th>Estado</th>
          <th>Región</th>
          <th>Comuna</th>
        </tr>
      </thead>
      <tbody>
        ${usuarios
          .map((u) => `
            <tr>
              <td>${u.id}</td>
              <td>${u.run}-${u.dv}</td>
              <td>${u.nombre} ${u.apellidos}</td>
              <td>${u.correo}</td>
              <td>${u.tipoUsuario}</td>
              <td>${u.activo === false ? "Bloqueado" : "Activo"}</td>
              <td>${u.regionNombre}</td>
              <td>${u.comuna}</td>
            </tr>
          `)
          .join("")}
      </tbody>
    </table>
  `;
};

export const exportUsersCSV = (usuarios: Usuario[]) => {
  const header = "ID,RUN,Nombre completo,Correo,Tipo,Estado,Región,Comuna\n";

  const rows = usuarios
    .map((u) => {
      const run = `${u.run}-${u.dv}`;
      const nombre = `${u.nombre} ${u.apellidos}`.trim();
      const estado = u.activo === false ? "Bloqueado" : "Activo";
      return `${u.id},"${run}","${nombre}","${u.correo}","${u.tipoUsuario}","${estado}","${u.regionNombre}","${u.comuna}"`;
    })
    .join("\n");

  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "usuarios.csv";
  a.click();
};

export const exportUsersExcel = (usuarios: Usuario[]) => {
  const table = buildUsersHtmlTable(usuarios);

  const blob = new Blob([table], {
    type: "application/vnd.ms-excel",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "usuarios.xls";
  a.click();
};

export const exportUsersPDF = (usuarios: Usuario[]) => {
  const table = buildUsersHtmlTable(usuarios);

  const html = `
    <html>
      <head>
        <title>Reporte de Usuarios</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { color: #4a7f62; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
          th { background: #c6f2e1; }
        </style>
      </head>
      <body>
        <h2>Reporte de Usuarios</h2>
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
