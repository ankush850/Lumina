"use client";

import { useState } from "react";
import Link from "next/link";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<"curl" | "python" | "js">("curl");
  const [copied, setCopied] = useState(false);

  const snippets = {
    curl: `curl -X POST "http://localhost:3000/api/remove-watermark" \\
  -F "file=@presentation.pptx"`,
    python: `import requests

url = "http://localhost:3000/api/remove-watermark"
with open("presentation.pptx", "rb") as f:
    response = requests.post(url, files={"file": f})

result = response.json()
print("Clean Document Download URL:", result.get("download_url"))`,
    js: `const formData = new FormData();
formData.append("file", fileInput.files[0]);

const response = await fetch("/api/remove-watermark", {
  method: "POST",
  body: formData,
});

const data = await response.json();
console.log("Download URL:", data.download_url);`,
  };

  const copyCode = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", position: "relative" }}>
      {/* Navigation */}
      <div className="brutalist-nav">
        <Link href="/" className="logo-link" style={{ position: "static" }}>
          <svg className="logo-svg" style={{ width: "32px", height: "32px" }} viewBox="0 0 46 46" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="butt" strokeLinejoin="miter">
            <g transform="rotate(0 23 23)"><path d="M23 0V19.5" /><path d="M14 10.2L23 19.2L32 10.2" /></g>
            <g transform="rotate(90 23 23)"><path d="M23 0V19.5" /><path d="M14 10.2L23 19.2L32 10.2" /></g>
            <g transform="rotate(180 23 23)"><path d="M23 0V19.5" /><path d="M14 10.2L23 19.2L32 10.2" /></g>
            <g transform="rotate(270 23 23)"><path d="M23 0V19.5" /><path d="M14 10.2L23 19.2L32 10.2" /></g>
          </svg>
          <span className="brand-text" style={{ fontSize: "18px" }}>LUMINA DOCS</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Link href="/" style={{ color: "var(--lab)", textDecoration: "none", fontSize: "14px" }}>
            Home
          </Link>
          <Link href="/studio" style={{ color: "var(--lab)", textDecoration: "none", fontSize: "14px" }}>
            Studio
          </Link>
          <Link href="/benefits" style={{ color: "var(--lab)", textDecoration: "none", fontSize: "14px" }}>
            Benefits
          </Link>
          <span className="badge-tag red">API v2.5</span>
        </div>
      </div>

      <main className="subpage-container">
        {/* Title */}
        <div style={{ marginBottom: "36px" }}>
          <div className="badge-tag" style={{ marginBottom: "12px" }}>
            SYSTEM LAYER: ARCHITECTURE &amp; ENDPOINTS
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "40px", fontWeight: 700, letterSpacing: "-1px" }}>
            Developer API &amp; Specifications
          </h1>
          <p style={{ color: "var(--sub)", fontSize: "16px", marginTop: "8px", maxWidth: "680px" }}>
            Programmatic document sanitization pipeline. Purge Gamma watermarks in automated batch workflows.
          </p>
        </div>

        {/* Engine Breakdown */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", marginBottom: "36px" }}>
          <div className="brutalist-card">
            <div className="badge-tag" style={{ marginBottom: "12px" }}>ENGINE 01: OPENXML PARSER</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, marginBottom: "10px" }}>
              PowerPoint (.pptx) Layout Scrubber
            </h3>
            <p style={{ color: "var(--sub)", fontSize: "14px", lineHeight: "1.6" }}>
              Lumina unzips PPTX packages, walks the XML tree across Slide Masters (`ppt/slideMasters/`), Layouts (`ppt/slideLayouts/`), and individual slide relations. It locates shape nodes bound to Gamma hyperlink relationships and cleanly unlinks them.
            </p>
          </div>

          <div className="brutalist-card">
            <div className="badge-tag" style={{ marginBottom: "12px" }}>ENGINE 02: PYMUPDF VECTOR STREAM</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, marginBottom: "10px" }}>
              PDF Lossless Bounding-Box Pruner
            </h3>
            <p style={{ color: "var(--sub)", fontSize: "14px", lineHeight: "1.6" }}>
              For PDF documents, PyMuPDF parses display lists and URI annotation dictionaries. It isolates corner watermark footprints and deletes them from page content streams without rasterizing user text or embedded vector assets.
            </p>
          </div>
        </div>

        {/* REST API Reference */}
        <div className="brutalist-card">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ padding: "4px 10px", background: "var(--red)", color: "#fff", fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 700 }}>
              POST
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "18px", fontWeight: 600 }}>
              /api/remove-watermark
            </span>
          </div>

          <p style={{ color: "var(--sub)", fontSize: "14px", marginBottom: "20px" }}>
            Upload a `.pptx` or `.pdf` file via multipart form-data. Returns sanitization telemetry and download URI.
          </p>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "10px", marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              {(["curl", "python", "js"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "6px 16px",
                    background: activeTab === tab ? "rgba(255,255,255,0.12)" : "transparent",
                    color: activeTab === tab ? "#fff" : "var(--lab)",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              onClick={copyCode}
              style={{
                background: "none",
                border: "1px solid var(--border)",
                color: copied ? "var(--red)" : "var(--sub)",
                padding: "6px 14px",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
              }}
            >
              {copied ? "[ COPIED ]" : "[ COPY CODE ]"}
            </button>
          </div>

          <div className="sharp-codebox" style={{ marginBottom: "24px" }}>
            <pre style={{ margin: 0 }}>
              <code>{snippets[activeTab]}</code>
            </pre>
          </div>

          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--lab)", marginBottom: "8px" }}>
            SAMPLE RESPONSE PAYLOAD:
          </div>
          <div className="sharp-codebox">
            <pre style={{ margin: 0, color: "#9ca3af" }}>
{`{
  "status": "success",
  "file_type": "pptx",
  "original_filename": "presentation.pptx",
  "file_size": 421948,
  "layouts_processed": 1,
  "watermarks_removed": 1,
  "has_watermark": true,
  "processing_time": "0.08s",
  "message": "Presentation processed successfully",
  "download_url": "/download/processed_presentation.pptx"
}`}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
