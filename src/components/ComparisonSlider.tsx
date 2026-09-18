"use client";

import { useState, useRef, useCallback } from "react";
import { Sparkles, MoveHorizontal, CheckCircle2 } from "lucide-react";

export default function ComparisonSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pos);
  }, []);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div
      className="comparison-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
    >
      <div className="comparison-image-wrapper">
        {/* "After" Layer (Clean slide) */}
        <div className="comparison-slide-after">
          <div style={{ maxWidth: "540px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 12px",
                borderRadius: "var(--radius-full)",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "var(--accent-green)",
                fontSize: "12px",
                fontWeight: 600,
                marginBottom: "16px",
              }}
            >
              <CheckCircle2 size={14} />
              <span>Cleaned by Lumina AI</span>
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "12px",
              }}
            >
              Strategic Product Vision 2026
            </h3>
            <p style={{ color: "#cbd5e1", fontSize: "15px", lineHeight: "1.6" }}>
              Enterprise revenue acceleration framework through unified AI orchestration and zero-latency pipelines.
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "24px",
              }}
            >
              <div
                style={{
                  padding: "12px 18px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>ARR Growth</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--accent-green)" }}>+142%</div>
              </div>
              <div
                style={{
                  padding: "12px 18px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>Retention</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--secondary-light)" }}>99.4%</div>
              </div>
            </div>
          </div>
        </div>

        {/* "Before" Layer (Slide with Gamma watermark) clipped by slider position */}
        <div
          className="comparison-slide-before"
          style={{
            clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
          }}
        >
          <div style={{ maxWidth: "540px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 12px",
                borderRadius: "var(--radius-full)",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#f87171",
                fontSize: "12px",
                fontWeight: 600,
                marginBottom: "16px",
              }}
            >
              <span>Original with Gamma Overlay</span>
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "12px",
              }}
            >
              Strategic Product Vision 2026
            </h3>
            <p style={{ color: "#cbd5e1", fontSize: "15px", lineHeight: "1.6" }}>
              Enterprise revenue acceleration framework through unified AI orchestration and zero-latency pipelines.
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "24px",
              }}
            >
              <div
                style={{
                  padding: "12px 18px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>ARR Growth</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--accent-green)" }}>+142%</div>
              </div>
              <div
                style={{
                  padding: "12px 18px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>Retention</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--secondary-light)" }}>99.4%</div>
              </div>
            </div>
          </div>

          {/* Hard-coded Gamma Watermark badge representation */}
          <div
            style={{
              position: "absolute",
              bottom: "24px",
              right: "24px",
              background: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(8px)",
              padding: "6px 14px",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
            }}
          >
            <span>Made with Gamma</span>
          </div>
        </div>

        {/* Divider Handle */}
        <div
          className="comparison-divider"
          style={{ left: `${sliderPos}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="comparison-handle">
            <MoveHorizontal size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}
