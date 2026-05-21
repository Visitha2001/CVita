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

      {/* ── Standard Underline Tab bar ─────────────── */}
      <div className="px-3 sm:px-4 pt-4 border-b bg-background/95 backdrop-blur-sm shrink-0 flex gap-6">
        {TABS.map(({ id, icon: Icon, labelKey }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`relative flex items-center gap-2 pb-3 text-[13px] font-medium transition-colors duration-200 select-none ${
              active === id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-[15px] h-[15px] shrink-0" />
            <span className="hidden min-[360px]:inline truncate">
              {t[labelKey]}
            </span>
            {active === id && (
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-full"
                style={{ boxShadow: "0 -2px 8px var(--primary)" }}
              />
            )}
          </button>
        ))}
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
