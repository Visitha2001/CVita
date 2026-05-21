"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface DownloadSuccessModalProps {
  open: boolean;
  onClose: () => void;
  format: string;
}

export default function DownloadSuccessModal({ open, onClose, format }: DownloadSuccessModalProps) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimating(false);
      requestAnimationFrame(() => setAnimating(true));
      const timer = setTimeout(() => onClose(), 2200);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed h-[100dvh] w-full z-[99999] inset-0 flex items-center justify-center"
      onClick={onClose} 
      style={{
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(6px)",
        opacity: animating ? 1 : 0,
        transition: "opacity 250ms ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: animating ? "scale(1)" : "scale(0.85)",
          opacity: animating ? 1 : 0,
          transition: "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms ease",
        }}
        className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-4 min-w-[260px]"
      >
        {/* Animated tick circle */}
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            {/* Background circle */}
            <circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-primary/15"
            />
            {/* Animated circle */}
            <circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-primary"
              strokeLinecap="round"
              style={{
                strokeDasharray: "226",
                strokeDashoffset: animating ? "0" : "226",
                transition: "stroke-dashoffset 600ms ease 200ms",
                transformOrigin: "center",
                transform: "rotate(-90deg)",
              }}
            />
            {/* Animated checkmark */}
            <polyline
              points="25,42 35,52 55,32"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
              style={{
                strokeDasharray: "50",
                strokeDashoffset: animating ? "0" : "50",
                transition: "stroke-dashoffset 400ms ease 650ms",
              }}
            />
          </svg>
        </div>

        <div className="text-center">
          <p className="text-lg font-bold text-foreground">Download Complete!</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your CV has been saved as <span className="font-semibold text-primary">{format}</span>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
