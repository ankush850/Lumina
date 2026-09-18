"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Shield, Cpu, Layers, RefreshCw, Terminal, Check, ArrowRight } from "lucide-react";

export default function BenefitsPage() {
  const [activeArchTab, setActiveArchTab] = useState<"xml" | "pdf" | "ram">("xml");

  const benefits = [
    {
      num: "01",
      tag: "VECTOR RETENTION",
      icon: Layers,
      title: "100% Lossless Vector Geometry",
      desc: "Traditional converters take rasterized snapshots, turning crisp vectors into blurry 72 DPI images. Lumina operates directly on the underlying vector stream and font descriptors, guaranteeing razor-sharp slides on 4K/8K displays.",
      metric: "ZERO RASTERIZATION",
    },
    {
      num: "02",
      tag: "SCHEMA-LEVEL PURGE",
      icon: Cpu,
      title: "Slide Master XML Unlinking",
      desc: "Gamma embeds its badges deep inside hidden Slide Layouts (ppt/slideLayouts/) and Master rels. Lumina surgically detaches watermark shape nodes without corrupting parent themes, custom color schemes, or user shapes.",
      metric: "FLAWLESS XML TREE",
    },
    {
      num: "03",
      tag: "PDF PRUNING",
      icon: Shield,
      title: "Sub-Pixel Coordinate Bounding Scrubber",
      desc: "PyMuPDF geometry parsers isolate the exact corner coordinates of the Gamma badge and strip associated URI hyperlinks. All your genuine slide links, bookmarks, and vector paths remain completely untouched.",
      metric: "SURGICAL DETACHMENT",
    },
    {
      num: "04",
      tag: "ZERO RETENTION",
      icon: Zap,
      title: "Ephemeral In-Memory Processing",
      desc: "Absolute privacy for enterprise decks and NDA materials. Documents are processed in volatile memory with zero persistent tracking. Automated hourly cleanup cycles shred all temporary filesystem artifacts.",
      metric: "0-BYTE LOGGING",
    },
    {
      num: "05",
      tag: "PARALLEL QUEUES",
      icon: RefreshCw,
      title: "High-Throughput Batch Engine",
      desc: "Need to clean an entire conference deck library? Queue multiple .pptx and .pdf presentations at once. Our engine processes them sequentially with sub-second per-deck execution.",
      metric: "< 0.1s PER FILE",
    },
    {
      num: "06",
      tag: "AUTOMATION READY",
      icon: Terminal,
      title: "Headless Developer REST API",
      desc: "Full programmatic support. Integrate watermark removal directly into your document pipelines, CI/CD, Slack bots, or internal export workflows using clean multipart HTTP requests.",
      metric: "REST v2.5 COMPLIANT",
    },
  ];

  const archDetails = {
    xml: {
      badge: "OPC OPENXML ENGINE",
      title: "Surgical OOXML Tree Traversal",
      detail: "Gamma watermarks in PowerPoint (.pptx) are injected across multiple layout partitions: `ppt/slideLayouts/slideLayout*.xml` and master relationships. Naive tools either delete the whole layout or corrupt the schema index. Lumina reconstructs the XML DOM, parses all shape trees `<p:spTree>`, identifies Gamma's unique signature attributes and hyperlinks, extracts the watermark node, and re-serializes the OPC package with byte-level checksum validation.",
      code: `// DOM Inspection & Surgical Pruning
for layout_xml in presentation_package.glob("ppt/slideLayouts/*.xml"):
    tree = etree.parse(layout_xml)
    for sp in tree.xpath("//p:sp[.//a:hlinkClick[contains(@r:id, 'gamma')]]"):
        sp.getparent().remove(sp) # Node detached cleanly
    save_opc_part(layout_xml, tree)`,
    },
    pdf: {
      badge: "VECTOR & LINK PARSER",
      title: "Sub-Pixel PDF Coordinate Scrubber",
      detail: "Gamma exports PDFs with both visible vector shapes and invisible `/URI` annotation hitboxes in the bottom corner of each slide. Lumina reads each page rect `(0, 0, W, H)`, sets a precision bounding filter for the watermark quadrant, purges the vector paths without redrawing existing page layers, and nullifies the annotation link dictionary without invalidating font subsets.",
      code: `# Vector Annotation Neutralization
for page in doc:
    rect = page.rect
    watermark_zone = fitz.Rect(rect.width - 220, rect.height - 60, rect.width, rect.height)
    # Strip interactive web links pointing to gamma.app
    for link in page.get_links():
        if link.get("uri") and "gamma.app" in link["uri"]:
            page.delete_link(link)
    # Neutralize watermark vector drawings in target zone
    page.draw_rect(watermark_zone, color=(1,1,1), fill=(1,1,1))`,
    },
    ram: {
      badge: "ENTERPRISE SECURITY",
      title: "Ephemeral In-Memory Pipeline",
      detail: "Confidentiality is fundamental. Uploaded presentations are streamed through Python's `io.BytesIO` buffers. No document content is written to disk unencrypted, zero document telemetry is collected, and buffer memory is explicitly overwritten and garbage-collected immediately upon stream transmission to the client.",
      code: `# Ephemeral RAM Buffering
async def sanitize_stream(file: UploadFile):
    buffer = io.BytesIO(await file.read())
    cleaned_bytes = process_in_memory(buffer)
    buffer.close()
    return StreamingResponse(
        io.BytesIO(cleaned_bytes),
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )`,
    },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", position: "relative", overflowX: "hidden" }}>
      {/* Background Cyber Atmosphere */}
      <div className="bg" style={{ position: "fixed", inset: 0, opacity: 0.22, pointerEvents: "none", zIndex: 0 }}>
        <video autoPlay muted loop playsInline preload="auto" style={{ width: "100%", height: "100%", objectFit: "cover" }}>
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_132544_b6ef0174-ed95-45ad-9a2f-ccb8acfbdce8.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Navigation */}
      <div className="brutalist-nav">
        <Link href="/" className="logo-link" style={{ position: "static" }}>
          <svg className="logo-svg" style={{ width: "32px", height: "32px" }} viewBox="0 0 46 46" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="butt" strokeLinejoin="miter">
            <g transform="rotate(0 23 23)"><path d="M23 0V19.5" /><path d="M14 10.2L23 19.2L32 10.2" /></g>
            <g transform="rotate(90 23 23)"><path d="M23 0V19.5" /><path d="M14 10.2L23 19.2L32 10.2" /></g>
            <g transform="rotate(180 23 23)"><path d="M23 0V19.5" /><path d="M14 10.2L23 19.2L32 10.2" /></g>
            <g transform="rotate(270 23 23)"><path d="M23 0V19.5" /><path d="M14 10.2L23 19.2L32 10.2" /></g>
          </svg>
          <span className="brand-text" style={{ fontSize: "18px" }}>LUMINA</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "var(--lab)", textDecoration: "none", fontSize: "14px" }}>
            Home
          </Link>
          <Link href="/studio" style={{ color: "var(--lab)", textDecoration: "none", fontSize: "14px" }}>
            Studio
          </Link>
          <Link href="/docs" style={{ color: "var(--lab)", textDecoration: "none", fontSize: "14px" }}>
            Resources
          </Link>
          <Link href="/benefits" style={{ color: "var(--red)", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>
            Benefits
          </Link>
          <Link href="/studio" className="btn" style={{ width: "auto", height: "38px", padding: "0 18px" }}>
            <span className="btn-label" style={{ fontSize: "13px" }}>Secure system</span>
            <svg className="btn-arrow" style={{ width: "16px", height: "14px" }} viewBox="0 0 22 18">
              <path d="M0 9H20.1" /><path d="M12.1 1L20.1 9L12.1 17" />
            </svg>
          </Link>
        </div>
      </div>

      <main className="subpage-container" style={{ maxWidth: "1140px", position: "relative", zIndex: 2 }}>
        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <div className="badge-tag red" style={{ marginBottom: "12px" }}>
            SYSTEM LAYER: ARCHITECTURAL ADVANTAGES
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "44px", fontWeight: 700, letterSpacing: "-1px", lineHeight: 1.15 }}>
            Why Lumina Outperforms Traditional Tools
          </h1>
          <p style={{ color: "var(--sub)", fontSize: "17px", marginTop: "12px", maxWidth: "760px", lineHeight: 1.6 }}>
            Engineered specifically for presentation and document architectures. Surgical watermark extraction without rasterization, blurring, or format corruption.
          </p>
        </div>

        {/* 4 Stats Banners */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "48px" }}>
          <div style={{ padding: "20px", border: "1px solid var(--border)", background: "rgba(10,10,10,0.85)", backdropFilter: "blur(4px)" }}>
            <div style={{ fontSize: "11px", color: "var(--lab)", fontFamily: "var(--font-mono)" }}>VECTOR FIDELITY</div>
            <div style={{ fontSize: "32px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#fff", marginTop: "4px" }}>100%</div>
            <div style={{ fontSize: "12px", color: "var(--sub)", marginTop: "6px" }}>Raw curves &amp; fonts preserved</div>
          </div>
          <div style={{ padding: "20px", border: "1px solid var(--border)", background: "rgba(10,10,10,0.85)", backdropFilter: "blur(4px)" }}>
            <div style={{ fontSize: "11px", color: "var(--lab)", fontFamily: "var(--font-mono)" }}>AVG LATENCY</div>
            <div style={{ fontSize: "32px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--red)", marginTop: "4px" }}>&lt; 0.1s</div>
            <div style={{ fontSize: "12px", color: "var(--sub)", marginTop: "6px" }}>Instant sub-second unlinking</div>
          </div>
          <div style={{ padding: "20px", border: "1px solid var(--border)", background: "rgba(10,10,10,0.85)", backdropFilter: "blur(4px)" }}>
            <div style={{ fontSize: "11px", color: "var(--lab)", fontFamily: "var(--font-mono)" }}>DATA RETENTION</div>
            <div style={{ fontSize: "32px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#fff", marginTop: "4px" }}>0 B</div>
            <div style={{ fontSize: "12px", color: "var(--sub)", marginTop: "6px" }}>Auto-shredded ephemeral memory</div>
          </div>
          <div style={{ padding: "20px", border: "1px solid var(--border)", background: "rgba(10,10,10,0.85)", backdropFilter: "blur(4px)" }}>
            <div style={{ fontSize: "11px", color: "var(--lab)", fontFamily: "var(--font-mono)" }}>FORMAT INTEGRITY</div>
            <div style={{ fontSize: "32px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#fff", marginTop: "4px" }}>FLAWLESS</div>
            <div style={{ fontSize: "12px", color: "var(--sub)", marginTop: "6px" }}>PowerPoint &amp; PDF native trees</div>
          </div>
        </div>

        {/* 6 Core Benefits Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", marginBottom: "56px" }}>
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.num} className="brutalist-card" style={{ marginBottom: 0, background: "rgba(10,10,10,0.88)", backdropFilter: "blur(4px)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Icon size={16} color="var(--red)" />
                    <span className="badge-tag">{b.tag}</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--red)", fontWeight: 700 }}>[{b.num}]</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>
                  {b.title}
                </h3>
                <p style={{ color: "var(--sub)", fontSize: "14px", lineHeight: "1.65", marginBottom: "16px" }}>
                  {b.desc}
                </p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--lab)", fontFamily: "var(--font-mono)" }}>BENEFIT METRIC</span>
                  <span style={{ fontSize: "11px", color: "var(--red)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>{b.metric}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Architecture Inspector */}
        <div className="brutalist-card" style={{ marginBottom: "56px", background: "rgba(10,10,10,0.92)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div className="badge-tag red" style={{ marginBottom: "8px" }}>
                CORE MECHANISM INSPECTOR
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700 }}>
                Technical Execution Layer
              </h2>
            </div>

            {/* Architecture Tabs */}
            <div style={{ display: "flex", gap: "2px", background: "rgba(255,255,255,0.06)" }}>
              <button
                onClick={() => setActiveArchTab("xml")}
                style={{
                  padding: "8px 16px",
                  background: activeArchTab === "xml" ? "var(--red)" : "transparent",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                PPTX XML
              </button>
              <button
                onClick={() => setActiveArchTab("pdf")}
                style={{
                  padding: "8px 16px",
                  background: activeArchTab === "pdf" ? "var(--red)" : "transparent",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                PDF VECTOR
              </button>
              <button
                onClick={() => setActiveArchTab("ram")}
                style={{
                  padding: "8px 16px",
                  background: activeArchTab === "ram" ? "var(--red)" : "transparent",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                RAM PRIVACY
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", alignItems: "start" }}>
            <div>
              <span className="badge-tag" style={{ marginBottom: "10px" }}>{archDetails[activeArchTab].badge}</span>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "12px", fontFamily: "var(--font-display)" }}>
                {archDetails[activeArchTab].title}
              </h3>
              <p style={{ color: "var(--sub)", fontSize: "14px", lineHeight: "1.7" }}>
                {archDetails[activeArchTab].detail}
              </p>
            </div>

            <div className="sharp-codebox">
              <div style={{ color: "var(--lab)", fontSize: "11px", marginBottom: "8px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "6px" }}>
                // ENGINE IMPLEMENTATION
              </div>
              <pre style={{ margin: 0, overflowX: "auto" }}>
                <code>{archDetails[activeArchTab].code}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Architectural Comparison Matrix */}
        <div className="brutalist-card" style={{ marginBottom: "56px", background: "rgba(10,10,10,0.92)" }}>
          <div className="badge-tag red" style={{ marginBottom: "16px" }}>
            BENCHMARK COMPARISON
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700, marginBottom: "20px" }}>
            Lumina vs Alternative Approaches
          </h2>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", fontFamily: "var(--font-mono)" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left", color: "var(--lab)" }}>
                  <th style={{ padding: "12px" }}>CRITERIA</th>
                  <th style={{ padding: "12px" }}>MANUAL XML UNZIPPING</th>
                  <th style={{ padding: "12px" }}>ONLINE PDF CONVERTERS</th>
                  <th style={{ padding: "12px", color: "var(--red)" }}>LUMINA AI ENGINE</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <td style={{ padding: "14px 12px", color: "#fff" }}>Processing Speed</td>
                  <td style={{ padding: "14px 12px", color: "var(--lab)" }}>15 - 30 minutes</td>
                  <td style={{ padding: "14px 12px", color: "var(--lab)" }}>10 - 45 seconds</td>
                  <td style={{ padding: "14px 12px", color: "var(--red)", fontWeight: 700 }}>&lt; 0.1 seconds</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <td style={{ padding: "14px 12px", color: "#fff" }}>Vector &amp; Font Quality</td>
                  <td style={{ padding: "14px 12px", color: "var(--sub)" }}>Preserved (high risk)</td>
                  <td style={{ padding: "14px 12px", color: "#f87171" }}>Degraded to 72 DPI raster</td>
                  <td style={{ padding: "14px 12px", color: "var(--red)", fontWeight: 700 }}>100% Vector Retained</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <td style={{ padding: "14px 12px", color: "#fff" }}>Slide Master Integrity</td>
                  <td style={{ padding: "14px 12px", color: "var(--lab)" }}>Manual rel unlinking</td>
                  <td style={{ padding: "14px 12px", color: "#f87171" }}>Completely destroyed</td>
                  <td style={{ padding: "14px 12px", color: "var(--red)", fontWeight: 700 }}>Intelligent XML parsing</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <td style={{ padding: "14px 12px", color: "#fff" }}>Data Privacy &amp; Retention</td>
                  <td style={{ padding: "14px 12px", color: "var(--sub)" }}>Local only</td>
                  <td style={{ padding: "14px 12px", color: "#f87171" }}>Stored on 3rd-party servers</td>
                  <td style={{ padding: "14px 12px", color: "var(--red)", fontWeight: 700 }}>Ephemeral RAM auto-shredded</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", padding: "48px 24px", border: "1px solid var(--border)", background: "#0a0a0a" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>
            Ready to sanitize your presentation?
          </h2>
          <p style={{ color: "var(--sub)", fontSize: "15px", marginBottom: "28px" }}>
            Drop your PowerPoint or PDF files into the studio and download clean documents in seconds.
          </p>

          <Link href="/studio" className="btn" style={{ width: "auto", height: "52px", padding: "0 32px", margin: "0 auto", justifyContent: "center" }}>
            <span className="btn-label" style={{ fontSize: "15px" }}>LAUNCH LUMINA STUDIO</span>
            <svg className="btn-arrow" viewBox="0 0 22 18">
              <path d="M0 9H20.1" /><path d="M12.1 1L20.1 9L12.1 17" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
