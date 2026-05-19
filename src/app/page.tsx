"use client";

import { useState } from "react";
import CVEditor from "@/components/cv-builder/CVEditor";
import CVPreview from "@/components/cv-builder/CVPreview";
import Navbar from "@/components/cv-builder/Navbar";
import { Eye, Pencil } from "lucide-react";

export default function Home() {
  const [mobileTab, setMobileTab] = useState<"preview" | "editor">("editor");

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 dark:bg-[#09090b] text-foreground overflow-hidden selection:bg-primary/30">
      <Navbar />

      {/* ── Main content area ── */}
      <div className="flex flex-1 overflow-hidden flex-row relative">

        {/* Preview panel */}
        <div
          className={`
            flex-col overflow-hidden
            bg-slate-100/50 dark:bg-muted/10 border-r
            md:flex md:w-1/2
            ${mobileTab === "preview" ? "flex w-full" : "hidden"}
          `}
        >
          <div className="flex-1 overflow-auto flex justify-center p-3 md:p-4">
            <CVPreview />
          </div>
        </div>

        {/* Editor panel */}
        <div
          className={`
            flex-col overflow-hidden
            bg-background/95 backdrop-blur
            shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] z-10
            md:flex md:w-1/2
            ${mobileTab === "editor" ? "flex w-full" : "hidden"}
          `}
        >
          <CVEditor />
        </div>

        {/* ── Floating pill navigator (mobile only) ── */}
        <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-40 transition-all duration-500 pointer-events-none"
            style={{
              background:
                mobileTab === "editor"
                  ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.4))"
                  : "linear-gradient(135deg, hsl(var(--primary)/0.4), hsl(var(--primary)))",
            }}
          />

          {/* Pill container */}
          <div className="relative flex items-center gap-1 p-1.5 rounded-full border border-white/20 dark:border-white/10 bg-background/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">

            {/* Sliding active background */}
            <div
              className="absolute top-1.5 bottom-1.5 rounded-full bg-primary shadow-[0_2px_12px_rgba(0,0,0,0.25)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                width: "calc(50% - 4px)",
                left: mobileTab === "editor" ? "6px" : "calc(50% + 2px)",
              }}
            />

            {/* Edit tab */}
            <button
              onClick={() => setMobileTab("editor")}
              className={`relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 select-none ${
                mobileTab === "editor"
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Pencil
                className={`transition-all duration-200 ${
                  mobileTab === "editor" ? "w-3.5 h-3.5 scale-100" : "w-3.5 h-3.5 scale-90 opacity-70"
                }`}
              />
              <span>Edit</span>
            </button>

            {/* Preview tab */}
            <button
              onClick={() => setMobileTab("preview")}
              className={`relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 select-none ${
                mobileTab === "preview"
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye
                className={`transition-all duration-200 ${
                  mobileTab === "preview" ? "w-3.5 h-3.5 scale-100" : "w-3.5 h-3.5 scale-90 opacity-70"
                }`}
              />
              <span>Preview</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
