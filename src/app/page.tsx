"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import CVEditor from "@/components/cv-builder/CVEditor";
import CVPreview from "@/components/cv-builder/CVPreview";
import Navbar from "@/components/cv-builder/Navbar";
import { Eye, Pencil } from "lucide-react";

// Chevron SVG used in the scroll FAB
function ChevronIcon({ flipped }: { flipped: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        width: 16,
        height: 16,
        transition: "transform 280ms ease",
        transform: flipped ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function Home() {
  const [mobileTab, setMobileTab] = useState<"preview" | "editor">("editor");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Editor scroll tracking for the FAB
  const editorScrollRef = useRef<HTMLDivElement | null>(null);
  const [editorAtBottom, setEditorAtBottom] = useState(false);

  const onEditorScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    setEditorAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 40);
  }, []);

  const toggleEditorScroll = () => {
    const el = editorScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: editorAtBottom ? 0 : el.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 dark:bg-[#09090b] text-foreground overflow-hidden selection:bg-primary/30">
      <div
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 400ms ease, transform 400ms ease",
        }}
      >
        <Navbar />
      </div>

      {/* ── Main content area ── */}
      <div className="flex flex-1 overflow-hidden flex-row relative">

        {/* ── Preview panel ── */}
        <div
          className={`
            relative overflow-hidden
            bg-slate-100/60 dark:bg-muted/10 border-r
            md:flex md:flex-col md:w-1/2
            ${mobileTab === "preview" ? "flex flex-col w-full" : "w-0 h-0 opacity-0 pointer-events-none md:flex md:flex-col md:w-1/2 md:h-auto md:opacity-100 md:pointer-events-auto"}
          `}
          style={{
            opacity: mounted ? undefined : 0,
            transform: mounted ? "translateX(0)" : "translateX(-20px)",
            transition: "opacity 600ms ease 100ms, transform 600ms ease 100ms",
          }}
        >
          <CVPreview />
        </div>

        {/* ── Editor panel ── */}
        <div
          className={`
            relative overflow-hidden
            bg-background/95 backdrop-blur
            shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] z-10
            md:flex md:flex-col md:w-1/2
            ${mobileTab === "editor" ? "flex flex-col w-full" : "hidden"}
          `}
          style={{
            opacity: mounted ? undefined : 0,
            transform: mounted ? "translateX(0)" : "translateX(20px)",
            transition: "opacity 600ms ease 200ms, transform 600ms ease 200ms",
          }}
        >
          <CVEditor scrollRef={editorScrollRef} onScroll={onEditorScroll} />

          {/* Desktop-only scroll FAB (hidden on mobile, replaced by the shared bottom row) */}
          <button
            onClick={toggleEditorScroll}
            title={editorAtBottom ? "Scroll to top" : "Scroll to bottom"}
            className="md:flex hidden absolute bottom-4 right-4 z-30 w-10 h-10 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-black/20 items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95 select-none"
          >
            <ChevronIcon flipped={editorAtBottom} />
          </button>
        </div>

        {/* ── Bottom bar — mobile only ──────────────────────────────────────
            Single flex row: [pill nav] [scroll FAB]
            Both sit at the same bottom-4, perfectly vertically aligned.       */}
        <div className="md:hidden absolute bottom-4 left-0 right-0 z-50 flex items-center justify-center gap-2 px-4 pointer-events-none">

          {/* Edit / Preview pill nav */}
          <div
            className="relative flex items-center p-1 rounded-full pointer-events-auto"
            style={{
              background: "rgba(0,0,0,0.88)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 4,
                bottom: 4,
                left: 4,
                width: "calc(50% - 4px)",
                borderRadius: 9999,
                background: "#ffffff",
                boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
                willChange: "transform",
                transition: "transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: mobileTab === "editor"
                  ? "translateX(0px)"
                  : "translateX(calc(100% - 1px))",
              }}
            />

            <button
              onClick={() => setMobileTab("editor")}
              style={{ position: "relative", zIndex: 1 }}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] font-semibold select-none ${
                mobileTab === "editor" ? "text-black" : "text-white/60"
              }`}
            >
              <Pencil className="w-3.5 h-3.5 ml-2 shrink-0" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => setMobileTab("preview")}
              style={{ position: "relative", zIndex: 1 }}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] font-semibold select-none ${
                mobileTab === "preview" ? "text-black" : "text-white/60"
              }`}
            >
              <Eye className="w-3.5 h-3.5 ml-4 shrink-0" />
              <span>Preview</span>
            </button>
          </div>

          {/* Scroll FAB — same row, same height, separated by gap-2 */}
          <button
            onClick={toggleEditorScroll}
            title={editorAtBottom ? "Scroll to top" : "Scroll to bottom"}
            className="pointer-events-auto w-12 h-12 rounded-full bg-black border-5 border-black text-white dark:bg-white dark:text-black flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95 select-none shrink-0"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.20)" }}
          >
            <ChevronIcon flipped={editorAtBottom} />
          </button>

        </div>

      </div>
    </div>
  );
}
