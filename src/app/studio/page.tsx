"use client";

import { useState, useRef, useCallback } from "react";
import {
  Sparkles,
  UploadCloud,
  FileText,
  X,
  Wand2,
  CheckCircle2,
  Download,
  RotateCcw,
  Play,
  Layers,
  ShieldCheck,
  Cpu,
  Loader2,
} from "lucide-react";
import ToastContainer, { ToastMessage } from "@/components/Toast";

interface BatchItem {
  id: string;
  file: File;
  ext: string;
  status: "ready" | "processing" | "done" | "error";
  result?: {
    watermarks_removed?: number;
    layouts_processed?: number;
    download_url?: string;
    message?: string;
  };
}

interface ProcessResponse {
  status: "success" | "error";
  message?: string;
  watermarks_removed?: number;
  layouts_processed?: number;
  file_type?: string;
  processing_time?: string;
  download_url?: string;
}

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<"single" | "batch">("single");
  const [isDragOver, setIsDragOver] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Single file states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [progressStep, setProgressStep] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [processResult, setProcessResult] = useState<ProcessResponse | null>(null);

  // Batch states
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addToast = (text: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const validateFile = (file: File) => {
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!["pdf", "pptx"].includes(ext)) {
      return { valid: false, message: "Invalid format. Please select a .pdf or .pptx file." };
    }
    if (file.size > 50 * 1024 * 1024) {
      return { valid: false, message: "File exceeds 50MB maximum size limit." };
    }
    return { valid: true, ext };
  };

  const handleFiles = (files: FileList | File[]) => {
    if (activeTab === "single") {
      const file = files[0];
      if (!file) return;
      const val = validateFile(file);
      if (!val.valid) {
        addToast(val.message!, "error");
        return;
      }
      setSelectedFile(file);
      setProcessResult(null);
      addToast(`Loaded "${file.name}"`, "info");
    } else {
      const newItems: BatchItem[] = [];
      Array.from(files).forEach((file) => {
        const val = validateFile(file);
        if (val.valid) {
          newItems.push({
            id: Math.random().toString(36).substring(2, 9),
            file,
            ext: val.ext!,
            status: "ready",
          });
        } else {
          addToast(`${file.name}: ${val.message}`, "error");
        }
      });
      if (newItems.length > 0) {
        setBatchItems((prev) => [...prev, ...newItems]);
        addToast(`Added ${newItems.length} file(s) to batch queue`, "info");
      }
    }
  };

  const resetWorkspace = () => {
    setSelectedFile(null);
    setProcessResult(null);
    setIsProcessing(false);
    setProgressPct(0);
    setProgressStep(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Single file process trigger
  const processSingleFile = async () => {
    if (!selectedFile || isProcessing) return;
    setIsProcessing(true);
    setProcessResult(null);
    setProgressPct(15);
    setProgressStep(0);
    setProgressText("Scanning presentation structures & slide masters...");

    const t1 = setTimeout(() => {
      setProgressPct(45);
      setProgressStep(1);
      setProgressText("Detecting Gamma watermark hyperlinks & overlays...");
    }, 500);

    const t2 = setTimeout(() => {
      setProgressPct(75);
      setProgressStep(2);
      setProgressText("Purging watermark nodes & preserving vector paths...");
    }, 1100);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/remove-watermark", {
        method: "POST",
        body: formData,
      });

      clearTimeout(t1);
      clearTimeout(t2);

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setProgressPct(100);
        setProgressStep(3);
        setProgressText("Sanitization complete! Finalizing output...");

        setTimeout(() => {
          setIsProcessing(false);
          setProcessResult(data);
          addToast(data.message || "Watermarks removed cleanly!", "success");
        }, 500);
      } else {
        throw new Error(data.message || "Watermark removal failed on server.");
      }
    } catch (err: any) {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsProcessing(false);
      addToast(err.message || "Failed to process document.", "error");
    }
  };

  // Batch process trigger
  const processBatchQueue = async () => {
    if (batchItems.length === 0 || isBatchProcessing) return;
    setIsBatchProcessing(true);
    let successCount = 0;

    for (let i = 0; i < batchItems.length; i++) {
      const item = batchItems[i];
      if (item.status === "done") continue;

      setBatchItems((prev) =>
        prev.map((b, idx) => (idx === i ? { ...b, status: "processing" } : b))
      );

      try {
        const formData = new FormData();
        formData.append("file", item.file);

        const res = await fetch("/api/remove-watermark", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (res.ok && data.status === "success") {
          successCount++;
          setBatchItems((prev) =>
            prev.map((b, idx) =>
              idx === i ? { ...b, status: "done", result: data } : b
            )
          );
        } else {
          setBatchItems((prev) =>
            prev.map((b, idx) => (idx === i ? { ...b, status: "error" } : b))
          );
        }
      } catch {
        setBatchItems((prev) =>
          prev.map((b, idx) => (idx === i ? { ...b, status: "error" } : b))
        );
      }
    }

    addToast(`Batch complete: ${successCount}/${batchItems.length} files processed.`, "success");
    setIsBatchProcessing(false);
  };

  const removeBatchItem = (id: string) => {
    setBatchItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main className="main-wrapper">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Hero Header */}
      <section className="hero-header">
        <div className="hero-pill-badge">
          <Sparkles size={15} />
          <span>Gamma AI &amp; Presentation Sanitizer</span>
        </div>
        <h1 className="hero-title">
          Clean Documents, <br />
          <span className="gradient-title">Zero Watermarks</span>
        </h1>
        <p className="hero-subtitle">
          Drop your PowerPoint (.pptx) or PDF files below. Our engine parses slide masters, eliminates Gamma hyperlinks, and exports pristine presentations in milliseconds.
        </p>
      </section>

      {/* Central Studio Workspace Card */}
      <section className="studio-card">
        {/* Mode Selector Tabs */}
        <div className="studio-tabs">
          <button
            className={`tab-btn ${activeTab === "single" ? "active" : ""}`}
            onClick={() => {
              if (isProcessing || isBatchProcessing) return;
              setActiveTab("single");
            }}
          >
            <FileText size={15} />
            <span>Single Document</span>
          </button>
          <button
            className={`tab-btn ${activeTab === "batch" ? "active" : ""}`}
            onClick={() => {
              if (isProcessing || isBatchProcessing) return;
              setActiveTab("batch");
            }}
          >
            <Layers size={15} />
            <span>Batch Queue</span>
          </button>
        </div>

        {/* SINGLE MODE */}
        {activeTab === "single" && (
          <div>
            {/* DropZone */}
            {!selectedFile && (
              <div
                className={`dropzone-container ${isDragOver ? "dragover" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files.length) {
                    handleFiles(e.dataTransfer.files);
                  }
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.pptx"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length) {
                      handleFiles(e.target.files);
                    }
                  }}
                />
                <div className="dropzone-icon-box">
                  <UploadCloud size={36} />
                </div>
                <h3 className="dropzone-heading">Drag &amp; Drop your document here</h3>
                <p className="dropzone-subtext">or click anywhere inside this box to browse local files</p>

                <div className="supported-badges">
                  <span className="format-pill pdf">.PDF</span>
                  <span className="format-pill pptx">.PPTX</span>
                  <span className="format-pill">Max 50 MB</span>
                </div>
              </div>
            )}

            {/* Selected File Card */}
            {selectedFile && !isProcessing && !processResult && (
              <div>
                <div className="file-preview-card">
                  <div className="file-info-group">
                    <div className={`file-type-icon ${selectedFile.name.split(".").pop()?.toLowerCase()}`}>
                      {selectedFile.name.split(".").pop()?.toUpperCase()}
                    </div>
                    <div className="file-details">
                      <span className="file-name">{selectedFile.name}</span>
                      <span className="file-meta-text">
                        {selectedFile.name.split(".").pop()?.toUpperCase()} • {formatBytes(selectedFile.size)}
                      </span>
                    </div>
                  </div>
                  <button className="btn-icon" onClick={resetWorkspace} title="Remove file">
                    <X size={18} />
                  </button>
                </div>

                <div style={{ marginTop: "20px" }}>
                  <button className="btn-primary" onClick={processSingleFile}>
                    <Wand2 size={18} />
                    <span>Process Document with Lumina AI</span>
                  </button>
                </div>
              </div>
            )}

            {/* Multi-step Processing Stepper */}
            {isProcessing && (
              <div className="stepper-container">
                <div className="stepper-status-header">
                  <div className="stepper-label">
                    <Loader2 size={18} className="animate-spin" />
                    <span>{progressText}</span>
                  </div>
                  <span className="stepper-percent">{progressPct}%</span>
                </div>

                <div className="stepper-track">
                  <div className="stepper-fill" style={{ width: `${progressPct}%` }} />
                </div>

                <div className="stepper-steps-grid">
                  <div className={`step-card ${progressStep === 0 ? "active" : progressStep > 0 ? "completed" : ""}`}>
                    01. AST Scan
                  </div>
                  <div className={`step-card ${progressStep === 1 ? "active" : progressStep > 1 ? "completed" : ""}`}>
                    02. Detect Overlays
                  </div>
                  <div className={`step-card ${progressStep === 2 ? "active" : progressStep > 2 ? "completed" : ""}`}>
                    03. Purge Nodes
                  </div>
                  <div className={`step-card ${progressStep === 3 ? "active" : progressStep > 3 ? "completed" : ""}`}>
                    04. Finalize
                  </div>
                </div>
              </div>
            )}

            {/* Completion & Results Dashboard */}
            {processResult && (
              <div className="completion-container">
                <div className="completion-badge">
                  <CheckCircle2 size={16} />
                  <span>Sanitization Complete • 100% Layout Integrity</span>
                </div>

                <div className="stats-grid">
                  <div className="stat-box">
                    <span className="stat-label">Watermarks Removed</span>
                    <span className="stat-number purple">
                      {processResult.watermarks_removed ?? 0}
                    </span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Layouts Cleaned</span>
                    <span className="stat-number cyan">
                      {processResult.layouts_processed ?? 0}
                    </span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Output Format</span>
                    <span className="stat-number">
                      {(processResult.file_type || selectedFile?.name.split(".").pop() || "PDF").toUpperCase()}
                    </span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Latency</span>
                    <span className="stat-number green">
                      {processResult.processing_time || "< 1.2s"}
                    </span>
                  </div>
                </div>

                <div className="completion-actions">
                  {processResult.download_url && (
                    <a
                      href={processResult.download_url}
                      download={`clean_${selectedFile?.name || "document"}`}
                      className="btn-primary download-cta-btn"
                    >
                      <Download size={18} />
                      <span>Download Clean Document</span>
                    </a>
                  )}
                  <button
                    className="btn-secondary"
                    onClick={resetWorkspace}
                    style={{ flex: "0 0 auto" }}
                  >
                    <RotateCcw size={16} />
                    <span>Process Another</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BATCH MODE */}
        {activeTab === "batch" && (
          <div>
            {/* Batch DropZone */}
            <div
              className={`dropzone-container ${isDragOver ? "dragover" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files.length) {
                  handleFiles(e.dataTransfer.files);
                }
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.pptx"
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length) {
                    handleFiles(e.target.files);
                  }
                }}
              />
              <div className="dropzone-icon-box">
                <UploadCloud size={36} />
              </div>
              <h3 className="dropzone-heading">Select multiple files or drop folder</h3>
              <p className="dropzone-subtext">Add as many .pptx and .pdf files as you want to the batch queue</p>

              <div className="supported-badges">
                <span className="format-pill pdf">.PDF</span>
                <span className="format-pill pptx">.PPTX</span>
                <span className="format-pill">Batch Queue</span>
              </div>
            </div>

            {/* Batch List */}
            {batchItems.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)" }}>
                    Queue ({batchItems.length} documents)
                  </span>
                  <button
                    className="btn-secondary"
                    onClick={processBatchQueue}
                    disabled={isBatchProcessing}
                    style={{ padding: "8px 18px", fontSize: "13px" }}
                  >
                    {isBatchProcessing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Processing Queue...</span>
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        <span>Process All Files</span>
                      </>
                    )}
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {batchItems.map((item) => (
                    <div key={item.id} className="file-preview-card" style={{ marginTop: 0 }}>
                      <div className="file-info-group">
                        <div className={`file-type-icon ${item.ext}`}>
                          {item.ext.toUpperCase()}
                        </div>
                        <div className="file-details">
                          <span className="file-name">{item.file.name}</span>
                          <span className="file-meta-text">{formatBytes(item.file.size)}</span>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {item.status === "ready" && (
                          <span className="format-pill">Ready</span>
                        )}
                        {item.status === "processing" && (
                          <span className="format-pill" style={{ color: "#38bdf8", borderColor: "rgba(56,189,248,0.3)" }}>
                            Processing...
                          </span>
                        )}
                        {item.status === "done" && item.result?.download_url && (
                          <a
                            href={item.result.download_url}
                            download={`clean_${item.file.name}`}
                            className="format-pill"
                            style={{ color: "#34d399", borderColor: "rgba(52,211,153,0.3)", textDecoration: "none" }}
                          >
                            Download Clean
                          </a>
                        )}
                        {item.status === "error" && (
                          <span className="format-pill" style={{ color: "#f87171", borderColor: "rgba(248,113,113,0.3)" }}>
                            Failed
                          </span>
                        )}

                        <button
                          className="btn-icon"
                          onClick={() => removeBatchItem(item.id)}
                          disabled={isBatchProcessing}
                          title="Remove file"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Feature Highlights Grid */}
      <section className="features-grid-3">
        <div className="feature-box">
          <div className="feature-icon-wrapper">
            <Layers size={22} />
          </div>
          <h3 className="feature-title">Smart Master Detection</h3>
          <p className="feature-desc">
            Intelligently traverses PowerPoint Slide Masters, Layouts, and PDF bounding boxes to isolate Gamma hyperlinks without touching user content.
          </p>
        </div>

        <div className="feature-box">
          <div className="feature-icon-wrapper">
            <Cpu size={22} />
          </div>
          <h3 className="feature-title">Lossless Vector Preservation</h3>
          <p className="feature-desc">
            Retains crisp vector shapes, embedded fonts, animations, and high-resolution slides. Zero rasterization or quality degradation.
          </p>
        </div>

        <div className="feature-box">
          <div className="feature-icon-wrapper">
            <ShieldCheck size={22} />
          </div>
          <h3 className="feature-title">In-Memory Privacy</h3>
          <p className="feature-desc">
            Files are processed entirely within ephemeral memory. Automated background cleanup sweeps and destroys all temporary files post-export.
          </p>
        </div>
      </section>
    </main>
  );
}
