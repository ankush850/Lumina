"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Zap,
  Sparkles,
  Layers,
  ShieldCheck,
  Cpu,
  FileCheck2,
  Terminal,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import ComparisonSlider from "@/components/ComparisonSlider";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Does Lumina damage slide layouts, animations, or vector fonts?",
      a: "Not at all. Lumina operates by directly analyzing the underlying OpenXML structure in PowerPoint presentations and the vector object trees in PDFs. It targets exclusively the Gamma watermark nodes and hyperlinks, leaving all user content, animations, typography, and charts completely intact.",
    },
    {
      q: "How does the detection engine distinguish watermarks from normal elements?",
      a: "Gamma inserts watermarks inside slide layouts and master slides with specific hyperlink metadata (`gamma.app/?utm_source=made-with-gamma`) and corner bounding boxes. Our multi-pass detector inspects both geometry coordinates and metadata URLs to achieve 100% precision with zero false positives.",
    },
    {
      q: "Are my uploaded presentations stored or monitored?",
      a: "Zero retention. Files are processed entirely in ephemeral system memory. Lumina runs an automated background cleanup cycle every hour to permanently shred temporary files from the filesystem.",
    },
    {
      q: "Can I use Lumina programmatically via API?",
      a: "Yes! Lumina includes a fully documented REST API (`POST /api/remove-watermark`) capable of headless batch processing and integration into custom publishing pipelines. Visit our API Docs page for cURL, Python, and JavaScript snippets.",
    },
  ];

  return (
    <main className="main-wrapper" style={{ maxWidth: "1100px" }}>
      {/* Hero Section */}
      <section className="hero-header" style={{ marginBottom: "64px" }}>
        <div className="hero-pill-badge">
          <div className="pulse-dot-cyan" />
          <span>Gamma AI Sanitizer v2.5 Online</span>
        </div>

        <h1 className="hero-title">
          Pristine Presentations, <br />
          <span className="gradient-title">Zero Watermarks</span> in Seconds
        </h1>

        <p className="hero-subtitle" style={{ marginBottom: "36px" }}>
          The intelligent document sanitization engine that scrubs hard-coded Gamma.app watermarks from PowerPoint (.pptx) and PDF documents with lossless vector retention.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <Link
            href="/studio"
            className="btn-primary"
            style={{ width: "auto", padding: "14px 32px", fontSize: "16px", borderRadius: "var(--radius-full)" }}
          >
            <Zap size={18} />
            <span>Launch Studio Free</span>
          </Link>
          <Link
            href="/docs"
            className="btn-secondary"
            style={{ borderRadius: "var(--radius-full)", padding: "14px 28px" }}
          >
            <Terminal size={16} />
            <span>Developer REST API</span>
          </Link>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="stats-banner">
        <div className="stat-item">
          <span className="stat-item-num">10,000+</span>
          <span className="stat-item-label">Presentations Sanitized</span>
        </div>
        <div className="stat-item">
          <span className="stat-item-num">100%</span>
          <span className="stat-item-label">Vector Fidelity Retained</span>
        </div>
        <div className="stat-item">
          <span className="stat-item-num">&lt; 1.2s</span>
          <span className="stat-item-label">Average Processing Latency</span>
        </div>
        <div className="stat-item">
          <span className="stat-item-num">0</span>
          <span className="stat-item-label">Quality Loss or Blurring</span>
        </div>
      </section>

      {/* Interactive Comparison Slider */}
      <section style={{ marginBottom: "72px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div className="hero-pill-badge" style={{ marginBottom: "12px" }}>
            <Sparkles size={14} />
            <span>Interactive Comparison</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 700, color: "#ffffff" }}>
            Slide Master Precision Scrubbing
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
            Drag the divider to see how Lumina removes the watermark while maintaining 100% visual fidelity.
          </p>
        </div>

        <ComparisonSlider />
      </section>

      {/* 3-Step Visual Processing Pipeline */}
      <section style={{ marginBottom: "72px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 700, color: "#ffffff" }}>
            How Lumina Sanitizes Documents
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
            Three streamlined steps powered by OpenXML and PyMuPDF vector parsers.
          </p>
        </div>

        <div className="pipeline-grid">
          <div className="pipeline-card">
            <span className="pipeline-step-badge">STEP 01</span>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff" }}>Document Upload</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
              Drop any `.pptx` or `.pdf` presentation up to 50MB into the studio workspace or pass via REST API.
            </p>
          </div>

          <div className="pipeline-card">
            <span className="pipeline-step-badge">STEP 02</span>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff" }}>AST &amp; Layout Inspection</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
              Our engine parses Slide Master XML and PDF vector streams to pinpoint specific Gamma hyperlinked overlay nodes.
            </p>
          </div>

          <div className="pipeline-card">
            <span className="pipeline-step-badge">STEP 03</span>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff" }}>Lossless Export</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6" }}>
              The purged document is repacked and served for instant download, completely clean and watermark-free.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ marginBottom: "80px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 700, color: "#ffffff" }}>
            Engineered for Flawless Presentations
          </h2>
        </div>

        <div className="features-grid-3">
          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <Layers size={22} />
            </div>
            <h3 className="feature-title">Smart Master Detection</h3>
            <p className="feature-desc">
              Intelligently traverses PowerPoint Slide Masters, Layout XML, and PDF bounding boxes to isolate Gamma links without touching user slides.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <Cpu size={22} />
            </div>
            <h3 className="feature-title">Lossless Vector Retention</h3>
            <p className="feature-desc">
              Retains crisp vector shapes, embedded typography, animations, and high-resolution media. Zero rasterization or blurriness.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <ShieldCheck size={22} />
            </div>
            <h3 className="feature-title">Ephemeral Privacy</h3>
            <p className="feature-desc">
              Files are processed in ephemeral memory. Automated background cleanup destroys all temporary files post-export.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section style={{ marginBottom: "80px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 700, color: "#ffffff" }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div key={idx} className="faq-item">
              <button className="faq-question" onClick={() => toggleFaq(idx)}>
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  style={{
                    transform: openFaq === idx ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>
              {openFaq === idx && <div className="faq-answer">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section
        className="glass-card"
        style={{
          textAlign: "center",
          padding: "54px 32px",
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)",
          border: "1px solid rgba(139, 92, 246, 0.3)",
        }}
      >
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "36px", fontWeight: 800, color: "#ffffff", marginBottom: "16px" }}>
          Ready to export pristine presentations?
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "16px", marginBottom: "28px", maxWidth: "600px", margin: "0 auto 28px" }}>
          Open the Lumina Studio now to process single files or batch queues in seconds.
        </p>
        <Link
          href="/studio"
          className="btn-primary"
          style={{ width: "auto", padding: "14px 36px", fontSize: "16px", borderRadius: "var(--radius-full)" }}
        >
          <span>Launch Lumina Studio</span>
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}
