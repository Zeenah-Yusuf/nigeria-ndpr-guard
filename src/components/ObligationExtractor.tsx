import { useState, useRef, useCallback, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  X,
  Download,
  Eye,
  Shield,
  Clock,
  ChevronRight,
  AlertTriangle,
  Building2
} from "lucide-react";

interface ExtractedObligation {
  id: string;
  section: string;
  requirement: string;
  status: "compliant" | "partial" | "non-compliant" | "unknown";
  confidence: number;
  source: string;
  framework: "ndpa" | "cbn";
}

interface ObligationExtractorProps {
  framework?: "ndpa" | "cbn";
}

export function ObligationExtractor({ framework = "ndpa" }: ObligationExtractorProps) {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [obligations, setObligations] = useState<ExtractedObligation[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const frameworkName = framework === "cbn" ? "CBN AML" : "NDP Act";
  const frameworkColor = framework === "cbn" ? "accent" : "primary";

  const handleFileChange = useCallback((selectedFile: File | null) => {
    if (selectedFile) {
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit");
        return;
      }
      
      // Validate file type
      const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.txt')) {
        setError("Invalid file type. Please upload PDF, DOCX, or TXT files");
        return;
      }
      
      setFile(selectedFile);
      setObligations([]);
      setShowResults(false);
      setError(null);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  }, [handleFileChange]);

  const clearFile = useCallback(() => {
    setFile(null);
    setObligations([]);
    setShowResults(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // Get framework-specific mock obligations
  const getMockObligations = useCallback((): ExtractedObligation[] => {
    if (framework === "cbn") {
      return [
        {
          id: "cbn-1",
          section: "Section 6",
          requirement: "Implement Customer Due Diligence (CDD) for all customers",
          status: "partial",
          confidence: 85,
          source: "CBN AML/CFT Framework 2022",
          framework: "cbn"
        },
        {
          id: "cbn-2",
          section: "Section 7.1",
          requirement: "Monitor transactions for suspicious activities in real-time",
          status: "non-compliant",
          confidence: 92,
          source: "CBN AML/CFT Framework 2022",
          framework: "cbn"
        },
        {
          id: "cbn-3",
          section: "Section 8.3",
          requirement: "File Suspicious Transaction Reports within 24 hours",
          status: "non-compliant",
          confidence: 88,
          source: "CBN AML/CFT Framework 2022",
          framework: "cbn"
        },
        {
          id: "cbn-4",
          section: "Section 12.1",
          requirement: "Provide annual AML/CFT training to all employees",
          status: "partial",
          confidence: 76,
          source: "CBN AML/CFT Framework 2022",
          framework: "cbn"
        },
        {
          id: "cbn-5",
          section: "Section 19",
          requirement: "Designate an AML/CFT Compliance Officer",
          status: "compliant",
          confidence: 94,
          source: "CBN AML/CFT Framework 2022",
          framework: "cbn"
        },
        {
          id: "cbn-6",
          section: "Section 15.1",
          requirement: "Retain transaction records for at least 5 years",
          status: "compliant",
          confidence: 90,
          source: "CBN AML/CFT Framework 2022",
          framework: "cbn"
        },
      ];
    } else {
      return [
        {
          id: "1",
          section: "Section 24",
          requirement: "Process personal data lawfully, fairly, and transparently",
          status: "partial",
          confidence: 87,
          source: "NDP Act 2023, Part IV",
          framework: "ndpa"
        },
        {
          id: "2",
          section: "Section 26",
          requirement: "Obtain explicit consent before collecting personal data",
          status: "non-compliant",
          confidence: 94,
          source: "NDP Act 2023, Part IV",
          framework: "ndpa"
        },
        {
          id: "3",
          section: "Section 27",
          requirement: "Provide transparent information about data processing",
          status: "partial",
          confidence: 82,
          source: "NDP Act 2023, Part IV",
          framework: "ndpa"
        },
        {
          id: "4",
          section: "Section 30",
          requirement: "Implement safeguards for sensitive personal data",
          status: "unknown",
          confidence: 71,
          source: "NDP Act 2023, Part VI",
          framework: "ndpa"
        },
        {
          id: "5",
          section: "Section 32",
          requirement: "Appoint a Data Protection Officer (if DCPMI)",
          status: "non-compliant",
          confidence: 91,
          source: "NDP Act 2023, Part VII",
          framework: "ndpa"
        },
        {
          id: "6",
          section: "Section 40",
          requirement: "Report data breaches to NDPC within 72 hours",
          status: "compliant",
          confidence: 88,
          source: "NDP Act 2023, Part IX",
          framework: "ndpa"
        },
      ];
    }
  }, [framework]);

  const extractObligations = useCallback(async () => {
    if (!file) return;
    
    setExtracting(true);
    setError(null);
    
    // Simulate AI extraction (replace with actual API call)
    setTimeout(() => {
      const mockObligations = getMockObligations();
      setObligations(mockObligations);
      setExtracting(false);
      setShowResults(true);
    }, 2500);
  }, [file, getMockObligations]);

  const getStatusBadge = useCallback((status: ExtractedObligation["status"]) => {
    const badges = {
      compliant: { label: "Compliant", bg: "bg-secondary/10", text: "text-secondary", border: "border-secondary/30", icon: CheckCircle },
      partial: { label: "Partial", bg: "bg-accent/10", text: "text-accent", border: "border-accent/30", icon: AlertCircle },
      "non-compliant": { label: "Non-Compliant", bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/30", icon: AlertTriangle },
      unknown: { label: "Review Needed", bg: "bg-muted", text: "text-muted-foreground", border: "border-border", icon: Clock },
    };
    return badges[status];
  }, []);

  const getConfidenceColor = useCallback((confidence: number) => {
    if (confidence >= 85) return "text-secondary";
    if (confidence >= 70) return "text-accent";
    return "text-muted-foreground";
  }, []);

  const stats = useMemo(() => ({
    total: obligations.length,
    compliant: obligations.filter(o => o.status === "compliant").length,
    partial: obligations.filter(o => o.status === "partial").length,
    nonCompliant: obligations.filter(o => o.status === "non-compliant").length,
    unknown: obligations.filter(o => o.status === "unknown").length,
  }), [obligations]);

  const handleExportReport = useCallback(() => {
    // Generate and download report
    const reportData = {
      framework: frameworkName,
      extractedDate: new Date().toISOString(),
      file: file?.name,
      stats,
      obligations: obligations.map(o => ({
        section: o.section,
        requirement: o.requirement,
        status: o.status,
        confidence: `${o.confidence}%`,
        source: o.source
      }))
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compliance_report_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [frameworkName, file, stats, obligations]);

  return (
    <div className="space-y-4">
      {/* Framework Indicator */}
      <div className={`text-xs font-medium px-3 py-1.5 rounded-full inline-flex items-center gap-2 ${
        framework === "cbn" 
          ? "bg-accent/10 text-accent" 
          : "bg-primary/10 text-primary"
      }`}>
        <Building2 className="w-3.5 h-3.5" />
        <span>Extracting from: {frameworkName} Framework</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg bg-${frameworkColor}/10 flex items-center justify-center`}>
          <FileText className={`w-4 h-4 text-${frameworkColor}`} />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">AI Obligation Extractor</h3>
          <p className="text-xs text-muted-foreground">
            Upload any policy document — AI extracts {frameworkName} obligations automatically
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Upload Area */}
      {!showResults && (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer ${
            isDragging
              ? `border-${frameworkColor} bg-${frameworkColor}/5`
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="hidden"
          />
          
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${frameworkColor}/10 flex items-center justify-center`}>
              <Upload className={`w-8 h-8 text-${frameworkColor}`} />
            </div>
            
            {file ? (
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FileText className={`w-5 h-5 text-${frameworkColor}`} />
                  <span className="font-medium text-foreground">{file.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="p-1 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB • Ready to extract
                </p>
              </div>
            ) : (
              <>
                <p className="font-medium text-foreground mb-1">
                  Drag & drop your policy document
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports PDF, DOCX, TXT (Max 10MB)
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Extract Button */}
      {file && !showResults && (
        <button
          onClick={extractObligations}
          disabled={extracting}
          className={`w-full py-3 rounded-xl bg-${frameworkColor} text-${frameworkColor}-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
        >
          {extracting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing Document...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              Extract {frameworkName} Obligations
            </>
          )}
        </button>
      )}

      {/* Results */}
      {showResults && (
        <div className="space-y-4 animate-fade-in">
          {/* Stats Summary */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-foreground">{stats.total}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</p>
            </div>
            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-secondary">{stats.compliant}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Compliant</p>
            </div>
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-accent">{stats.partial}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Partial</p>
            </div>
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-destructive">{stats.nonCompliant}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Non-Compliant</p>
            </div>
          </div>

          {/* Obligations List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Extracted Obligations ({obligations.length})
            </p>
            
            {obligations.map((obligation, index) => {
              const statusBadge = getStatusBadge(obligation.status);
              const StatusIcon = statusBadge.icon;
              
              return (
                <div
                  key={obligation.id}
                  className={`bg-card border rounded-xl p-4 transition-all hover:shadow-card animate-fade-in-up ${statusBadge.border}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-semibold bg-${frameworkColor}/10 text-${frameworkColor} px-2 py-0.5 rounded-full`}>
                        {obligation.section}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusBadge.bg} ${statusBadge.text} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusBadge.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className={`w-3 h-3 ${getConfidenceColor(obligation.confidence)}`} />
                      <span className={`text-xs font-medium ${getConfidenceColor(obligation.confidence)}`}>
                        {obligation.confidence}%
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-foreground mb-2">{obligation.requirement}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {obligation.source}
                    </span>
                    <button 
                      className="text-[10px] text-primary flex items-center gap-1 hover:underline transition-colors"
                      onClick={() => {
                        // In production, this would scroll to or show the clause
                        alert(`Navigate to ${obligation.section} of ${frameworkName}`);
                      }}
                    >
                      <Eye className="w-3 h-3" />
                      View Clause
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={clearFile}
              className="flex-1 py-2.5 rounded-xl border border-border hover:bg-muted/60 transition-colors text-sm"
            >
              Upload Another Document
            </button>
            <button
              onClick={handleExportReport}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>

          {/* Demo Notice */}
          <div className="flex items-center justify-center gap-1 pt-2">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground">
              Demo: In production, this uses Azure OpenAI to extract obligations from any uploaded document.
            </p>
          </div>
        </div>
      )}

      {/* New Document Button (when results shown but user wants to upload new) */}
      {showResults && (
        <button
          onClick={clearFile}
          className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Upload a different document
        </button>
      )}
    </div>
  );
}