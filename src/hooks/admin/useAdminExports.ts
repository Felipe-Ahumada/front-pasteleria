import { exportCSV, exportExcel, exportPDF } from "@/utils/exporters";
import type { Producto } from "@/service/menuService";

export const useAdminExports = (productos: Producto[]) => {
  const handleExportCSV = () => exportCSV(productos);
  const handleExportExcel = () => exportExcel(productos);
  const handleExportPDF = () => exportPDF(productos);

  return {
    handleExportCSV,
    handleExportExcel,
    handleExportPDF,
  };
};
