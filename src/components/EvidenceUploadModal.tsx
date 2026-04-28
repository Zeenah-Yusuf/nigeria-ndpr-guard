import { useState, useRef, useEffect } from "react";
import { X, Upload, FileText, CheckCircle, AlertCircle, Loader2, Trash2, Info, Shield, FileCheck, FileBadge, Receipt, ScrollText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EvidenceData {
  fileName: string;
  fileUrl: string;
  uploadDate: string;
  fileSize: number;
  fileType: string;
}

interface EvidenceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (evidence: EvidenceData) => void;
  itemTitle: string;
  evidenceRequired: string;
  clauseType?: string; // 'obligation', 'penalty', 'definition', 'procedure', 'requirement', etc.
  framework?: string;
  existingEvidence?: EvidenceData;
  onRemove?: () => void;
}

// Document requirements by clause type and framework
const DOCUMENT_REQUIREMENTS: Record<string, {
  label: string;
  description: string;
  acceptedFormats: string[];
  examples: string[];
  icon: React.ElementType;
  maxSize: string;
}> = {
  // Data Protection / Privacy Policy
  privacy_policy: {
    label: "Privacy Policy Document",
    description: "Upload your organization's privacy policy that outlines how personal data is collected, processed, stored, and shared.",
    acceptedFormats: ["PDF", "DOCX"],
    examples: ["Privacy Policy PDF", "Data Protection Policy", "Cookie Policy"],
    icon: ScrollText,
    maxSize: "10MB"
  },
  // DPO Appointment
  dpo_appointment: {
    label: "DPO Appointment Letter",
    description: "Official appointment letter designating your Data Protection Officer, including their qualifications and reporting structure.",
    acceptedFormats: ["PDF", "DOCX"],
    examples: ["DPO Appointment Letter", "DPO Certification", "Board Resolution"],
    icon: FileBadge,
    maxSize: "5MB"
  },
  // Registration Certificate
  registration_certificate: {
    label: "Registration Certificate",
    description: "Official registration certificate from the regulatory body (NDPC, CBN, SEC, or NITDA) confirming your compliance status.",
    acceptedFormats: ["PDF", "JPEG", "PNG"],
    examples: ["NDPC Registration Certificate", "CBN License", "SEC Registration"],
    icon: FileCheck,
    maxSize: "5MB"
  },
  // Audit Report
  audit_report: {
    label: "Compliance Audit Report",
    description: "Annual Compliance Audit Returns (CAR) or independent audit report conducted by a licensed compliance organization.",
    acceptedFormats: ["PDF"],
    examples: ["CAR Filing Confirmation", "DPCO Audit Report", "AML Audit Report"],
    icon: Receipt,
    maxSize: "20MB"
  },
  // Consent Mechanism
  consent_mechanism: {
    label: "Consent Documentation",
    description: "Evidence of consent mechanisms including screenshots of consent forms, cookie banners, or consent management platform configuration.",
    acceptedFormats: ["PDF", "JPEG", "PNG"],
    examples: ["Consent Form Screenshot", "Cookie Banner Screenshot", "Consent Log Export"],
    icon: FileCheck,
    maxSize: "10MB"
  },
  // Security Policy
  security_policy: {
    label: "Security Policy Document",
    description: "Technical and organizational security measures documentation including encryption policies, access controls, and incident response plans.",
    acceptedFormats: ["PDF", "DOCX"],
    examples: ["Information Security Policy", "Encryption Policy", "Access Control Policy"],
    icon: Shield,
    maxSize: "10MB"
  },
  // Breach Notification Process
  breach_process: {
    label: "Breach Response Documentation",
    description: "Documented breach notification procedures including incident response plan, notification templates, and escalation matrix.",
    acceptedFormats: ["PDF", "DOCX"],
    examples: ["Breach Response Plan", "Incident Report Template", "72-Hour Notification Procedure"],
    icon: AlertCircle,
    maxSize: "10MB"
  },
  // KYC/CDD Documentation
  kyc_documentation: {
    label: "KYC/CDD Procedure Document",
    description: "Customer Due Diligence procedures including customer identification, verification processes, and ongoing monitoring protocols.",
    acceptedFormats: ["PDF", "DOCX"],
    examples: ["CDD Policy", "KYC Procedure Manual", "Customer Identification Program"],
    icon: FileCheck,
    maxSize: "10MB"
  },
  // STR Filing
  str_filing: {
    label: "STR Filing Documentation",
    description: "Suspicious Transaction Report filing procedures and evidence of STR submission to NFIU.",
    acceptedFormats: ["PDF"],
    examples: ["STR Filing Procedure", "NFIU Confirmation", "Transaction Monitoring Report"],
    icon: FileBadge,
    maxSize: "5MB"
  },
  // Training Records
  training_records: {
    label: "Training Documentation",
    description: "Staff training records, certificates, attendance sheets, and training materials for compliance-related programs.",
    acceptedFormats: ["PDF", "JPEG", "PNG"],
    examples: ["Training Certificate", "Attendance Sheet", "Training Agenda"],
    icon: FileCheck,
    maxSize: "10MB"
  },
  // Default
  default: {
    label: "Supporting Document",
    description: "Upload relevant documentation to support your compliance claim.",
    acceptedFormats: ["PDF", "JPEG", "PNG", "DOCX"],
    examples: ["Policy Document", "Certificate", "Report"],
    icon: FileText,
    maxSize: "10MB"
  }
};

// Map clause types and keywords to document requirement types
function getDocumentRequirementType(itemTitle: string, evidenceRequired: string, framework: string): string {
  const lowerTitle = (itemTitle + " " + evidenceRequired).toLowerCase();
  
  // NDPA / Data Protection
  if (/privacy policy|data protection policy/i.test(lowerTitle)) return "privacy_policy";
  if (/dpo|data protection officer|appoint.*officer/i.test(lowerTitle)) return "dpo_appointment";
  if (/register|registration|certificate|dcpmi/i.test(lowerTitle)) return "registration_certificate";
  if (/audit|car filing|compliance audit/i.test(lowerTitle)) return "audit_report";
  if (/consent|opt-in|affirmative action/i.test(lowerTitle)) return "consent_mechanism";
  if (/security|encryption|access control|safeguard/i.test(lowerTitle)) return "security_policy";
  if (/breach|incident|notification|72.*hour/i.test(lowerTitle)) return "breach_process";
  if (/training|capacity building|staff.*train/i.test(lowerTitle)) return "training_records";
  
  // CBN AML
  if (/kyc|cdd|customer.*due.*diligence|bvn|nin/i.test(lowerTitle)) return "kyc_documentation";
  if (/str|suspicious.*transaction|nfiu|reporting/i.test(lowerTitle)) return "str_filing";
  if (/pep|politically.*exposed|screening/i.test(lowerTitle)) return "kyc_documentation";
  if (/aml.*compliance.*officer|designate.*officer/i.test(lowerTitle)) return "dpo_appointment";
  if (/record.*keeping|retention|5.*year/i.test(lowerTitle)) return "security_policy";
  
  // SEC
  if (/crowdfunding.*portal|sec.*registration/i.test(lowerTitle)) return "registration_certificate";
  if (/investor.*protection|risk.*disclosure|cooling.*off/i.test(lowerTitle)) return "consent_mechanism";
  if (/capital.*requirement|n100.*million/i.test(lowerTitle)) return "audit_report";
  
  // NITDA
  if (/dpia|impact.*assessment/i.test(lowerTitle)) return "audit_report";
  if (/data.*inventory|processing.*activities/i.test(lowerTitle)) return "security_policy";
  if (/local.*content|nigerian.*content/i.test(lowerTitle)) return "registration_certificate";
  
  return "default";
}

// Framework-specific guidance
function getFrameworkGuidance(framework: string): string {
  const guidance: Record<string, string> = {
    "NDPA": "Documents submitted as evidence should comply with NDP Act 2023 and GAID 2025 requirements. Ensure all documents are dated and signed by authorized personnel.",
    "CBN-AML": "Evidence must align with CBN AML/CFT Regulations 2022. Documents should reference relevant regulatory sections and be signed by the AML Compliance Officer.",
    "CBN-CP": "Consumer protection evidence should demonstrate compliance with CBN Consumer Protection Regulations 2019.",
    "SEC-CF": "SEC requires all evidence to be notarized where applicable. Crowdfunding portal documents must include SEC registration number.",
    "NITDA-DP": "NITDA requires evidence of DPIA completion and data inventory maintenance. Documents should follow NITDA DP Framework templates.",
  };
  return guidance[framework] || "Ensure documents are properly dated, signed, and reference the applicable regulatory framework.";
}

export function EvidenceUploadModal({ 
  isOpen, onClose, onConfirm, itemTitle, evidenceRequired,
  clauseType = "obligation", framework = "NDPA",
  existingEvidence, onRemove
}: EvidenceUploadModalProps) {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showRequirements, setShowRequirements] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const docType = getDocumentRequirementType(itemTitle, evidenceRequired, framework);
  const docRequirements = DOCUMENT_REQUIREMENTS[docType] || DOCUMENT_REQUIREMENTS.default;
  const RequirementsIcon = docRequirements.icon;
  const frameworkGuidance = getFrameworkGuidance(framework);

  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null); setUploading(false); setUploadComplete(false); setError(null); setPreviewUrl(null); setShowRequirements(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateFile = (file: File): boolean => {
    // Check file extension against accepted formats
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    const acceptedExtensions = docRequirements.acceptedFormats.map(f => f.toLowerCase());
    
    if (!acceptedExtensions.includes(extension)) {
      setError(`This clause requires a ${docRequirements.acceptedFormats.join(" or ")} file. "${extension.toUpperCase()}" files are not accepted for this document type.`);
      return false;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError(`File size must be less than ${docRequirements.maxSize}.`);
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      if (file.type.startsWith("image/")) setPreviewUrl(URL.createObjectURL(file));
      else setPreviewUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      if (file.type.startsWith("image/")) setPreviewUrl(URL.createObjectURL(file));
      else setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null); setPreviewUrl(null); setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true); setError(null);
    setTimeout(() => {
      const evidenceData: EvidenceData = {
        fileName: selectedFile.name,
        fileUrl: URL.createObjectURL(selectedFile),
        uploadDate: new Date().toISOString(),
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
      };
      setUploadComplete(true); setUploading(false);
      setTimeout(() => onConfirm(evidenceData), 1000);
    }, 1500);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024; const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFrameworkBadge = (fw: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      "NDPA": { bg: "bg-primary/10", text: "text-primary", label: "NDPC" },
      "CBN-AML": { bg: "bg-accent/10", text: "text-accent", label: "CBN" },
      "CBN-CP": { bg: "bg-accent/10", text: "text-accent", label: "CBN" },
      "SEC-CF": { bg: "bg-purple-500/10", text: "text-purple-500", label: "SEC" },
      "NITDA-DP": { bg: "bg-cyan-500/10", text: "text-cyan-500", label: "NITDA" },
    };
    return badges[fw] || { bg: "bg-muted", text: "text-muted-foreground", label: fw };
  };

  const fwBadge = getFrameworkBadge(framework);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border animate-scale-in max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-card z-10 flex items-center justify-between p-4 border-b border-border rounded-t-2xl">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-heading font-semibold text-foreground">Upload Evidence</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${fwBadge.bg} ${fwBadge.text}`}>
                  {fwBadge.label}
                </span>
                <span className="text-[10px] text-muted-foreground capitalize">{clauseType}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted transition-colors" aria-label="Close">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          
          {/* Item Details */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border">
            <p className="text-sm font-semibold text-foreground mb-1">{itemTitle}</p>
            <p className="text-xs text-muted-foreground">{evidenceRequired}</p>
          </div>

          {/* Document Type Requirements - Expandable */}
          <div className="rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setShowRequirements(!showRequirements)}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <RequirementsIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{docRequirements.label}</p>
                  <p className="text-[10px] text-muted-foreground">
                    Required format: {docRequirements.acceptedFormats.join(", ")} • Max: {docRequirements.maxSize}
                  </p>
                </div>
              </div>
              <span className={`text-xs text-primary transition-transform ${showRequirements ? "rotate-180" : ""}`}>▼</span>
            </button>
            
            {showRequirements && (
              <div className="px-4 pb-4 pt-0 border-t border-border animate-fade-in space-y-3">
                {/* Description */}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-xs text-foreground leading-relaxed">{docRequirements.description}</p>
                </div>
                
                {/* Examples */}
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    📋 Examples of Acceptable Documents:
                  </p>
                  <div className="space-y-1.5">
                    {docRequirements.examples.map((example, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Accepted Formats */}
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    ✅ Accepted File Formats:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {docRequirements.acceptedFormats.map(format => (
                      <span key={format} className="text-[10px] px-2 py-1 rounded-full bg-secondary/10 text-secondary font-medium">
                        .{format.toLowerCase()}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Framework Guidance */}
                <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <span className="font-medium text-foreground">{fwBadge.label} Guidance:</span> {frameworkGuidance}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          {/* Existing Evidence */}
          {existingEvidence && !selectedFile && !uploadComplete && (
            <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">📎 Currently Uploaded</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-secondary" />
                  <div>
                    <p className="text-xs font-medium text-foreground">{existingEvidence.fileName}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Uploaded: {new Date(existingEvidence.uploadDate).toLocaleDateString()} • {formatFileSize(existingEvidence.fileSize)}
                    </p>
                  </div>
                </div>
                {onRemove && (
                  <button onClick={() => { onRemove(); setSelectedFile(null); }} 
                    className="p-2 rounded-lg hover:bg-destructive/10 transition-colors" title="Remove evidence">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Upload Area */}
          {!uploadComplete && !existingEvidence && (
            <div onClick={() => fileInputRef.current?.click()} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                selectedFile ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
              }`}>
              {selectedFile ? (
                <div className="space-y-2">
                  {previewUrl ? <img src={previewUrl} alt="Preview" className="w-20 h-20 mx-auto object-cover rounded-lg" /> : <FileText className="w-10 h-10 mx-auto text-primary" />}
                  <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-[10px] text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                  <div className="flex items-center justify-center gap-1 text-[10px] text-secondary">
                    <CheckCircle className="w-3 h-3" />
                    Valid {docRequirements.label} format
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }} className="text-xs text-destructive hover:underline">Remove</button>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-7 h-7 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">Click or drag to upload</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {docRequirements.acceptedFormats.join(", ")} • Max {docRequirements.maxSize}
                  </p>
                  <p className="text-[10px] text-muted-foreground bg-muted/50 inline-block px-3 py-1 rounded-full">
                    📄 {docRequirements.label}
                  </p>
                </>
              )}
            </div>
          )}
          <input 
            ref={fileInputRef} 
            type="file" 
            id="evidence-file-upload"
            name="evidence-file-upload"
            title="Upload compliance evidence document"
            aria-label="Upload compliance evidence document"
            accept={docRequirements.acceptedFormats.map(f => `.${f.toLowerCase()}`).join(",")} 
            onChange={handleFileSelect} 
            className="hidden" 
          />

          {/* Upload Complete */}
          {uploadComplete && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-secondary/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-secondary" />
              </div>
              <p className="text-sm font-semibold text-foreground">Upload Complete!</p>
              <p className="text-xs text-muted-foreground mt-1">Your {docRequirements.label.toLowerCase()} has been submitted.</p>
            </div>
          )}

          {/* What Happens Next */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <p className="text-[10px] text-muted-foreground flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
              <span>
                This evidence will be stored securely and included in your compliance audit trail. 
                It may be reviewed during {fwBadge.label} compliance verification.
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card z-10 flex gap-2 p-4 border-t border-border rounded-b-2xl">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-colors text-sm font-medium">
            Cancel
          </button>
          {!existingEvidence && selectedFile && !uploadComplete && (
            <button onClick={handleUpload} disabled={uploading}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-40 flex items-center justify-center gap-2">
              {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />Uploading...</> : <><Upload className="w-4 h-4" />Upload & Confirm</>}
            </button>
          )}
          {existingEvidence && !uploadComplete && (
            <button onClick={() => onConfirm(existingEvidence)}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all">
              Keep Existing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}