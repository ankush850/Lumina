"use client";

import { useState, useRef } from "react";
import Link from "next/link";

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
      return { valid: false, message: "Invalid format. Select .pdf or .pptx." };
    }
    if (file.size > 50 * 1024 * 1024) {
      return { valid: false, message: "Exceeds 50MB maximum size limit." };
    }
    return { valid: true, ext };
  };

  const handleFiles = (files: FileList | File[]) => {
    if (activeTab === "single") {
      const file = files[0];
      if (!file) return;
      const val = validateFile(file);
      if (!val.valid) {
        alert(val.message);
        return;
      }
      setSelectedFile(file);
      setProcessResult(null);
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
        }
      });
      if (newItems.length > 0) {
        setBatchItems((prev) => [...prev, ...newItems]);
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

  const processSingleFile = async () => {
    if (!selectedFile || isProcessing) return;
    setIsProcessing(true);
    setProcessResult(null);
    setProgressPct(20);
    setProgressStep(0);
    setProgressText("PARSING OPENXML PRESENTATION STRUCTURES...");

    const t1 = setTimeout(() => {
      setProgressPct(55);
      setProgressStep(1);
      setProgressText("IDENTIFYING WATERMARK HYPERLINK OVERLAYS...");
    }, 400);

    const t2 = setTimeout(() => {
      setProgressPct(85);
      setProgressStep(2);
      setProgressText("PURGING WATERMARK NODES & UNLINKING RELATIONS...");
    }, 900);

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
        setProgressText("SANITIZATION COMPLETE. PREPARING DOWNLOAD.");

        setTimeout(() => {
          setIsProcessing(false);
          setProcessResult(data);
        }, 400);
      } else {
        throw new Error(data.message || "Watermark removal failed on server.");
      }
    } catch (err: any) {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsProcessing(false);
      alert(err.message || "Failed to process document.");
    }
  };

  const processBatchQueue = async () => {
    if (batchItems.length === 0 || isBatchProcessing) return;
    setIsBatchProcessing(true);

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

    setIsBatchProcessing(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", position: "relative" }}>
      {/* Navigation Bar */}
      <div className="brutalist-nav">
        <Link href="/" className="logo-link" style={{ position: "static" }}>
          <svg className="logo-svg" style={{ width: "32px", height: "32px" }} viewBox="0 0 46 46" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="butt" strokeLinejoin="miter">
            <g transform="rotate(0 23 23)"><path d="M23 0V19.5" /><path d="M14 10.2L23 19.2L32 10.2" /></g>
            <g transform="rotate(90 23 23)"><path d="M23 0V19.5" /><path d="M14 10.2L23 19.2L32 10.2" /></g>
            <g transform="rotate(180 23 23)"><path d="M23 0V19.5" /><path d="M14 10.2L23 19.2L32 10.2" /></g>
            <g transform="rotate(270 23 23)"><path d="M23 0V19.5" /><path d="M14 10.2L23 19.2L32 10.2" /></g>
          </svg>
          <span className="brand-text" style={{ fontSize: "18px" }}>LUMINA STUDIO</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Link href="/" style={{ color: "var(--lab)", textDecoration: "none", fontSize: "14px" }}>
            Home
          </Link>
          <Link href="/docs" style={{ color: "var(--lab)", textDecoration: "none", fontSize: "14px" }}>
            Documentation
          </Link>
          <span className="badge-tag red">SYSTEM ONLINE</span>
        </div>
      </div>

      <main className="subpage-container">
        {/* Eyebrow & Title */}
        <div style={{ marginBottom: "36px" }}>
          <div className="badge-tag" style={{ marginBottom: "12px" }}>
            SYSTEM LAYER: SANITIZATION CONTROLLER
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "40px", fontWeight: 700, letterSpacing: "-1px" }}>
            Document Sanitizer
          </h1>
          <p style={{ color: "var(--sub)", fontSize: "16px", marginTop: "8px", maxWidth: "680px" }}>
            Drop PPTX or PDF presentations to automatically purge Gamma watermarks without corrupting slide geometry or vector fonts.
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{ display: "flex", gap: "2px", marginBottom: "24px", background: "rgba(255,255,255,0.06)", width: "fit-content" }}>
          <button
            style={{
              padding: "10px 24px",
              background: activeTab === "single" ? "var(--red)" : "transparent",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
            onClick={() => setActiveTab("single")}
          >
            [01] Single File
          </button>
          <button
            style={{
              padding: "10px 24px",
              background: activeTab === "batch" ? "var(--red)" : "transparent",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
            onClick={() => setActiveTab("batch")}
          >
            [02] Batch Queue
          </button>
        </div>

        {/* Workspace Card */}
        <div className="brutalist-card">
          {activeTab === "single" && (
            <div>
              {!selectedFile && (
                <div
                  className={`brutalist-dropzone ${isDragOver ? "dragover" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.pptx"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files?.length) handleFiles(e.target.files);
                    }}
                  />
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "var(--lab)", marginBottom: "8px" }}>
                    [ CLICK TO BROWSE OR DRAG &amp; DROP ]
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>
                    Select PowerPoint (.pptx) or PDF File
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                    <span className="badge-tag">.PPTX</span>
                    <span className="badge-tag">.PDF</span>
                    <span className="badge-tag">MAX 50MB</span>
                  </div>
                </div>
              )}

              {selectedFile && !isProcessing && !processResult && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#000", border: "1px solid var(--border)", marginBottom: "20px" }}>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: 600, color: "#fff" }}>{selectedFile.name}</div>
                      <div style={{ fontSize: "12px", color: "var(--lab)", marginTop: "4px" }}>
                        {selectedFile.name.split(".").pop()?.toUpperCase()} &bull; {formatBytes(selectedFile.size)}
                      </div>
                    </div>
                    <button
                      onClick={resetWorkspace}
                      style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "13px" }}
                    >
                      [ REMOVE ]
                    </button>
                  </div>

                  <button
                    className="btn"
                    onClick={processSingleFile}
                    style={{ width: "100%", height: "54px", justifyContent: "center" }}
                  >
                    <span className="btn-label" style={{ textAlign: "center" }}>EXECUTE WATERMARK PURGE</span>
                    <svg className="btn-arrow" viewBox="0 0 22 18"><path d="M0 9H20.1" /><path d="M12.1 1L20.1 9L12.1 17" /></svg>
                  </button>
                </div>
              )}

              {isProcessing && (
                <div style={{ padding: "24px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                    <span style={{ color: "var(--red)" }}>&gt; {progressText}</span>
                    <span>{progressPct}%</span>
                  </div>

                  <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", marginBottom: "24px" }}>
                    <div style={{ width: `${progressPct}%`, height: "100%", background: "var(--red)", transition: "width 0.3s ease" }} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                    {["01. SCAN XML", "02. DETECT OVERLAYS", "03. PURGE NODES", "04. FINALIZE"].map((step, idx) => (
                      <div
                        key={step}
                        style={{
                          padding: "10px",
                          border: "1px solid var(--border)",
                          background: idx === progressStep ? "rgba(200,27,28,0.15)" : idx < progressStep ? "rgba(255,255,255,0.04)" : "transparent",
                          borderColor: idx === progressStep ? "var(--red)" : "var(--border)",
                          fontSize: "11px",
                          fontFamily: "var(--font-mono)",
                          textAlign: "center",
                          color: idx === progressStep ? "var(--red)" : idx < progressStep ? "#fff" : "var(--lab)",
                        }}
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {processResult && (
                <div>
                  <div style={{ padding: "14px 18px", border: "1px solid var(--red)", background: "rgba(200,27,28,0.08)", color: "#fff", marginBottom: "24px", fontFamily: "var(--font-mono)", fontSize: "13px" }}>
                    &check; SANITIZATION COMPLETE: {processResult.message || "Watermark successfully unlinked from presentation schema."}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
                    <div style={{ padding: "16px", border: "1px solid var(--border)", background: "#000" }}>
                      <div style={{ fontSize: "11px", color: "var(--lab)", fontFamily: "var(--font-mono)" }}>WATERMARKS REMOVED</div>
                      <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--red)", marginTop: "4px" }}>
                        {processResult.watermarks_removed ?? 0}
                      </div>
                    </div>
                    <div style={{ padding: "16px", border: "1px solid var(--border)", background: "#000" }}>
                      <div style={{ fontSize: "11px", color: "var(--lab)", fontFamily: "var(--font-mono)" }}>LAYOUTS CLEANED</div>
                      <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#fff", marginTop: "4px" }}>
                        {processResult.layouts_processed ?? 0}
                      </div>
                    </div>
                    <div style={{ padding: "16px", border: "1px solid var(--border)", background: "#000" }}>
                      <div style={{ fontSize: "11px", color: "var(--lab)", fontFamily: "var(--font-mono)" }}>FORMAT</div>
                      <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#fff", marginTop: "4px" }}>
                        {(processResult.file_type || "PPTX").toUpperCase()}
                      </div>
                    </div>
                    <div style={{ padding: "16px", border: "1px solid var(--border)", background: "#000" }}>
                      <div style={{ fontSize: "11px", color: "var(--lab)", fontFamily: "var(--font-mono)" }}>LATENCY</div>
                      <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#fff", marginTop: "4px" }}>
                        {processResult.processing_time || "0.08s"}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    {processResult.download_url && (
                      <a
                        href={processResult.download_url}
                        download={`clean_${selectedFile?.name || "document"}`}
                        className="btn"
                        style={{ flex: 1, height: "52px", justifyContent: "center" }}
                      >
                        <span className="btn-label" style={{ textAlign: "center" }}>DOWNLOAD CLEAN PRESENTATION</span>
                        <svg className="btn-arrow" viewBox="0 0 22 18"><path d="M0 9H20.1" /><path d="M12.1 1L20.1 9L12.1 17" /></svg>
                      </a>
                    )}
                    <button
                      onClick={resetWorkspace}
                      style={{
                        padding: "0 24px",
                        background: "transparent",
                        border: "1px solid var(--border)",
                        color: "#fff",
                        fontFamily: "var(--font-mono)",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      [ RESET ]
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "batch" && (
            <div>
              <div
                className="brutalist-dropzone"
                onClick={() => fileInputRef.current?.click()}
                style={{ marginBottom: "20px" }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.pptx"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files?.length) handleFiles(e.target.files);
                  }}
                />
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--lab)", marginBottom: "4px" }}>
                  [ BATCH INGESTION ]
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "#fff" }}>
                  Select multiple .pptx and .pdf files to queue
                </div>
              </div>

              {batchItems.length > 0 && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <span style={{ fontSize: "13px", fontFamily: "var(--font-mono)", color: "var(--lab)" }}>
                      QUEUE COUNT: {batchItems.length}
                    </span>
                    <button
                      className="btn"
                      onClick={processBatchQueue}
                      disabled={isBatchProcessing}
                      style={{ width: "auto", height: "42px", padding: "0 24px" }}
                    >
                      <span className="btn-label">{isBatchProcessing ? "PURGING QUEUE..." : "PURGE ALL QUEUED FILES"}</span>
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {batchItems.map((item, idx) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 16px",
                          border: "1px solid var(--border)",
                          background: "#000",
                          fontFamily: "var(--font-mono)",
                          fontSize: "13px",
                        }}
                      >
                        <div>
                          <span style={{ color: "var(--lab)", marginRight: "12px" }}>[{idx + 1}]</span>
                          <span style={{ color: "#fff" }}>{item.file.name}</span>
                          <span style={{ color: "var(--lab)", marginLeft: "12px", fontSize: "11px" }}>
                            {formatBytes(item.file.size)}
                          </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          {item.status === "ready" && <span className="badge-tag">READY</span>}
                          {item.status === "processing" && <span className="badge-tag red">PURGING...</span>}
                          {item.status === "done" && item.result?.download_url && (
                            <a
                              href={item.result.download_url}
                              download={`clean_${item.file.name}`}
                              style={{ color: "var(--red)", textDecoration: "none", fontWeight: 600 }}
                            >
                              [ DOWNLOAD ]
                            </a>
                          )}
                          {item.status === "error" && <span style={{ color: "var(--red)" }}>FAILED</span>}
                          <button
                            onClick={() => setBatchItems(prev => prev.filter(b => b.id !== item.id))}
                            style={{ background: "none", border: "none", color: "var(--lab)", cursor: "pointer" }}
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
