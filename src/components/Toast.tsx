"use client";

import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  text: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => {
        let icon = <Info size={18} />;
        if (t.type === "success") icon = <CheckCircle2 size={18} color="#34d399" />;
        if (t.type === "error") icon = <AlertCircle size={18} color="#f87171" />;

        return (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {icon}
            <span style={{ flex: 1 }}>{t.text}</span>
            <button
              onClick={() => onDismiss(t.id)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-dim)",
                cursor: "pointer",
                padding: "2px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
