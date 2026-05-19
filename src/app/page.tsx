"use client";

import CVEditor from "@/components/cv-builder/CVEditor";
import CVPreview from "@/components/cv-builder/CVPreview";
import Navbar from "@/components/cv-builder/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#09090b] text-foreground overflow-hidden selection:bg-primary/30">
      <Navbar />
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Left Side: Preview */}
        <div className="w-full md:w-1/2 h-full bg-slate-100/50 dark:bg-muted/10 border-r flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto flex justify-center p-4">
            <CVPreview />
          </div>
        </div>

        {/* Right Side: Editor */}
        <div className="w-full md:w-1/2 h-full bg-background/95 backdrop-blur flex flex-col overflow-hidden relative shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] z-10">
          <CVEditor />
        </div>
      </div>
    </div>
  );
}
