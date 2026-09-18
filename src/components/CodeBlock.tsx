"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  tabs: {
    label: string;
    lang: string;
    code: string;
  }[];
}

export default function CodeBlock({ tabs }: CodeBlockProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(tabs[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-box">
      <div className="code-header">
        <div className="code-lang-tabs">
          {tabs.map((tab, idx) => (
            <button
              key={tab.label}
              className={`code-lang-btn ${activeTab === idx ? "active" : ""}`}
              onClick={() => setActiveTab(idx)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button className="copy-btn" onClick={handleCopy}>
          {copied ? (
            <>
              <Check size={14} color="#10b981" />
              <span style={{ color: "#10b981" }}>Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      <pre style={{ margin: 0 }}>
        <code>{tabs[activeTab].code}</code>
      </pre>
    </div>
  );
}
