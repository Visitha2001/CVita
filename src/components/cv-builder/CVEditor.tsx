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

      {/* ── iOS-style segmented tab bar ─────────────────────────────────── */}
      <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2.5 border-b bg-background/80 backdrop-blur-sm shrink-0">
        <div className="relative flex items-center rounded-[13px] bg-muted/50 dark:bg-muted/25 p-1">

          {/* Sliding pill indicator — GPU-composited, no layout reflow */}
          <div
            style={{
              position: "absolute",
              top: 4,
              bottom: 4,
              left: 4,
              width: "calc(33.333% - 2.67px)",
              borderRadius: 10,
              background: "var(--background)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
              willChange: "transform",
              transition: "transform 220ms cubic-bezier(0.4, 0, 0.2, 1)",
              transform: `translateX(calc(${TABS.findIndex(tab => tab.id === active)} * (100% + 4px)))`,
            }}
          />

          {TABS.map(({ id, icon: Icon, labelKey }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 py-[9px] px-2 rounded-[10px] text-[13px] font-semibold transition-colors duration-200 select-none ${
                active === id
                  ? "text-foreground"
                  : "text-muted-foreground/70 hover:text-muted-foreground"
              }`}
            >
              <Icon
                className={`shrink-0 transition-all duration-200 ${
                  active === id
                    ? "w-[15px] h-[15px] text-primary"
                    : "w-[15px] h-[15px]"
                }`}
              />
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
        className="flex-1 overflow-auto px-3 sm:px-4 py-4 sm:py-6"
      >
        {active === "data"      && <CVDataForm />}
        {active === "settings"  && <CVSettingsForm />}
        {active === "templates" && <CVTemplatesList />}
      </div>

    </div>
  );
}
