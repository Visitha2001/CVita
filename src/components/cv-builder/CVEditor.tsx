"use client";

import CVDataForm from "./CVDataForm";
import CVSettingsForm from "./CVSettingsForm";
import CVTemplatesList from "./CVTemplatesList";
import { FileText, Settings, LayoutTemplate } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";

type Tab = "data" | "settings" | "templates";

interface CVEditorProps {
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

const TABS: { id: Tab; icon: React.ElementType; labelKey: "data" | "settings" | "templates" }[] = [
  { id: "data",      icon: FileText,       labelKey: "data" },
  { id: "settings",  icon: Settings,       labelKey: "settings" },
  { id: "templates", icon: LayoutTemplate, labelKey: "templates" },
];

export default function CVEditor({ scrollRef, onScroll }: CVEditorProps) {
  const { t } = useI18n();
  const [active, setActive] = useState<Tab>("data");


  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Sleek Segmented Control Tab Bar ─────────────── */}
      <div className="px-3 sm:px-4 pt-4 pb-3 border-b bg-background/95 backdrop-blur-sm shrink-0">
        <div className="flex p-1 bg-muted/60 border border-border/50 rounded-[14px] shadow-inner">
          {TABS.map(({ id, icon: Icon, labelKey }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`relative flex-1 flex items-center justify-center gap-2 py-2 px-3 text-[13px] font-medium transition-all duration-300 rounded-[10px] select-none ${
                active === id
                  ? "bg-foreground text-background shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <Icon className={`w-[15px] h-[15px] shrink-0 transition-colors duration-300 ${active === id ? "text-background" : "text-muted-foreground"}`} />
              <span className="hidden min-[360px]:inline truncate">
                {t[labelKey]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content — plain div so we can forward the scroll ref ─────── */}
      <div
        ref={scrollRef as React.RefObject<HTMLDivElement>}
        onScroll={onScroll}
        className="flex-1 overflow-auto px-3 sm:px-4"
      >
        {active === "data"      && <CVDataForm />}
        {active === "settings"  && <CVSettingsForm />}
        {active === "templates" && <CVTemplatesList />}
      </div>

    </div>
  );
}
