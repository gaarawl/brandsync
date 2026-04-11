import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type InvoiceData = {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  from: { name: string; email: string };
  to: { name: string; email: string };
  items: { description: string; platform: string; amount: number }[];
  total: number;
  status: string;
};

export function generateInvoicePDF(data: InvoiceData) {
  const doc = new jsPDF();
  const purple = [167, 139, 250]; // accent color

  // Header bar
  doc.setFillColor(purple[0], purple[1], purple[2]);
  doc.rect(0, 0, 210, 8, "F");

  // Logo / Title
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50, 50, 50);
  doc.text("FACTURE", 20, 30);

  // Invoice number & dates
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text(`N° ${data.invoiceNumber}`, 20, 38);
  doc.text(`Date : ${data.date}`, 20, 44);
  doc.text(`Échéance : ${data.dueDate}`, 20, 50);

  // Status badge
  const statusColor =
    data.status === "paid"
      ? [34, 197, 94]
      : data.status === "overdue"
      ? [239, 68, 68]
      : [234, 179, 8];
  const statusLabel =
    data.status === "paid"
      ? "PAYÉ"
      : data.status === "overdue"
      ? "EN RETARD"
      : "EN ATTENTE";

  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(150, 22, 40, 10, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(statusLabel, 170, 28.5, { align: "center" });

  // From / To
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("DE", 20, 65);
  doc.text("À", 120, 65);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(10);
  doc.text(data.from.name, 20, 72);
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(data.from.email, 20, 78);

  doc.setTextColor(80, 80, 80);
  doc.setFontSize(10);
  doc.text(data.to.name, 120, 72);
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(data.to.email, 120, 78);

  // Separator
  doc.setDrawColor(230, 230, 230);
  doc.line(20, 85, 190, 85);

  // Items table
  autoTable(doc, {
    startY: 92,
    head: [["Description", "Plateforme", "Montant"]],
    body: data.items.map((item) => [
      item.description,
      item.platform,
      `${item.amount.toLocaleString("fr-FR")} €`,
    ]),
    headStyles: {
      fillColor: [purple[0], purple[1], purple[2]],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      textColor: [60, 60, 60],
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [248, 248, 250],
    },
    columnStyles: {
      2: { halign: "right", fontStyle: "bold" },
    },
    margin: { left: 20, right: 20 },
    theme: "grid",
    styles: {
      lineColor: [230, 230, 230],
      lineWidth: 0.3,
      cellPadding: 5,
    },
  });

  // Total
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } })
    .lastAutoTable.finalY;

  doc.setFillColor(248, 248, 250);
  doc.rect(110, finalY + 5, 80, 14, "F");
  doc.setDrawColor(230, 230, 230);
  doc.rect(110, finalY + 5, 80, 14, "S");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50, 50, 50);
  doc.text("TOTAL", 118, finalY + 13.5);
  doc.setTextColor(purple[0], purple[1], purple[2]);
  doc.setFontSize(12);
  doc.text(`${data.total.toLocaleString("fr-FR")} €`, 182, finalY + 14, {
    align: "right",
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text(
    "Facture générée par BrandSync",
    105,
    285,
    { align: "center" }
  );

  // Bottom bar
  doc.setFillColor(purple[0], purple[1], purple[2]);
  doc.rect(0, 289, 210, 8, "F");

  return doc;
}
