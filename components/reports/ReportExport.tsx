import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

export const exportToExcel = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `${fileName}.xlsx`);
};

export const exportToPDF = (data: any[], title: string) => {
  const doc = new jsPDF();

  doc.text(title, 10, 10);

  let y = 20;

  data.forEach((item) => {
    doc.text(JSON.stringify(item), 10, y);

    y += 10;
  });

  doc.save(`${title}.pdf`);
};

export const printReport = () => {
  window.print();
};

export const shareReport = async (title: string) => {
  if (navigator.share) {
    await navigator.share({
      title,
      text: title,
    });
  }
};

export const shareWhatsApp = (title: string) => {
  const url = `https://wa.me/?text=${encodeURIComponent(title)}`;

  window.open(url, "_blank");
};
