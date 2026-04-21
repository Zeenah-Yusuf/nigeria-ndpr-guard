// src/components/EvidenceUploadModal.tsx

import { useState, useRef, useEffect } from "react";
import { X, Upload, FileText, CheckCircle, AlertCircle, Loader2, Trash2, Eye } from "lucide-react";
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
  existingEvidence?: EvidenceData;
  onRemove?: () => void;
}

export function EvidenceUploadModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemTitle, 
  evidenceRequired,
  existingEvidence,
  onRemove
}: EvidenceUploadModalProps) {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setUploading(false);
      setUploadComplete(false);
      setError(null);
      setPreviewUrl(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateFile = (file: File): boolean => {
    // Validate file type
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain"
    ];
    
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Please upload PDF, JPEG, PNG, DOC, or TXT files only.");
      return false;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setError(null);
    
    // Simulate upload (replace with actual API call to your backend)
    setTimeout(() => {
      try {
        const evidenceData: EvidenceData = {
          fileName: selectedFile.name,
          fileUrl: URL.createObjectURL(selectedFile),
          uploadDate: new Date().toISOString(),
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
        };
        
        setUploadComplete(true);
        setUploading(false);
        
        // Wait a moment to show success state before closing
        setTimeout(() => {
          onConfirm(evidenceData);
        }, 1000);
      } catch (err) {
        setError("Failed to upload file. Please try again.");
        setUploading(false);
      }
    }, 1500);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FileText className="w-8 h-8 text-destructive" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <FileText className="w-8 h-8 text-secondary" />;
      case "doc":
      case "docx":
        return <FileText className="w-8 h-8 text-primary" />;
      default:
        return <FileText className="w-8 h-8 text-muted-foreground" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-semibold text-foreground">
              Upload Supporting Document
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Item Title */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-foreground mb-1">{itemTitle}</p>
            <p className="text-xs text-muted-foreground">{evidenceRequired}</p>
          </div>

          {/* Existing Evidence Display */}
          {existingEvidence && !selectedFile && !uploadComplete && (
            <div className="mb-4 p-3 rounded-lg bg-secondary/10 border border-secondary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getFileIcon(existingEvidence.fileName)}
                  <div>
                    <p className="text-xs font-medium text-foreground">{existingEvidence.fileName}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Uploaded: {new Date(existingEvidence.uploadDate).toLocaleDateString()} • {formatFileSize(existingEvidence.fileSize)}
                    </p>
                  </div>
                </div>
                {onRemove && (
                  <button
                    onClick={() => {
                      onRemove();
                      setSelectedFile(null);
                    }}
                    className="p-1 rounded-lg hover:bg-destructive/10 transition-colors"
                    aria-label="Remove evidence"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          {/* Upload Area */}
          {!uploadComplete && !existingEvidence && (
            <>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  selectedFile 
                    ? "border-primary/50 bg-primary/5" 
                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                }`}
              >
                {selectedFile ? (
                  <div className="space-y-2">
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-20 h-20 mx-auto object-cover rounded-lg"
                      />
                    ) : (
                      getFileIcon(selectedFile.name)
                    )}
                    <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      className="text-xs text-destructive hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-foreground mb-1">
                      Click or drag to upload
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      PDF, JPEG, PNG, DOC up to 10MB
                    </p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />
            </>
          )}

          {/* Upload Complete State */}
          {uploadComplete && (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-secondary/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-secondary" />
              </div>
              <p className="text-sm font-semibold text-foreground">Upload Complete!</p>
              <p className="text-xs text-muted-foreground mt-1">
                Your document has been submitted successfully.
              </p>
            </div>
          )}

          {/* Requirements Notice */}
          <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border">
            <p className="text-[10px] text-muted-foreground flex items-start gap-1.5">
              <span className="text-primary mt-0.5">ℹ️</span>
              Required for audit trail. Your document will be stored securely and can be referenced in future compliance reviews.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          {!existingEvidence && selectedFile && !uploadComplete && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload & Confirm
                </>
              )}
            </button>
          )}
          {existingEvidence && !uploadComplete && (
            <button
              onClick={() => onConfirm(existingEvidence)}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all"
            >
              Keep Existing Evidence
            </button>
          )}
        </div>
      </div>
    </div>
  );
}