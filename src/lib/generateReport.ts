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
  triggeredClauses: any[];
  remediationItems: RemediationItem[];
  checkedItems: Record<string, boolean>;
  sector?: string;
  framework?: "ndpa" | "cbn";
}

export function generateReportPDF(data: ReportData) {
  const doc = new jsPDF();
  const brandColor: [number, number, number] = data.framework === "cbn" ? [0, 51, 102] : [15, 118, 110];
  const textColor: [number, number, number] = [30, 41, 59];
  const lightGray: [number, number, number] = [148, 163, 184];
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const date = new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" });
  
  const frameworkName = data.framework === "cbn" ? "CBN AML 2022" : "NDP Act 2023 with GAID 2025";
  const regulatoryBody = data.framework === "cbn" ? "Central Bank of Nigeria (CBN)" : "Nigeria Data Protection Commission (NDPC)";

  // ==================== COVER PAGE ====================
  doc.setFillColor(...brandColor);
  doc.rect(0, 0, pageW, 60, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("RegTrack", 20, 30);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`${frameworkName} Compliance Report`, 20, 42);
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

  // ==================== EXECUTIVE SUMMARY ====================
  doc.addPage();
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...brandColor);
  doc.text("Executive Summary", 20, 25);

  const completedItems = data.remediationItems.filter(item => data.checkedItems[item.id]);
  const completedCount = completedItems.length;
  const totalItems = data.remediationItems.length;
  const pendingCount = totalItems - completedCount;

  // Compliance status based on risk score
  let complianceStatus = "";
  if (data.riskScore <= 25) {
    complianceStatus = `Based on your risk score of ${data.riskScore}/100, "${data.appName}" demonstrates strong compliance with ${data.sector ? data.sector : 'applicable'} regulations under ${frameworkName}.`;
  } else if (data.riskScore <= 50) {
    complianceStatus = `Your risk score of ${data.riskScore}/100 indicates moderate compliance gaps under ${frameworkName}.`;
  } else {
    complianceStatus = `Your risk score of ${data.riskScore}/100 indicates significant compliance gaps under ${frameworkName}.`;
  }

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const statusLines = doc.splitTextToSize(complianceStatus, pageW - 40);
  doc.text(statusLines, 20, 40);

  // Implementation summary
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...brandColor);
  doc.text(`Implementation Progress: ${completedCount} of ${totalItems} Controls Completed`, 20, 70);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textColor);
  
  // Progress bar
  const progressWidth = (pageW - 40) * (completedCount / totalItems);
  doc.setFillColor(200, 200, 200);
  doc.rect(20, 78, pageW - 40, 8, "F");
  doc.setFillColor(...brandColor);
  doc.rect(20, 78, progressWidth, 8, "F");

  doc.text(`✓ Completed: ${completedCount}`, 20, 100);
  doc.text(`○ Pending: ${pendingCount}`, 20, 112);

  // Recommendation
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...brandColor);
  doc.text("Recommendation", 20, 130);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textColor);

  let recommendation = "";
  if (data.riskScore <= 25) {
    recommendation = `Continue monitoring your compliance posture and stay updated with regulatory changes. Schedule your next ${frameworkName} review in 6 months.`;
  } else if (data.riskScore <= 50) {
    recommendation = `Address the remaining ${pendingCount} ${pendingCount === 1 ? 'item' : 'items'} before launch to reduce regulatory exposure.`;
  } else {
    recommendation = `Complete all critical and high-priority items before launching your product to avoid potential penalties under ${frameworkName}.`;
  }

  const recLines = doc.splitTextToSize(recommendation, pageW - 40);
  doc.text(recLines, 20, 145);

  // ==================== QUESTIONS & ANSWERS ====================
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

  // ==================== TRIGGERED SECTIONS ====================
  doc.addPage();
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...brandColor);
  doc.text(`Triggered ${data.framework === "cbn" ? "CBN AML" : "NDP Act"} Sections`, 20, 25);

  if (data.triggeredClauses.length > 0) {
    const clauseRows = data.triggeredClauses.map(c => [
      c.id || c.article_ref || c.clause_id || "N/A",
      c.title || c.name || "Regulatory Requirement",
      (c.summary || c.description || "").substring(0, 120) + ((c.summary || c.description || "").length > 120 ? "…" : ""),
      data.framework === "cbn" ? "CBN enforcement actions may apply" : (c.penalty_info || "NDPC enforcement actions may apply"),
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["Reference", "Title", "Summary", "Penalty"]],
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
    doc.text(`No ${data.framework === "cbn" ? "CBN AML" : "NDP Act"} sections were triggered. Your practices appear compliant.`, 20, 40);
  }

  // ==================== REMEDIATION CHECKLIST ====================
  if (data.remediationItems.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...brandColor);
    doc.text("Remediation Checklist", 20, 25);

    // Summary of completed vs pending
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    doc.text(`You have completed ${completedCount} of ${totalItems} recommended remediation items.`, 20, 40);
    
    let currentY = 55;
    
    // Completed items list
    if (completedItems.length > 0) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 128, 0);
      doc.text("✓ Completed Items:", 20, currentY);
      currentY += 7;
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...textColor);
      
      completedItems.forEach((item, idx) => {
        // Check if we need a new page
        if (currentY > pageH - 40) {
          doc.addPage();
          currentY = 25;
        }
        const itemText = `${idx + 1}. ${item.title} (${item.priority.toUpperCase()} priority)`;
        doc.text(itemText, 25, currentY);
        currentY += 6;
      });
      currentY += 5;
    }

    // Pending items list
    const pendingItems = data.remediationItems.filter(item => !data.checkedItems[item.id]);
    if (pendingItems.length > 0) {
      // Check if we need a new page
      if (currentY > pageH - 60) {
        doc.addPage();
        currentY = 25;
      }
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 165, 0);
      doc.text("○ Pending Items:", 20, currentY);
      currentY += 7;
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...textColor);
      
      pendingItems.forEach((item, idx) => {
        // Check if we need a new page
        if (currentY > pageH - 40) {
          doc.addPage();
          currentY = 25;
        }
        const itemText = `${idx + 1}. ${item.title} (${item.priority.toUpperCase()} priority, ${item.difficulty}, ${item.timeEstimate})`;
        doc.text(itemText, 25, currentY);
        currentY += 6;
      });
    }

    // Detailed remediation table
    doc.addPage();
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...brandColor);
    doc.text("Detailed Remediation Items", 20, 25);

    const remRows = data.remediationItems.map(item => [
      data.checkedItems[item.id] ? "✓" : "☐",
      item.priority.toUpperCase(),
      item.title,
      item.description.substring(0, 80) + (item.description.length > 80 ? "…" : ""),
      item.difficulty,
      item.timeEstimate,
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["Status", "Priority", "Action", "Description", "Difficulty", "Est. Time"]],
      body: remRows,
      headStyles: { fillColor: brandColor, textColor: [255, 255, 255] },
      styles: { fontSize: 7, cellPadding: 3 },
      columnStyles: { 
        0: { cellWidth: 12 }, 
        1: { cellWidth: 16 },
        4: { cellWidth: 18 },
        5: { cellWidth: 20 }
      },
      theme: "striped",
    });
  }

  // ==================== RESOURCES PAGE ====================
  doc.addPage();
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...brandColor);
  doc.text("Resources & Further Reading", 20, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textColor);
  doc.text(`Official ${regulatoryBody} Resources:`, 20, 40);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  const resources = data.framework === "cbn" 
    ? [
        "• CBN Official Website: https://www.cbn.gov.ng",
        "• CBN AML/CFT Framework: https://www.cbn.gov.ng/aml-framework",
        "• NFIU STR Filing Portal: https://nfiu.gov.ng",
        "• BVN Integration Guidelines: https://nibss-plc.com.ng/bvn",
        "• CBN Fintech Framework: https://www.cbn.gov.ng/fintech",
        "• KYC Guidelines: https://www.cbn.gov.ng/kyc-guidelines",
        "• AML Training Modules: https://www.cbn.gov.ng/aml-training",
        "• Record Retention Guidelines: https://www.cbn.gov.ng/record-keeping",
      ]
    : [
        "• NDPC Official Site: https://ndpc.gov.ng",
        "• Privacy Policy Template: https://ndpc.gov.ng/our-data-privacy-policy/",
        "• DPCO Directory: https://ndpc.gov.ng/dpco-directory",
        "• Breach Notification Template: https://ndpc.gov.ng/resources/data-breach-response-template",
        "• Audit Filing Portal: https://ndpc.gov.ng/audit-filing-portal",
        "• Whitelist Countries: https://ndpc.gov.ng/resources/whitelist-countries",
        "• Security Standards: https://ndpc.gov.ng/guidelines/security-and-data-protection-standards",
        "• Consent Best Practices: https://ndpc.gov.ng/guidelines/consent-management-best-practices",
      ];

  let yPos = 50;
  resources.forEach((r) => {
    if (yPos > pageH - 30) {
      doc.addPage();
      yPos = 25;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...brandColor);
      doc.text("Resources & Further Reading (continued)", 20, yPos);
      yPos += 10;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...textColor);
    }
    doc.text(r, 20, yPos);
    yPos += 7;
  });

  // ==================== DISCLAIMER PAGE ====================
  doc.addPage();
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...brandColor);
  doc.text("Disclaimer", 20, 25);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...lightGray);
  
  const disclaimer = `DISCLAIMER: This report is generated by RegTrack, an AI-powered compliance simulator built by Nexus SafeSphere (NSS) in Abuja. It is intended for educational and informational purposes only and does not constitute legal advice. This tool references ${frameworkName}. For formal compliance guidance, consult ${data.framework === "cbn" ? "a qualified legal professional or the Central Bank of Nigeria (CBN)" : "a licensed Data Protection Compliance Organisation (DPCO) or the Nigeria Data Protection Commission (NDPC)"}.`;
  
  const discLines = doc.splitTextToSize(disclaimer, pageW - 40);
  doc.text(discLines, 20, 45);

  doc.setFontSize(8);
  doc.setTextColor(...lightGray);
  const footerNote = `RegTrack is not affiliated with ${data.framework === "cbn" ? "CBN or NFIU" : "NDPC"}. Always verify compliance requirements with official sources.`;
  doc.text(footerNote, 20, 110);

  // ==================== FOOTERS ON ALL PAGES ====================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...lightGray);
    doc.text(`RegTrack by NSS • ${date} • ${frameworkName} • Page ${i}/${totalPages}`, pageW / 2, pageH - 10, { align: "center" });
  }

  const fileName = `RegTrack_${data.framework === "cbn" ? "CBN_AML" : "NDPA"}_Report_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
}

// ==================== PLAIN TEXT REPORT GENERATOR ====================
export function generateTextReport(data: ReportData): string {
  const { appName, riskScore, riskLevel, explanation, questions, triggeredClauses, remediationItems, checkedItems, sector, framework = "ndpa" } = data;
  
  const completedItems = remediationItems.filter(item => checkedItems[item.id]);
  const completedCount = completedItems.length;
  const totalItems = remediationItems.length;
  const frameworkName = framework === "cbn" ? "CBN AML 2022" : "NDP Act 2023 with GAID 2025";
  const regulatoryBody = framework === "cbn" ? "Central Bank of Nigeria (CBN)" : "Nigeria Data Protection Commission (NDPC)";
  
  // Determine compliance status message
  let complianceStatus = "";
  
  if (riskScore <= 25) {
    complianceStatus = `
COMPLIANCE STATUS: READY FOR LAUNCH
=====================================
Based on your risk score of ${riskScore}/100, "${appName}" demonstrates strong compliance with ${sector ? sector : 'applicable'} regulations under ${frameworkName}.

You have successfully implemented ${completedCount} of ${totalItems} recommended controls. Your ${framework === "cbn" ? "AML/CFT" : "data protection"} practices align with regulatory requirements.

RECOMMENDATION:
Continue monitoring your compliance posture and stay updated with regulatory changes. Schedule your next compliance review in 6 months.
`;
  } else if (riskScore <= 50) {
    complianceStatus = `
COMPLIANCE STATUS: PROCEED WITH CAUTION
=======================================
Your risk score of ${riskScore}/100 indicates moderate compliance gaps under ${frameworkName}. You have completed ${completedCount} of ${totalItems} recommended controls.

RECOMMENDATION:
Address the remaining ${totalItems - completedCount} ${totalItems - completedCount === 1 ? 'item' : 'items'} before launch to reduce regulatory exposure.
`;
  } else {
    complianceStatus = `
COMPLIANCE STATUS: REMEDIATION REQUIRED
=======================================
Your risk score of ${riskScore}/100 indicates significant compliance gaps under ${frameworkName}. You have completed only ${completedCount} of ${totalItems} recommended controls.

RECOMMENDATION:
Complete all critical and high-priority items before launching your product to avoid potential penalties ${framework === "cbn" ? "under CBN AML regulations" : "up to ₦10,000,000 under the NDP Act"}.
`;
  }

  // Generate completed items list
  const completedItemsList = completedItems.length > 0
    ? completedItems.map(item => `✅ ${item.title}: ${item.description}`).join('\n')
    : 'No items marked as completed yet.';

  // Generate pending items list
  const pendingItems = remediationItems.filter(item => !checkedItems[item.id]);
  const pendingItemsList = pendingItems.length > 0
    ? pendingItems.map(item => `⏳ ${item.title} (${item.priority} priority, ${item.difficulty}, ${item.timeEstimate})`).join('\n')
    : 'All recommended controls have been implemented!';

  const reportContent = `
================================================================================
                    RegTrack Compliance Assessment Report
================================================================================

Application: ${appName || 'Unnamed'}
Sector: ${sector || 'Not specified'}
Assessment Date: ${new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
Framework: ${frameworkName}
Regulatory Body: ${regulatoryBody}

================================================================================
                              EXECUTIVE SUMMARY
================================================================================

Risk Score: ${riskScore}/100
Risk Level: ${riskLevel.toUpperCase()}

${explanation}

================================================================================
${complianceStatus}
================================================================================

IMPLEMENTED CONTROLS (${completedCount} of ${totalItems})
---------------------------------------------------------
${completedItemsList}

PENDING CONTROLS (${totalItems - completedCount} remaining)
---------------------------------------------------------
${pendingItemsList}

================================================================================
                            ASSESSMENT DETAILS
================================================================================

${questions.map((q, i) => 
  `${i + 1}. ${q.question}\n   Answer: ${q.answer ? 'Yes' : 'No'}`
).join('\n\n')}

================================================================================
                    TRIGGERED ${framework === "cbn" ? "CBN AML" : "REGULATORY"} SECTIONS
================================================================================

${triggeredClauses.length > 0 
  ? triggeredClauses.map(c => `• ${c.id || c.article_ref || c.clause_id || 'N/A'}: ${c.title || c.name || 'Regulatory Requirement'}`).join('\n')
  : `• No specific ${framework === "cbn" ? "CBN AML" : "NDP Act"} sections triggered - your practices appear compliant`}

================================================================================
                                 DISCLAIMER
================================================================================

This report provides educational guidance only and does not constitute legal advice.
Always consult ${framework === "cbn" ? "a qualified legal professional" : "a licensed Data Protection Compliance Organisation (DPCO)"} for specific compliance matters.

For official guidance, visit: ${framework === "cbn" ? "https://www.cbn.gov.ng" : "https://ndpc.gov.ng"}

================================================================================
RegTrack — Bridging Nigerian innovation and regulation
Built for Naija 🇳🇬 | Nexus SafeSphere
RegTech Hackathon — AI Skills Week Abuja 2026
Framework Version: ${frameworkName}
================================================================================
`;

  return reportContent;
}

// ==================== COMBINED EXPORT FUNCTION ====================
export function generateReport(data: ReportData) {
  generateReportPDF(data);
  return generateTextReport(data);
}