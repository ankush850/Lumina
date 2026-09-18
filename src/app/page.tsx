"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function LandingPage() {
  const v1Ref = useRef<HTMLVideoElement>(null);
  const v2Ref = useRef<HTMLVideoElement>(null);
  const v3Ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 1. Arm intro class if motion allowed
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      document.documentElement.classList.add("intro");
    }

    // 2. Video sync
    const v1 = v1Ref.current;
    const v2 = v2Ref.current;
    const v3 = v3Ref.current;

    const handleTimeUpdate = () => {
      if (!v1) return;
      const t = v1.currentTime;
      if (v2 && Math.abs(v2.currentTime - t) > 0.12) v2.currentTime = t;
      if (v3 && Math.abs(v3.currentTime - t) > 0.12) v3.currentTime = t;
    };

    if (v1) {
      v1.addEventListener("timeupdate", handleTimeUpdate);
    }

    // 3. WAAPI Entrance Choreography
    const easings = {
      EXPO: "cubic-bezier(0.16, 1, 0.3, 1)",
      QUINT: "cubic-bezier(0.22, 1, 0.36, 1)",
      QUART: "cubic-bezier(0.25, 1, 0.5, 1)",
      TYPE: "cubic-bezier(0.22, 0.85, 0.24, 1)",
    };

    const isPhone = window.innerWidth <= 599;
    const scaleT = isPhone ? 0.86 : 1.0;
    const dur = (s: number) => s * 1000 * scaleT;
    const del = (s: number) => s * 1000 * scaleT;

    const probe = document.getElementById("probe");
    const s = (probe ? probe.getBoundingClientRect().width : 100) / 100;

    const logo = document.querySelector(".logo-link");
    const navItems = Array.from(document.querySelectorAll(".nav-item"));
    const burger = document.querySelector(".burger");
    const btnTop = document.querySelector(".btn-top");
    const h1Spans = Array.from(document.querySelectorAll(".hero h1 .ln > span"));
    const sub = document.querySelector(".hero .sub");
    const btnCta = document.querySelector(".btn-cta");

    const animations: Animation[] = [];

    const teardown = () => {
      document.documentElement.classList.remove("intro");
      animations.forEach((a) => {
        try {
          a.cancel();
        } catch {}
      });
    };

    const startChoreography = () => {
      if (logo) {
        animations.push(
          logo.animate(
            [
              { opacity: 0, transform: "scale(0.9)" },
              { opacity: 1, transform: "scale(1)" },
            ],
            { duration: dur(0.7), delay: del(0), easing: easings.EXPO, fill: "forwards" }
          )
        );
      }

      navItems.forEach((el, i) => {
        animations.push(
          el.animate(
            [
              { opacity: 0, transform: `translateY(${7 * s}px)` },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: dur(0.62), delay: del(0.12 + i * 0.055), easing: easings.QUINT, fill: "forwards" }
          )
        );
      });

      if (burger) {
        animations.push(
          burger.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: dur(0.55),
            delay: del(0.18),
            easing: easings.QUART,
            fill: "forwards",
          })
        );
      }

      if (btnTop) {
        animations.push(
          btnTop.animate(
            [
              { clipPath: "inset(0 100% 0 0)" },
              { clipPath: "inset(0 0% 0 0)" },
            ],
            { duration: dur(0.66), delay: del(0.28), easing: easings.EXPO, fill: "forwards" }
          )
        );
      }

      h1Spans.forEach((el, i) => {
        animations.push(
          el.animate(
            [
              { transform: "translateY(120%)" },
              { transform: "translateY(0)" },
            ],
            { duration: dur(0.98), delay: del(0.34 + i * 0.09), easing: easings.TYPE, fill: "forwards" }
          )
        );
      });

      if (sub) {
        animations.push(
          sub.animate(
            [
              { opacity: 0, transform: `translateY(${14 * s}px)` },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: dur(0.72), delay: del(0.74), easing: easings.QUINT, fill: "forwards" }
          )
        );
      }

      if (btnCta) {
        animations.push(
          btnCta.animate(
            [
              { clipPath: "inset(0 100% 0 0)" },
              { clipPath: "inset(0 0% 0 0)" },
            ],
            { duration: dur(0.7), delay: del(0.9), easing: easings.EXPO, fill: "forwards" }
          )
        );
      }

      setTimeout(teardown, del(1.7));
    };

    const timer = setTimeout(startChoreography, 60);

    return () => {
      clearTimeout(timer);
      if (v1) v1.removeEventListener("timeupdate", handleTimeUpdate);
      teardown();
    };
  }, []);

  const toggleMenu = () => {
    document.body.classList.toggle("nav-open");
  };

  const closeMenu = () => {
    document.body.classList.remove("nav-open");
  };

  const toggleAccordion = (id: string) => {
    const panel = document.getElementById("panel-" + id);
    const item = document.getElementById("item-" + id);
    const isCurrentlyOpen = panel?.classList.contains("open");

    document.querySelectorAll(".accordion-panel").forEach((p) => p.classList.remove("open"));
    document.querySelectorAll(".menu-item").forEach((i) => i.classList.remove("accordion-open"));

    if (!isCurrentlyOpen && panel && item) {
      panel.classList.add("open");
      item.classList.add("accordion-open");
    }
  };

  return (
    <div className="screen">
      <div id="probe" style={{ position: "absolute", visibility: "hidden", width: "calc(100 * var(--s))" }} />

      {/* Primary Video Background */}
      <div className="bg">
        <video ref={v1Ref} autoPlay muted loop playsInline preload="auto">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_132544_b6ef0174-ed95-45ad-9a2f-ccb8acfbdce8.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Second Pass Video Background */}
      <div className="bg2">
        <video ref={v2Ref} autoPlay muted loop playsInline preload="auto">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_132544_b6ef0174-ed95-45ad-9a2f-ccb8acfbdce8.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Scrim Overlay */}
      <div className="scrim" />

      {/* Fullscreen UI Frame */}
      <div className="frame">
        <header className="lumina-header">
          {/* Logo */}
          <Link href="/" className="logo-link" aria-label="Lumina Home">
            <svg className="logo-svg" viewBox="0 0 46 46" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="butt" strokeLinejoin="miter">
              <g transform="rotate(0 23 23)"><path d="M23 0V19.5" /><path d="M14 10.2L23 19.2L32 10.2" /></g>
              <g transform="rotate(90 23 23)"><path d="M23 0V19.5" /><path d="M14 10.2L23 19.2L32 10.2" /></g>
              <g transform="rotate(180 23 23)"><path d="M23 0V19.5" /><path d="M14 10.2L23 19.2L32 10.2" /></g>
              <g transform="rotate(270 23 23)"><path d="M23 0V19.5" /><path d="M14 10.2L23 19.2L32 10.2" /></g>
            </svg>
            <span className="brand-text">LUMINA</span>
          </Link>

          {/* Nav */}
          <nav className="lumina-nav">
            <Link href="/" className="nav-item">Home</Link>
            <Link href="/docs" className="nav-item">
              <span>Resources</span>
              <svg className="nav-chevron" viewBox="0 0 11 6"><path d="M1 1L5.5 5L10 1" /></svg>
            </Link>
            <Link href="/benefits" className="nav-item">Benefits</Link>
            <a href="https://github.com/ankush850/Lumina" target="_blank" rel="noopener noreferrer" className="nav-item">
              Contact
            </a>
          </nav>

          {/* Top CTA */}
          <Link href="/studio" className="btn btn-top">
            <span className="btn-label">Secure system</span>
            <svg className="btn-arrow" viewBox="0 0 22 18">
              <path d="M0 9H20.1" />
              <path d="M12.1 1L20.1 9L12.1 17" />
            </svg>
          </Link>

          {/* Mobile Burger */}
          <button className="burger" onClick={toggleMenu} aria-label="Toggle menu">
            <span className="burger-bar" />
            <span className="burger-bar" />
            <span className="burger-bar" />
          </button>
        </header>

        <div className="sp sp-a" />

        {/* Hero Section */}
        <section className="hero">
          <h1>
            <span className="ln"><span>Precision built into</span></span>
            <span className="ln"><span>every document layer</span></span>
          </h1>

          <p className="sub">
            {"Pristine presentations, zero watermarks.\nEngineered for lossless layout and vector retention."}
          </p>

          <Link href="/studio" className="btn btn-cta">
            <span className="btn-label">Secure system</span>
            <svg className="btn-arrow" viewBox="0 0 22 18">
              <path d="M0 9H20.1" />
              <path d="M12.1 1L20.1 9L12.1 17" />
            </svg>
          </Link>
        </section>

        <div className="sp sp-b" />
      </div>

      {/* Mobile Menu Overlay */}
      <div className="menu" id="menu">
        <div className="menu-tex">
          <video ref={v3Ref} autoPlay muted loop playsInline preload="auto">
            <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_132544_b6ef0174-ed95-45ad-9a2f-ccb8acfbdce8.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="menu-rule" />

        <div className="menu-content">
          <div className="menu-eyebrow">MENU</div>

          <ul className="menu-list">
            <li className="menu-item">
              <Link href="/" className="mrow" onClick={closeMenu}>Home</Link>
            </li>

            <li className="menu-item" id="item-resources">
              <button className="mrow" type="button" onClick={() => toggleAccordion("resources")}>
                <span>Resources</span>
                <svg className="m-chevron" viewBox="0 0 14 9"><path d="M1 1L7 7L13 1" /></svg>
              </button>
              <div className="accordion-panel" id="panel-resources">
                <Link href="/docs" className="sublink" onClick={closeMenu}>Documentation</Link>
                <Link href="/docs" className="sublink" onClick={closeMenu}>Threat reports</Link>
                <Link href="/docs" className="sublink" onClick={closeMenu}>Changelog</Link>
              </div>
            </li>

            <li className="menu-item">
              <Link href="/benefits" className="mrow" onClick={closeMenu}>Benefits</Link>
            </li>

            <li className="menu-item">
              <a href="https://github.com/ankush850/Lumina" target="_blank" rel="noopener noreferrer" className="mrow" onClick={closeMenu}>
                Contact
              </a>
            </li>
          </ul>

          <div className="menu-footer">
            <Link href="/studio" className="btn btn-menu" onClick={closeMenu}>
              <span className="btn-label">Secure system</span>
              <svg className="btn-arrow" viewBox="0 0 22 18">
                <path d="M0 9H20.1" />
                <path d="M12.1 1L20.1 9L12.1 17" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
