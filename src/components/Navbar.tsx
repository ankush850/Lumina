"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Terminal, Sparkles } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="lumina-nav">
      <div className="nav-container">
        <Link href="/" className="brand-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/favicon.svg" alt="Lumina Logo" className="brand-logo-img" />
          <span className="brand-name">Lumina</span>
          <span className="brand-badge">v2.5</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/studio" className={`nav-link ${pathname === "/studio" ? "active" : ""}`}>
                Studio
              </Link>
            </li>
            <li>
              <Link href="/docs" className={`nav-link ${pathname === "/docs" ? "active" : ""}`}>
                <Terminal size={15} />
                API &amp; Docs
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/ankush850"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                GitHub
              </a>
            </li>
          </ul>
        </nav>

        <div className="nav-actions">
          <div className="engine-status-pill">
            <div className="pulse-dot-cyan"></div>
            <span>Engine Active</span>
          </div>

          {pathname !== "/studio" && (
            <Link
              href="/studio"
              className="btn-primary"
              style={{
                padding: "8px 18px",
                fontSize: "13px",
                width: "auto",
                borderRadius: "var(--radius-full)",
              }}
            >
              <Zap size={14} />
              <span>Launch Studio</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
