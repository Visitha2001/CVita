"use client";

import { useEffect, useRef, useState } from "react";
import { useCVStore } from "@/store/useCVStore";
import { type TemplateProps } from "../cv-templates/shared";
import SETemplate from "../cv-templates/SETemplate";
import MLTemplate from "../cv-templates/MLTemplate";
import FSTemplate from "../cv-templates/FSTemplate";
import GenTemplate from "../cv-templates/GenTemplate";
import FinTemplate from "../cv-templates/FinTemplate";

// A4 at 96 dpi
const A4_W_PX = 794;
const A4_H_PX = 1123;

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
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const fontUrl = `https://fonts.googleapis.com/css2?family=${settings.fontFamily.replace(/ /g, "+")}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap`;

  // Scale the A4 to fit the available container width
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const containerW = el.clientWidth;
      if (containerW > 0) {
        setScale(Math.min(1, containerW / A4_W_PX));
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="w-full flex justify-center py-4 md:py-8">
      <style>{`@import url('${fontUrl}');`}</style>
      {/* Outer shell: fixed visible height for the preview UI */}
      <div
        style={{
          width: `${A4_W_PX * scale}px`,
          height: `${A4_H_PX * scale}px`,
          position: "relative",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {/* Inner A4 rendered at full size, then CSS-scaled down for preview.
            No fixed height / overflow-hidden here so scrollHeight reflects
            the true content height and multi-page exports work correctly. */}
        <div
          id="cv-preview-container"
          className="shadow-2xl bg-white"
          style={{
            width: `${A4_W_PX}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
            fontFamily: settings.fontFamily,
            color: settings.fontColor,
          }}
        >
          <TemplateRouter data={cvData} settings={settings} />
        </div>
      </div>
    </div>
  );
}
