"use client";

import { useCVStore } from "@/store/useCVStore";
import { type TemplateProps } from "../cv-templates/shared";
import SETemplate from "../cv-templates/SETemplate";
import MLTemplate from "../cv-templates/MLTemplate";
import FSTemplate from "../cv-templates/FSTemplate";
import GenTemplate from "../cv-templates/GenTemplate";
import FinTemplate from "../cv-templates/FinTemplate";

const A4_WIDTH_MM = 210;  // used for id="cv-preview-container" width
const A4_HEIGHT_MM = 297; // used for minHeight

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
  const fontUrl = `https://fonts.googleapis.com/css2?family=${settings.fontFamily.replace(/ /g, "+")}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap`;

  return (
    <div className="flex-1 w-full flex justify-center py-8">
      <style>{`@import url('${fontUrl}');`}</style>
      <div
        id="cv-preview-container"
        className="shadow-2xl flex-shrink-0 bg-white overflow-hidden"
        style={{
          width: `${A4_WIDTH_MM}mm`,
          minHeight: `${A4_HEIGHT_MM}mm`,
          fontFamily: settings.fontFamily,
          color: settings.fontColor,
        }}
      >
        <TemplateRouter data={cvData} settings={settings} />
      </div>
    </div>
  );
}
