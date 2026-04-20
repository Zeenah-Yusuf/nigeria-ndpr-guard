import { useState, useRef } from "react";
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
  ChevronRight
} from "lucide-react";

interface ExtractedObligation {
  id: string;
  section: string;
  requirement: string;
  status: "compliant" | "partial" | "non-compliant" | "unknown";
  confidence: number;
  source: string;
}

export function ObligationExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [obligations, setObligations] = useState<ExtractedObligation[]>([]);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      setObligations([]);
      setShowResults(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    setObligations([]);
    setShowResults(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const extractObligations = async () => {
    if (!file) return;
    
    setExtracting(true);
    
    // Simulate AI extraction (replace with actual Supabase Edge Function call)
    setTimeout(() => {
      const mockObligations: ExtractedObligation[] = [
        {
          id: "1",
          section: "Section 24",
          requirement: "Process personal data lawfully, fairly, and transparently",
          status: "partial",
          confidence: 87,
          source: "NDP Act 2023, Part IV"
        },
        {
          id: "2",
          section: "Section 26",
          requirement: "Obtain explicit consent before collecting personal data",
          status: "non-compliant",
          confidence: 94,
          source: "NDP Act 2023, Part IV"
        },
        {
          id: "3",
          section: "Section 27",
          requirement: "Provide transparent information about data processing",
          status: "partial",
          confidence: 82,
          source: "NDP Act 2023, Part IV"
        },
        {
          id: "4",
          section: "Section 30",
          requirement: "Implement safeguards for sensitive personal data",
          status: "unknown",
          confidence: 71,
          source: "NDP Act 2023, Part VI"
        },
        {
          id: "5",
          section: "Section 32",
          requirement: "Appoint a Data Protection Officer (if DCPMI)",
          status: "non-compliant",
          confidence: 91,
          source: "NDP Act 2023, Part VII"
        },
        {
          id: "6",
          section: "Section 40",
          requirement: "Report data breaches to NDPC within 72 hours",
          status: "compliant",
          confidence: 88,
          source: "NDP Act 2023, Part IX"
        },
      ];
      
      setObligations(mockObligations);
      setExtracting(false);
      setShowResults(true);
    }, 2500);
  };

  const getStatusBadge = (status: ExtractedObligation["status"]) => {
    const badges = {
      compliant: { label: "Compliant", bg: "bg-secondary/10", text: "text-secondary", border: "border-secondary/30" },
      partial: { label: "Partial", bg: "bg-accent/10", text: "text-accent", border: "border-accent/30" },
      "non-compliant": { label: "Non-Compliant", bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/30" },
      unknown: { label: "Review Needed", bg: "bg-muted", text: "text-muted-foreground", border: "border-border" },
    };
    return badges[status];
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "text-secondary";
    if (confidence >= 70) return "text-accent";
    return "text-muted-foreground";
  };

  const stats = {
    total: obligations.length,
    compliant: obligations.filter(o => o.status === "compliant").length,
    partial: obligations.filter(o => o.status === "partial").length,
    nonCompliant: obligations.filter(o => o.status === "non-compliant").length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">AI Obligation Extractor</h3>
          <p className="text-xs text-muted-foreground">
            Upload any policy document — AI extracts NDP Act obligations automatically
          </p>
        </div>
      </div>

      {/* Upload Area */}
      {!showResults && (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer ${
            isDragging
              ? "border-primary bg-primary/5"
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
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            
            {file ? (
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-primary" />
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
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {extracting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing Document...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              Extract Obligations
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
            
            {obligations.map((obligation) => {
              const statusBadge = getStatusBadge(obligation.status);
              return (
                <div
                  key={obligation.id}
                  className={`bg-card border rounded-xl p-4 transition-all hover:shadow-card ${statusBadge.border}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {obligation.section}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusBadge.bg} ${statusBadge.text}`}>
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
                    <button className="text-[10px] text-primary flex items-center gap-1 hover:underline">
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
              onClick={() => {
                // Mock download
                alert("In production, this downloads a machine-readable OSCAL compliance report.");
              }}
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