"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useCVStore } from "@/store/useCVStore";
import { type TemplateProps, spacingMap } from "../cv-templates/shared";
import SETemplate from "../cv-templates/SETemplate";
import MLTemplate from "../cv-templates/MLTemplate";
import FSTemplate from "../cv-templates/FSTemplate";
import GenTemplate from "../cv-templates/GenTemplate";
import FinTemplate from "../cv-templates/FinTemplate";

// A4 at 96 dpi
export const A4_W_PX = 794;
export const A4_H_PX = 1123;

// Gap between page sheets in the visual preview (px, at scale=1)
const PAGE_GAP_PX = 8;

// 1mm ≈ 3.7795px at 96 dpi
const MM_TO_PX = 3.7795;

function TemplateRouter(props: TemplateProps) {
  const category = props.settings.activeTemplate.split("-")[0];
  switch (category) {
    case "ml":  return <MLTemplate {...props} />;
    case "fs":  return <FSTemplate {...props} />;
    case "fin": return <FinTemplate {...props} />;
    case "gen": return <GenTemplate {...props} />;
    default:    return <SETemplate {...props} />;
  }
}

export default function CVPreview() {
  const { cvData, settings } = useCVStore();
  const wrapRef   = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [scale, setScale]         = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [atBottom, setAtBottom]   = useState(false);

  const fontUrl = `https://fonts.googleapis.com/css2?family=${settings.fontFamily.replace(/ /g, "+")}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap`;

  // Outer padding from spacing setting (same mm values the templates use)
  const spacingPadMm  = parseInt(spacingMap[settings.spacing ?? "standard"].outer);
  const spacingPadPx  = spacingPadMm * MM_TO_PX; // px at full A4 scale

  // Recalculate scale whenever the wrapper resizes
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const containerW = el.clientWidth;
      if (containerW > 0) setScale(Math.min(1, containerW / A4_W_PX));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Recalculate page count from hidden element's scrollHeight
  useEffect(() => {
    const el = hiddenRef.current;
    if (!el) return;
    const measure = () => {
      const h = el.scrollHeight;
      if (h > 0) setPageCount(Math.ceil(h / A4_H_PX));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Track scroll position to determine FAB direction
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    setAtBottom(scrollTop + clientHeight >= scrollHeight - 40);
  }, []);

  const scrollToggle = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: atBottom ? 0 : el.scrollHeight, behavior: "smooth" });
  };

  // Total visual height of the paginated preview at current scale
  const totalVisualH = (A4_H_PX * pageCount + PAGE_GAP_PX * (pageCount - 1)) * scale;

  return (
    // scrollRef is the scrollable container – page.tsx wraps CVPreview in
    // overflow-auto, so we need to reach that element. We pass scrollRef via
    // a callback ref on the wrapper so that the parent overflow-auto div
    // is targeted. Instead, we'll make this component own a scroll container.
    <div className="w-full h-full flex flex-col overflow-hidden relative">
      <style>{`@import url('${fontUrl}');`}</style>

      {/* Scrollable preview area */}
      <div
        ref={(node) => {
          (wrapRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        onScroll={handleScroll}
        className="flex-1 overflow-auto"
        style={{ scrollBehavior: "auto" }}
      >
        <div className="flex flex-col items-center py-4 md:py-8">

          {/* ── Hidden full-size render target (export target) ──────────────
              Off-screen fixed element; scrollHeight always reflects real height. */}
          <div
            id="cv-preview-container"
            ref={hiddenRef}
            aria-hidden="true"
            style={{
              position: "fixed",
              top: 0,
              left: "-9999px",
              width: `${A4_W_PX}px`,
              fontFamily: settings.fontFamily,
              color: settings.fontColor,
              background: "white",
              pointerEvents: "none",
              zIndex: -1,
            }}
          >
            <TemplateRouter data={cvData} settings={settings} />
          </div>

          {/* ── Paginated visual preview ─────────────────────────────────── */}
          <div
            style={{
              width:    `${A4_W_PX * scale}px`,
              height:   `${totalVisualH}px`,
              position: "relative",
              flexShrink: 0,
            }}
          >
            {Array.from({ length: pageCount }, (_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top:      `${i * (A4_H_PX + PAGE_GAP_PX) * scale}px`,
                  left:     0,
                  width:    `${A4_W_PX * scale}px`,
                  height:   `${A4_H_PX * scale}px`,
                  overflow: "hidden",
                  boxShadow: "0 2px 20px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.08)",
                  background: "white",
                  borderRadius: "2px",
                }}
              >
                {/* Page-number badge */}
                {pageCount > 1 && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: `${4 * scale}px`,
                      right:  `${6 * scale}px`,
                      fontSize: `${9 * scale}px`,
                      color: "rgba(0,0,0,0.25)",
                      fontFamily: "system-ui, sans-serif",
                      userSelect: "none",
                      zIndex: 10,
                      pointerEvents: "none",
                    }}
                  >
                    {i + 1} / {pageCount}
                  </div>
                )}

                {/* Inner template — offset so the correct page slice shows.
                    translateY in unscaled px, then scale() shrinks the whole thing. */}
                <div
                  style={{
                    width:           `${A4_W_PX}px`,
                    transform:       `scale(${scale}) translateY(${-i * A4_H_PX}px)`,
                    transformOrigin: "top left",
                    position:        "absolute",
                    top:             0,
                    left:            0,
                    fontFamily:      settings.fontFamily,
                    color:           settings.fontColor,
                    // Add spacing-matching padding to each page so the content
                    // never bleeds to the absolute edge (mirrors the PDF margin).
                    paddingTop:      i === 0 ? 0 : `${spacingPadPx}px`,
                    paddingBottom:   i === pageCount - 1 ? 0 : `${spacingPadPx}px`,
                  }}
                >
                  <TemplateRouter data={cvData} settings={settings} />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom breathing room */}
          <div style={{ height: `${PAGE_GAP_PX}px` }} />
        </div>
      </div>
    </div>
  );
}
