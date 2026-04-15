import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ndprData from "@/data/ndpr_dataset.json";
import { RemediationItem } from "./remediationData";

interface ReportData {
  appName: string;
  riskScore: number;
  riskLevel: string;
  explanation: string;
  questions: { question: string; answer: boolean | null }[];
  triggeredClauses: typeof ndprData.clauses;
  remediationItems: RemediationItem[];
  checkedItems: Record<string, boolean>;
  sector?: string;
}

export function generateReport(data: ReportData) {
  const doc = new jsPDF();
  const brandColor: [number, number, number] = [15, 118, 110]; // teal
  const textColor: [number, number, number] = [30, 41, 59];
  const lightGray: [number, number, number] = [148, 163, 184];
  const pageW = doc.internal.pageSize.getWidth();
  const date = new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" });

  // Cover page
  doc.setFillColor(...brandColor);
  doc.rect(0, 0, pageW, 60, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("RegTrack", 20, 30);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("NDPR Compliance Report", 20, 42);
  doc.text(date, 20, 52);

  doc.setTextColor(...textColor);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`App: ${data.appName || "Unnamed App"}`, 20, 80);
  if (data.sector) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Sector: ${data.sector}`, 20, 90);
  }

  // Risk score
  doc.setFontSize(48);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...brandColor);
  doc.text(`${data.riskScore}%`, pageW / 2, 130, { align: "center" });
  doc.setFontSize(16);
  doc.text(`${data.riskLevel.toUpperCase()} RISK`, pageW / 2, 145, { align: "center" });

  doc.setTextColor(...textColor);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const explLines = doc.splitTextToSize(data.explanation, pageW - 40);
  doc.text(explLines, 20, 165);

  // Page 2 — Questions & Answers
  doc.addPage();
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...brandColor);
  doc.text("Assessment Questions & Answers", 20, 25);

  const qRows = data.questions.map((q, i) => [
    `${i + 1}`,
    q.question,
    q.answer === true ? "Yes" : q.answer === false ? "No" : "—",
  ]);

  autoTable(doc, {
    startY: 35,
    head: [["#", "Question", "Answer"]],
    body: qRows,
    headStyles: { fillColor: brandColor, textColor: [255, 255, 255] },
    styles: { fontSize: 9, cellPadding: 4 },
    columnStyles: { 0: { cellWidth: 12 }, 2: { cellWidth: 22 } },
    theme: "striped",
  });

  // Triggered clauses
  doc.addPage();
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...brandColor);
  doc.text("Triggered NDPR Clauses", 20, 25);

  if (data.triggeredClauses.length > 0) {
    const clauseRows = data.triggeredClauses.map(c => [
      c.article_ref,
      c.title,
      c.summary.substring(0, 120) + (c.summary.length > 120 ? "…" : ""),
      c.penalty_info || "—",
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["Article", "Title", "Summary", "Penalty"]],
      body: clauseRows,
      headStyles: { fillColor: brandColor, textColor: [255, 255, 255] },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: { 0: { cellWidth: 22 }, 1: { cellWidth: 30 } },
      theme: "striped",
    });
  } else {
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    doc.text("No clauses were triggered. Your app appears compliant.", 20, 40);
  }

  // Remediation checklist
  if (data.remediationItems.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...brandColor);
    doc.text("Remediation Checklist", 20, 25);

    const remRows = data.remediationItems.map(item => [
      data.checkedItems[item.id] ? "✓" : "☐",
      item.priority.toUpperCase(),
      item.title,
      item.description.substring(0, 100) + (item.description.length > 100 ? "…" : ""),
      item.timeEstimate,
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["Done", "Priority", "Action", "Details", "Time"]],
      body: remRows,
      headStyles: { fillColor: brandColor, textColor: [255, 255, 255] },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: { 0: { cellWidth: 14 }, 1: { cellWidth: 20 }, 4: { cellWidth: 22 } },
      theme: "striped",
    });
  }

  // Disclaimer page
  doc.addPage();
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...brandColor);
  doc.text("Resources & Disclaimer", 20, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textColor);

  const resources = [
    "• NDPR Full Text: https://ndpr.nitda.gov.ng",
    "• Privacy Policy Template: https://ndpr.nitda.gov.ng/resources/privacy-template",
    "• DPCO Directory: https://ndpr.nitda.gov.ng/dpco-directory",
    "• Breach Notification Template: https://ndpr.nitda.gov.ng/resources/breach-template",
    "• Audit Filing Portal: https://ndpr.nitda.gov.ng/audit-filing-portal",
  ];
  resources.forEach((r, i) => doc.text(r, 20, 40 + i * 8));

  doc.setTextColor(...lightGray);
  doc.setFontSize(9);
  const disclaimer = "DISCLAIMER: This report is generated by RegTrack, an AI-powered compliance simulator built by Nexus SafeSphere (NSS). It is intended for educational and informational purposes only and does not constitute legal advice. For formal compliance guidance, consult a licensed Data Protection Compliance Organisation (DPCO). RegTrack is a product of AI Skills Week Abuja Hackathon 2026.";
  const discLines = doc.splitTextToSize(disclaimer, pageW - 40);
  doc.text(discLines, 20, 90);

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...lightGray);
    doc.text(`RegTrack by NSS • ${date} • Page ${i}/${totalPages}`, pageW / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
  }

  const fileName = `RegTrack_Report_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
}
