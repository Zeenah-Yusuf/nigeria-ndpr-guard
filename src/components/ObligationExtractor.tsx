import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/SupabaseClient";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, X, Download, AlertTriangle, Building2, Search } from "lucide-react";

interface ExtractedObligation {
  id: string;
  section: string;
  requirement: string;
  status: "compliant" | "partial" | "non-compliant" | "unknown";
  confidence: number;
  source: string;
  framework: string;
}

// FIXED: Aligned prop interface key with DemoSection.tsx mapping
interface ObligationExtractorProps {
  activeFramework?: string;
}

export function ObligationExtractor({ activeFramework = "NDPA" }: ObligationExtractorProps) {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [obligations, setObligations] = useState<ExtractedObligation[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noObligationsFound, setNoObligationsFound] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // FIXED: Adjusted string dependencies to use activeFramework smoothly
  const frameworkDisplayName = useMemo(() => {
    return activeFramework === "CBN-AML" 
      ? "CBN AML/CFT" 
      : activeFramework === "SEC-CF" 
      ? "SEC Crowdfunding" 
      : activeFramework === "NITDA-DP" 
      ? "NITDA DP" 
      : "NDP Act";
  }, [activeFramework]);

  // FIXED: Auto-flush temporary state assets whenever user switches tabs
  useEffect(() => {
    setFile(null);
    setObligations([]);
    setShowResults(false);
    setError(null);
    setNoObligationsFound(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [activeFramework]);

  const handleFileChange = useCallback((selectedFile: File | null) => {
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) { setError("File size exceeds 10MB limit"); return; }
      const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.txt')) { 
        setError("Invalid file type. Please upload PDF, DOCX, or TXT files"); return; 
      }
      setFile(selectedFile); setObligations([]); setShowResults(false); setError(null); setNoObligationsFound(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const droppedFile = e.dataTransfer.files[0]; if (droppedFile) handleFileChange(droppedFile); }, [handleFileChange]);

  const clearFile = useCallback(() => {
    setFile(null); setObligations([]); setShowResults(false); setError(null); setNoObligationsFound(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || "");
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  const extractObligationsFromText = useCallback((text: string): ExtractedObligation[] => {
    const foundObligations: ExtractedObligation[] = [];
    
    const patterns: Record<string, { regex: RegExp; sectionPrefix: string }[]> = {
      "NDPA": [
        { regex: /Section\s+(\d+[A-Z]?)[.:\s]+([^.!?]+[.!?])/gi, sectionPrefix: "Section" },
        { regex: /(?:shall|must|required to|obligation to|duty to)\s+([^.!?]+[.!?])/gi, sectionPrefix: "General" },
      ],
      "CBN-AML": [
        { regex: /Section\s+(\d+\.?\d*)[.:\s]+([^.!?]+[.!?])/gi, sectionPrefix: "Section" },
        { regex: /Regulation\s+(\d+)[.:\s]+([^.!?]+[.!?])/gi, sectionPrefix: "Regulation" },
        { regex: /(?:shall|must|required to|CDD|KYC|AML|CFT|STR|PEP)\s+([^.!?]+[.!?])/gi, sectionPrefix: "CBN" },
      ],
      "SEC-CF": [
        { regex: /Rule\s+(\d+\.?\d*)[.:\s]+([^.!?]+[.!?])/gi, sectionPrefix: "Rule" },
        { regex: /(?:shall|must|required to|crowdfunding|portal|investor)\s+([^.!?]+[.!?])/gi, sectionPrefix: "SEC" },
      ],
      "NITDA-DP": [
        { regex: /Article\s+(\d+\.?\d*)[.:\s]+([^.!?]+[.!?])/gi, sectionPrefix: "Article" },
        { regex: /(?:shall|must|required to|data protection|DPIA|DPO)\s+([^.!?]+[.!?])/gi, sectionPrefix: "NITDA" },
      ],
    };

    const frameworkPatterns = patterns[activeFramework] || patterns["NDPA"];
    const seenRequirements = new Set<string>();

    for (const pattern of frameworkPatterns) {
      const matches = text.matchAll(pattern.regex);
      for (const match of matches) {
        const sectionNum = match[1] || "";
        const requirementText = (match[2] || match[1] || "").trim();
        
        if (requirementText.length < 20 || requirementText.length > 500) continue;
        if (seenRequirements.has(requirementText.substring(0, 50))) continue;
        
        seenRequirements.add(requirementText.substring(0, 50));

        const lowerText = requirementText.toLowerCase();
        let status: ExtractedObligation["status"] = "unknown";
        if (/comply|compliant|implemented|in place|established|appointed/i.test(lowerText)) {
          status = "compliant";
        } else if (/partially|somewhat|in progress|developing/i.test(lowerText)) {
          status = "partial";
        } else if (/must|shall|required|obligation|mandatory/i.test(lowerText)) {
          status = "non-compliant";
        }

        let confidence = 65;
        if (sectionNum && sectionNum.length <= 5) confidence += 15;
        if (requirementText.length > 50) confidence += 10;
        if (/shall|must|required/i.test(requirementText)) confidence += 10;
        confidence = Math.min(98, confidence);

        foundObligations.push({
          id: `${activeFramework.toLowerCase()}-${foundObligations.length + 1}`,
          section: sectionNum ? `${pattern.sectionPrefix} ${sectionNum}` : pattern.sectionPrefix,
          requirement: requirementText.charAt(0).toUpperCase() + requirementText.slice(1),
          status,
          confidence,
          source: frameworkDisplayName,
          framework: activeFramework,
        });
      }
    }

    return foundObligations.slice(0, 15);
  }, [activeFramework, frameworkDisplayName]);

  const extractObligations = useCallback(async () => {
    if (!file) return;
    
    setExtracting(true);
    setError(null);
    setNoObligationsFound(false);

    try {
      const fileContent = await readFileContent(file);
      
      try {
        const { data, error: fnError } = await supabase.functions.invoke('parse-document', {
          body: {
            documentText: fileContent.substring(0, 10000),
            regulatorId: activeFramework,
            frameworkName: activeFramework,
            autoClassify: true,
            generateEmbeddings: false,
          },
        });

        if (!fnError && data?.clausesExtracted > 0) {
          setObligations(data.clauses || []);
          setShowResults(true);
          setExtracting(false);
          return;
        }
      } catch (fnError) {
        console.log("Edge function unavailable, using local extraction:", fnError);
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      const extractedObligations = extractObligationsFromText(fileContent);
      
      if (extractedObligations.length === 0) {
        setNoObligationsFound(true);
        setObligations([]);
      } else {
        setObligations(extractedObligations);
      }
      
      setShowResults(true);
    } catch (err) {
      console.error("Extraction error:", err);
      setError("Failed to extract obligations. Please try again with a different file.");
    } finally {
      setExtracting(false);
    }
  }, [file, activeFramework, extractObligationsFromText]);

  const getStatusBadge = useCallback((status: ExtractedObligation["status"]) => {
    const badges = {
      compliant: { label: "Compliant", bg: "bg-secondary/10", text: "text-secondary", icon: CheckCircle },
      partial: { label: "Partial", bg: "bg-accent/10", text: "text-accent", icon: AlertCircle },
      "non-compliant": { label: "Non-Compliant", bg: "bg-destructive/10", text: "text-destructive", icon: AlertTriangle },
      unknown: { label: "Review", bg: "bg-muted", text: "text-muted-foreground", icon: AlertCircle },
    };
    return badges[status];
  }, []);

  const stats = useMemo(() => ({
    total: obligations.length,
    compliant: obligations.filter(o => o.status === "compliant").length,
    partial: obligations.filter(o => o.status === "partial").length,
    nonCompliant: obligations.filter(o => o.status === "non-compliant").length,
  }), [obligations]);

  const handleExportReport = useCallback(() => {
    const reportData = { 
      framework: frameworkDisplayName, 
      extractedDate: new Date().toISOString(), 
      fileName: file?.name,
      stats, 
      obligations: obligations.map(o => ({ section: o.section, requirement: o.requirement, status: o.status, confidence: `${o.confidence}%`, source: o.source }))
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; 
    a.download = `compliance_obligations_${activeFramework}_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  }, [frameworkDisplayName, file, stats, obligations, activeFramework]);

  return (
    <div className="space-y-4">
      <div className="text-xs font-medium px-3 py-1.5 rounded-full inline-flex items-center gap-2 bg-primary/10 text-primary">
        <Building2 className="w-3.5 h-3.5" />
        <span>Extracting: {frameworkDisplayName}</span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">AI Obligation Extractor</h3>
          <p className="text-xs text-muted-foreground">Upload a document — obligations are extracted automatically</p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      {!showResults && (
        <div className={`relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"}`}
          onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
          <input 
            ref={fileInputRef} 
            type="file" 
            id="obligation-document-upload"
            name="obligation-document-upload"
            title="Upload policy document for obligation extraction"
            aria-label="Upload policy document for obligation extraction"
            accept=".pdf,.docx,.txt" 
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)} 
            className="hidden" 
          />
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"><Upload className="w-8 h-8 text-primary" /></div>
            {file ? (
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-primary" /><span className="font-medium text-foreground">{file.name}</span>
                  <button type="button" title="Clear file" onClick={(e) => { e.stopPropagation(); clearFile(); }} className="p-1 hover:bg-muted rounded-full"><X className="w-4 h-4 text-muted-foreground" /></button>
                </div>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • Ready</p>
              </div>
            ) : (
              <>
                <p className="font-medium text-foreground mb-1">Drag & drop your document</p>
                <p className="text-sm text-muted-foreground mb-2">or click to browse</p>
                <p className="text-xs text-muted-foreground">PDF, DOCX, TXT (Max 10MB)</p>
              </>
            )}
          </div>
        </div>
      )}

      {file && !showResults && (
        <button onClick={extractObligations} disabled={extracting}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {extracting ? <><Loader2 className="w-4 h-4 animate-spin" />Extracting obligations...</> : <><Search className="w-4 h-4" />Extract {frameworkDisplayName} Obligations</>}
        </button>
      )}

      {showResults && noObligationsFound && (
        <div className="text-center py-12 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h4 className="font-semibold text-foreground mb-2">No Obligations Found</h4>
          <p className="text-sm text-muted-foreground mb-4">
            We couldn't find any {frameworkDisplayName} regulatory obligations in this document.
          </p>
          <button onClick={clearFile} className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
            Try Another Document
          </button>
        </div>
      )}

      {showResults && obligations.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-card border border-border rounded-lg p-3 text-center"><p className="text-xl font-bold text-foreground">{stats.total}</p><p className="text-[10px] text-muted-foreground uppercase">Found</p></div>
            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-3 text-center"><p className="text-xl font-bold text-secondary">{stats.compliant}</p><p className="text-[10px] text-muted-foreground uppercase">Compliant</p></div>
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 text-center"><p className="text-xl font-bold text-accent">{stats.partial}</p><p className="text-[10px] text-muted-foreground uppercase">Partial</p></div>
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-center"><p className="text-xl font-bold text-destructive">{stats.nonCompliant}</p><p className="text-[10px] text-muted-foreground uppercase">Non-Compliant</p></div>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Extracted Obligations ({obligations.length})</p>
            {obligations.map((obligation, index) => {
              const statusBadge = getStatusBadge(obligation.status);
              const StatusIcon = statusBadge.icon;
              return (
                <div key={obligation.id} className="bg-card border border-border rounded-xl p-4 transition-all hover:shadow-card">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{obligation.section}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${statusBadge.bg} ${statusBadge.text}`}><StatusIcon className="w-3 h-3" />{statusBadge.label}</span>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{obligation.confidence}% match</span>
                  </div>
                  <p className="text-sm text-foreground mb-2">{obligation.requirement}</p>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1"><FileText className="w-3 h-3" />{obligation.source}</span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={clearFile} className="flex-1 py-2.5 rounded-xl border border-border hover:bg-muted/60 transition-colors text-sm">Upload Another</button>
            <button onClick={handleExportReport} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-colors text-sm flex items-center justify-center gap-2"><Download className="w-4 h-4" />Export</button>
          </div>
        </div>
      )}
    </div>
  );
}