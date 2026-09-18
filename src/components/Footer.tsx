import Link from "next/link";

export default function Footer() {
  return (
    <footer className="lumina-footer">
      <div className="footer-container">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "16px",
              color: "var(--text-highlight)",
            }}
          >
            Lumina AI
          </span>
          <span style={{ color: "var(--text-dim)", fontSize: "13px" }}>
            — Pristine Presentations. Zero Watermarks.
          </span>
        </div>

        <div className="footer-links">
          <Link href="/" className="footer-link">
            Home
          </Link>
          <Link href="/studio" className="footer-link">
            Studio
          </Link>
          <Link href="/docs" className="footer-link">
            Developer API
          </Link>
          <a
            href="https://github.com/ankush850"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub
          </a>
        </div>

        <div style={{ color: "var(--text-dim)", fontSize: "13px" }}>
          Engineered with precision • MIT License
        </div>
      </div>
    </footer>
  );
}
