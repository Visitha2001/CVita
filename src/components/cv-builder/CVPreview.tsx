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
  const [mounted, setMounted]     = useState(false);

  // Magnifier state
  const [magOn, setMagOn]         = useState(false);
  const [magPos, setMagPos]       = useState({ x: 0, y: 0 });
  const [magVisible, setMagVisible] = useState(false);
  const previewAreaRef = useRef<HTMLDivElement>(null);

  const fontUrl = `https://fonts.googleapis.com/css2?family=${settings.fontFamily.replace(/ /g, "+")}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap`;

  // Outer padding from spacing setting (same mm values the templates use)
  const spacingPadMm  = parseInt(spacingMap[settings.spacing ?? "standard"].outer);
  const spacingPadPx  = spacingPadMm * MM_TO_PX; // px at full A4 scale

  // Page-load animation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

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
  }, []);



  // Magnifier mouse tracking
  const handleMagMove = useCallback((e: React.MouseEvent) => {
    if (!magOn || !previewAreaRef.current) return;
    const rect = previewAreaRef.current.getBoundingClientRect();
    setMagPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setMagVisible(true);
  }, [magOn]);

  const handleMagLeave = useCallback(() => {
    setMagVisible(false);
  }, []);

  // Total visual height of the paginated preview at current scale
  const totalVisualH = (A4_H_PX * pageCount + PAGE_GAP_PX * (pageCount - 1)) * scale;

  const MAG_SIZE = 180;
  const MAG_ZOOM = 2.5;

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden relative"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 500ms ease, transform 500ms ease",
      }}
    >
      <style>{`@import url('${fontUrl}');`}</style>

      {/* Magnifier toggle button */}
      <button
        onClick={() => { setMagOn(!magOn); setMagVisible(false); }}
        title={magOn ? "Disable magnifier" : "Enable magnifier"}
        className={`absolute top-3 right-3 z-30 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 select-none ${
          magOn
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110"
            : "bg-background/80 text-muted-foreground border border-border hover:border-primary/50 hover:text-primary"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
      </button>

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
              We use position: fixed at (0,0) with opacity: 0.01 and z-index: -100 so it
              is fully laid out by the browser (avoiding display: none / off-screen clipping issues)
              but completely invisible to the user. html2canvas will clone and render it perfectly. */}
          <div
            id="cv-preview-container"
            ref={hiddenRef}
            aria-hidden="true"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: `${A4_W_PX}px`,
              fontFamily: settings.fontFamily,
              color: settings.fontColor,
              background: "white",
              pointerEvents: "none",
              zIndex: -100,
              opacity: 0.01,
            }}
          >
            <TemplateRouter data={cvData} settings={settings} />
          </div>

          {/* ── Paginated visual preview ─────────────────────────────────── */}
          <div
            ref={previewAreaRef}
            onMouseMove={handleMagMove}
            onMouseLeave={handleMagLeave}
            style={{
              width:    `${A4_W_PX * scale}px`,
              height:   `${totalVisualH}px`,
              position: "relative",
              flexShrink: 0,
              cursor: magOn ? "none" : "default",
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

            {/* ── Magnifier lens ─────────────────────────────────────────── */}
            {magOn && magVisible && (
              <div
                style={{
                  position: "absolute",
                  left: magPos.x - MAG_SIZE / 2,
                  top: magPos.y - MAG_SIZE / 2,
                  width: MAG_SIZE,
                  height: MAG_SIZE,
                  borderRadius: "50%",
                  border: "3px solid rgba(0,0,0,0.25)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.2)",
                  overflow: "hidden",
                  pointerEvents: "none",
                  zIndex: 50,
                  background: "white",
                }}
              >
                <div
                  style={{
                    width: `${A4_W_PX}px`,
                    transformOrigin: "top left",
                    transform: `scale(${MAG_ZOOM}) translate(${-(magPos.x / scale) + MAG_SIZE / (2 * MAG_ZOOM)}px, ${-(magPos.y / scale) + MAG_SIZE / (2 * MAG_ZOOM)}px)`,
                    fontFamily: settings.fontFamily,
                    color: settings.fontColor,
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                >
                  <TemplateRouter data={cvData} settings={settings} />
                </div>
              </div>
            )}
          </div>

          {/* Bottom breathing room */}
          <div style={{ height: `${PAGE_GAP_PX}px` }} />
        </div>
      </div>
    </div>
  );
}
