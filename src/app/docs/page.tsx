"use client";

import { Terminal, Code2, Server, CheckCircle2, FileCode, Cpu, ShieldCheck } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";

export default function DocsPage() {
  const curlCode = `curl -X POST "http://localhost:3000/api/remove-watermark" \\
  -F "file=@presentation.pptx"`;

  const pythonCode = `import requests

url = "http://localhost:3000/api/remove-watermark"
files = {"file": open("presentation.pptx", "rb")}

response = requests.post(url, files=files)
result = response.json()

print(f"Status: {result['status']}")
print(f"Watermarks Removed: {result['watermarks_removed']}")
print(f"Clean Download URL: {result['download_url']}")`;

  const jsCode = `const formData = new FormData();
formData.append("file", fileInput.files[0]);

const response = await fetch("http://localhost:3000/api/remove-watermark", {
  method: "POST",
  body: formData,
});

const data = await response.json();
console.log("Cleaned Document URL:", data.download_url);`;

  const tabs = [
    { label: "cURL", lang: "bash", code: curlCode },
    { label: "Python", lang: "python", code: pythonCode },
    { label: "JavaScript", lang: "javascript", code: jsCode },
  ];

  return (
    <main className="main-wrapper" style={{ maxWidth: "1050px" }}>
      {/* Header */}
      <section className="hero-header" style={{ marginBottom: "48px" }}>
        <div className="hero-pill-badge">
          <Terminal size={15} />
          <span>Developer Specifications &amp; Engine Internals</span>
        </div>
        <h1 className="hero-title">
          Architecture &amp; <br />
          <span className="gradient-title">Developer REST API</span>
        </h1>
        <p className="hero-subtitle">
          Programmatic integration guidelines, OpenXML tree inspectors, and PyMuPDF vector stream pruning mechanics.
        </p>
      </section>

      {/* Architecture Section */}
      <section style={{ marginBottom: "56px" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 700, color: "#ffffff", marginBottom: "20px" }}>
          Engine Mechanics &amp; AST Traversal
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          <div className="glass-card" style={{ padding: "28px" }}>
            <div className="feature-icon-wrapper">
              <FileCode size={22} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", marginBottom: "10px" }}>
              PowerPoint (.pptx) OpenXML Pipeline
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
              Lumina unzips and traverses PowerPoint XML packages: Slide Masters (`ppt/slideMasters/`), Layouts (`ppt/slideLayouts/`), and individual slide relations (`ppt/slides/`). It isolates shape nodes carrying Gamma hyperlink IDs and unlinks them at the schema level without affecting adjacent shapes.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "28px" }}>
            <div className="feature-icon-wrapper">
              <Cpu size={22} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", marginBottom: "10px" }}>
              PDF PyMuPDF Vector Scrubber
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
              For PDF documents, Lumina leverages PyMuPDF to parse page display lists and hyperlink annotations. It calculates exact bounding-box coordinates for corner watermarks, strips annotation actions, and writes a clean PDF stream without rasterizing the vector text or graphics.
            </p>
          </div>
        </div>
      </section>

      {/* API Reference Section */}
      <section style={{ marginBottom: "56px" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 700, color: "#ffffff", marginBottom: "20px" }}>
          REST API Reference
        </h2>

        <div className="glass-card" style={{ padding: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "13px",
                padding: "4px 10px",
                borderRadius: "6px",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "var(--accent-green)",
              }}
            >
              POST
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "16px", color: "var(--text-highlight)", fontWeight: 600 }}>
              /api/remove-watermark
            </span>
          </div>

          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
            Upload a `.pdf` or `.pptx` presentation to remove Gamma watermarks. Returns processing statistics and a direct download URL for the clean document.
          </p>

          <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)", marginBottom: "12px" }}>
            Request Parameters (Multipart Form Data)
          </h4>

          <div style={{ overflowX: "auto", marginBottom: "28px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--bg-card-border)", textAlign: "left", color: "var(--text-dim)" }}>
                  <th style={{ padding: "10px 12px" }}>Field</th>
                  <th style={{ padding: "10px 12px" }}>Type</th>
                  <th style={{ padding: "10px 12px" }}>Required</th>
                  <th style={{ padding: "10px 12px" }}>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                  <td style={{ padding: "12px", fontFamily: "var(--font-mono)", color: "var(--primary-light)" }}>file</td>
                  <td style={{ padding: "12px", color: "var(--text-muted)" }}>Binary File</td>
                  <td style={{ padding: "12px", color: "var(--accent-green)" }}>Yes</td>
                  <td style={{ padding: "12px", color: "var(--text-muted)" }}>PowerPoint (.pptx) or PDF (.pdf) file (Max 50MB)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)", marginBottom: "12px" }}>
            Example Request &amp; Client Snippets
          </h4>

          <CodeBlock tabs={tabs} />

          <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)", marginTop: "28px", marginBottom: "12px" }}>
            JSON Response
          </h4>

          <div className="code-box" style={{ padding: "16px" }}>
            <pre style={{ margin: 0, color: "#cbd5e1" }}>
{`{
  "status": "success",
  "file_type": "pptx",
  "original_filename": "presentation.pptx",
  "file_size": 421948,
  "layouts_processed": 1,
  "watermarks_removed": 1,
  "has_watermark": true,
  "processing_time": "0.14s",
  "message": "Presentation processed successfully",
  "download_url": "/download/processed_presentation.pptx"
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section style={{ marginBottom: "64px" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 700, color: "#ffffff", marginBottom: "20px" }}>
          Limits &amp; Ephemeral Lifecycle
        </h2>

        <div className="glass-card" style={{ padding: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            <div>
              <div style={{ fontSize: "12px", color: "var(--text-dim)", marginBottom: "4px" }}>Max File Size</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-highlight)" }}>50 MB</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "var(--text-dim)", marginBottom: "4px" }}>Retention Time</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--accent-green)" }}>60 Minutes (Auto-Purged)</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "var(--text-dim)", marginBottom: "4px" }}>Supported Formats</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--primary-light)" }}>PPTX, PDF</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "var(--text-dim)", marginBottom: "4px" }}>Authentication</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--secondary-light)" }}>None (Open Studio)</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
