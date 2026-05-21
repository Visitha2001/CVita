"use client";

import { useState, useRef, useEffect } from "react";
import { useCVStore } from "@/store/useCVStore";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { type TemplateProps } from "@/components/cv-templates/shared";
import SETemplate from "@/components/cv-templates/SETemplate";
import MLTemplate from "@/components/cv-templates/MLTemplate";
import FSTemplate from "@/components/cv-templates/FSTemplate";
import GenTemplate from "@/components/cv-templates/GenTemplate";
import FinTemplate from "@/components/cv-templates/FinTemplate";
import dummyData from "../../../db/dummy-data.json";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "all",  label: "All" },
  { id: "se",   label: "Software Eng." },
  { id: "ml",   label: "Machine Learning" },
  { id: "fs",   label: "Full Stack" },
  { id: "fin",  label: "Finance" },
  { id: "gen",  label: "General" },
] as const;

type CategoryId = typeof CATEGORIES[number]["id"];

const TEMPLATES = [
  { id: "se-1",  label: "Classic",          cat: "se"  },
  { id: "se-2",  label: "Classic + Photo",  cat: "se"  },
  { id: "se-3",  label: "Two-Column",       cat: "se"  },
  { id: "se-4",  label: "Two-Col + Photo",  cat: "se"  },
  { id: "ml-1",  label: "Academic",         cat: "ml"  },
  { id: "ml-2",  label: "Academic + Photo", cat: "ml"  },
  { id: "ml-3",  label: "Formal",           cat: "ml"  },
  { id: "ml-4",  label: "Formal + Photo",   cat: "ml"  },
  { id: "ml-5",  label: "Research",         cat: "ml"  },
  { id: "fs-1",  label: "Dark Sidebar",     cat: "fs"  },
  { id: "fs-2",  label: "Sidebar + Photo",  cat: "fs"  },
  { id: "fs-3",  label: "Top Band",         cat: "fs"  },
  { id: "fs-4",  label: "Band + Photo",     cat: "fs"  },
  { id: "fs-5",  label: "Minimal Side",     cat: "fs"  },
  { id: "fin-1", label: "Conservative",     cat: "fin" },
  { id: "fin-2", label: "Executive",        cat: "fin" },
  { id: "fin-3", label: "Prestige Sidebar", cat: "fin" },
  { id: "fin-4", label: "Sidebar + Photo",  cat: "fin" },
  { id: "fin-5", label: "Modern Finance",   cat: "fin" },
  { id: "gen-1", label: "Elegant",          cat: "gen" },
  { id: "gen-2", label: "Elegant + Photo",  cat: "gen" },
  { id: "gen-3",  label: "Split",            cat: "gen" },
  { id: "gen-4",  label: "Split + Photo",    cat: "gen" },
  { id: "gen-5",  label: "Creative Header",  cat: "gen" },
  { id: "gen-6",  label: "Compact Modern",   cat: "gen" },
  { id: "gen-7",  label: "Compact + Photo",  cat: "gen" },
  { id: "gen-8",  label: "Timeline",         cat: "gen" },
  { id: "gen-9",  label: "Timeline + Photo", cat: "gen" },
  { id: "gen-10", label: "Bold Sidebar",     cat: "gen" },
  { id: "gen-11", label: "Sidebar + Photo",  cat: "gen" },
  { id: "gen-12", label: "Minimal Clean",    cat: "gen" },
  { id: "gen-13", label: "Card Layout",      cat: "gen" },
  { id: "gen-14", label: "Card + Photo",     cat: "gen" },
] as const;

const CAT_LABELS: Record<string, string> = {
  se: "Software Eng.", ml: "Machine Learning", fs: "Full Stack", fin: "Finance", gen: "General",
};

// ─── Stable template switcher ─────────────────────────────────────────────────

function TemplateSwitcher(props: TemplateProps) {
  const cat = props.settings.activeTemplate.split("-")[0];
  switch (cat) {
    case "ml":  return <MLTemplate {...props} />;
    case "fs":  return <FSTemplate {...props} />;
    case "fin": return <FinTemplate {...props} />;
    case "gen": return <GenTemplate {...props} />;
    default:    return <SETemplate {...props} />;
  }
}

// ─── Template preview with auto-calculated scale ──────────────────────────────

const A4_W_PX = 794;   // A4 at 96dpi
const A4_H_PX = 1123;

function TemplatePreview({ templateId, props }: { templateId: string; props: TemplateProps }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.21);

  // Measure the container width and compute the exact scale so the A4 fills it
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      if (w > 0) setScale(w / A4_W_PX);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const overrideProps: TemplateProps = {
    ...props,
    settings: { ...props.settings, activeTemplate: templateId },
  };

  return (
    // Outer container — maintains A4 aspect ratio, clips overflow
    <div
      ref={wrapRef}
      style={{
        width: "100%",
        height: `${A4_H_PX * scale}px`,
        overflow: "hidden",
        position: "relative",
        background: "white",
      }}
    >
      {/* Inner — rendered at full A4 size then scaled down */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${A4_W_PX}px`,
          height: `${A4_H_PX}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <TemplateSwitcher {...overrideProps} />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CVTemplatesList() {
  const { settings, setSettings } = useCVStore();
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");

  const filtered = TEMPLATES.filter(
    (t) => activeCategory === "all" || t.cat === activeCategory
  );

  return (
    <div className="max-w-2xl mx-auto pt-4 sm:pt-6 pb-10 space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Choose a Template</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{TEMPLATES.length} templates · {CATEGORIES.length - 1} categories</p>
      </div>

      {/* ── Category filter tabs ── */}
      <div className="flex flex-wrap gap-2 sticky top-0 z-10 bg-background/90 backdrop-blur py-2 -mx-1 px-1">
        {CATEGORIES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all border ${
              activeCategory === id
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "border-border hover:border-primary/50 hover:bg-accent"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Template grid ── */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((tpl) => {
          const isActive = settings.activeTemplate === tpl.id;
          return (
            <div
              key={tpl.id}
              onClick={() => setSettings({ activeTemplate: tpl.id })}
              className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all duration-150 group hover:shadow-xl hover:-translate-y-0.5 ${
                isActive
                  ? "border-primary ring-2 ring-primary/20 shadow-lg"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {/* Actual scaled template preview */}
              <div className="overflow-hidden">
                <TemplatePreview templateId={tpl.id} props={{ data: dummyData[tpl.cat as keyof typeof dummyData] as unknown as TemplateProps["data"], settings }} />
              </div>

              {/* Label row */}
              <div className="px-3 py-2 flex items-center justify-between bg-card border-t">
                <div>
                  <p className="text-sm font-semibold leading-tight">{tpl.label}</p>
                  <p className="text-[10px] text-muted-foreground">{CAT_LABELS[tpl.cat]}</p>
                </div>
                {isActive && (
                  <Badge className="w-5 h-5 p-0 flex items-center justify-center rounded-full shadow shrink-0">
                    <Check className="w-3 h-3" />
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
