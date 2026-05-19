"use client";

import { CVData, CVSettings } from "@/store/useCVStore";
import { Mail, MapPin, Phone, Globe, Link as LinkIcon, Briefcase, GraduationCap, Code, Award, User } from "lucide-react";

export interface TemplateProps {
  data: CVData;
  settings: CVSettings;
}

// ── Shared helpers ─────────────────────────────────────────────────────────────

export const spacingMap = {
  compact:  { outer: "6", inner: "4", gap: "4" },
  standard: { outer: "10", inner: "8", gap: "6" },
  spacious: { outer: "14", inner: "12", gap: "8" },
} as const;

export function getProfileShapeClass(shape: CVSettings["profilePictureShape"]) {
  if (shape === "circle") return "rounded-full";
  if (shape === "rounded") return "rounded-2xl";
  return "rounded-none";
}

export function ProfileImage({
  src,
  shape,
  className = "w-28 h-28",
}: {
  src: string;
  shape: CVSettings["profilePictureShape"];
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Profile"
      className={`object-cover flex-shrink-0 ${getProfileShapeClass(shape)} ${className}`}
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
    />
  );
}

export function ContactRow({
  data,
  className = "flex flex-wrap gap-x-4 gap-y-1 text-[11px]",
  itemClass = "flex items-center gap-1 opacity-80",
}: {
  data: CVData;
  className?: string;
  itemClass?: string;
}) {
  return (
    <div className={className}>
      {data.email && <span className={itemClass}><Mail className="w-3 h-3" /> {data.email}</span>}
      {data.phone && <span className={itemClass}><Phone className="w-3 h-3" /> {data.phone}</span>}
      {data.address && <span className={itemClass}><MapPin className="w-3 h-3" /> {data.address}</span>}
      {data.website && <span className={itemClass}><Globe className="w-3 h-3" /> {data.website}</span>}
      {data.socialMedia?.map((s, i) => {
        const Icon = getSocialIcon(s.platform);
        return (
          <span key={i} className={itemClass}><Icon className="w-3 h-3" /> {s.url.replace(/^https?:\/\//, "")}</span>
        );
      })}
    </div>
  );
}

export function getSocialIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("github") || p.includes("linkedin") || p.includes("facebook") || p.includes("twitter")) {
    return LinkIcon;
  }
  if (p.includes("portfolio") || p.includes("medium")) {
    return Globe;
  }
  return LinkIcon;
}

export function SkillChips({
  tags,
  accentColor,
  compact = false,
}: {
  tags: string[];
  accentColor: string;
  compact?: boolean;
}) {
  return (
    <div className={`flex flex-wrap gap-1 ${compact ? "mt-1" : "mt-1.5"}`}>
      {tags.map((tag, i) => (
        <span
          key={i}
          className="text-[10px] font-medium px-1.5 py-0.5 rounded"
          style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export function SectionHeading({
  icon: Icon,
  label,
  color,
  style = "underline",
}: {
  icon?: React.ElementType;
  label: string;
  color: string;
  style?: "underline" | "leftbar" | "filled" | "plain";
}) {
  if (style === "leftbar") {
    return (
      <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2.5 pl-2.5 flex items-center gap-1.5"
          style={{ borderLeft: `3px solid ${color}`, color }}>
        {Icon && <Icon className="w-3.5 h-3.5" />} {label}
      </h2>
    );
  }
  if (style === "filled") {
    return (
      <h2 className="text-[11px] font-bold uppercase tracking-widest mb-2.5 px-3 py-1 flex items-center gap-1.5 text-white"
          style={{ backgroundColor: color }}>
        {Icon && <Icon className="w-3.5 h-3.5" />} {label}
      </h2>
    );
  }
  if (style === "plain") {
    return (
      <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5"
          style={{ color }}>
        {Icon && <Icon className="w-3.5 h-3.5" />} {label}
      </h2>
    );
  }
  // underline (default)
  return (
    <h2 className="text-[13px] font-bold uppercase tracking-wider mb-2.5 pb-0.5 flex items-center gap-1.5"
        style={{ borderBottom: `2px solid ${color}`, color }}>
      {Icon && <Icon className="w-3.5 h-3.5" />} {label}
    </h2>
  );
}

// Export icons for use in templates
export { Mail, MapPin, Phone, Globe, LinkIcon, Briefcase, GraduationCap, Code, Award, User };

// ── Shared section renderers ───────────────────────────────────────────────────

export function renderCertifications(data: CVData, settings: CVSettings, gap: string) {
  if (!data.certifications?.length) return null;
  return (
    <section style={{ marginBottom: gap }}>
      <SectionHeading icon={Award} label="Certifications" color={settings.primaryColor} style="underline" />
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {data.certifications.map((cert) => (
          <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>
              <strong style={{ fontSize: "12px" }}>{cert.name}</strong>
              {cert.issuer && <span style={{ fontSize: "11px", opacity: 0.75, marginLeft: "6px" }}>· {cert.issuer}</span>}
            </div>
            {cert.date && <span style={{ fontSize: "10px", opacity: 0.65 }}>{cert.date}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}

export function renderLanguages(data: CVData, settings: CVSettings, gap: string) {
  if (!data.languages?.length) return null;
  return (
    <section style={{ marginBottom: gap }}>
      <SectionHeading icon={Globe} label="Languages" color={settings.primaryColor} style="underline" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {data.languages.map((lang, i) => (
          <span key={i} style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", background: `${settings.primaryColor}15`, color: settings.primaryColor, fontWeight: 500 }}>
            {lang}
          </span>
        ))}
      </div>
    </section>
  );
}

export function renderSkillCategories(data: CVData, settings: CVSettings, gap: string) {
  if (!data.skillCategories?.length) return null;
  return (
    <section style={{ marginBottom: gap }}>
      <SectionHeading icon={Award} label="Skills" color={settings.primaryColor} style="underline" />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {data.skillCategories.map((cat) => (
          <div key={cat.id}>
            <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: settings.primaryColor, marginBottom: "4px" }}>{cat.name}</div>
            <SkillChips tags={cat.skills} accentColor={settings.primaryColor} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function renderReferences(data: CVData, settings: CVSettings, gap: string) {
  if (!data.references?.length) return null;
  return (
    <section style={{ marginBottom: gap }}>
      <SectionHeading icon={User} label="References" color={settings.primaryColor} style="underline" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {data.references.map((ref) => (
          <div key={ref.id} style={{ fontSize: "11px" }}>
            <strong style={{ display: "block", fontSize: "12px" }}>{ref.name}</strong>
            <span style={{ opacity: 0.8 }}>{ref.position}</span>
            {ref.company && <span style={{ opacity: 0.7 }}> · {ref.company}</span>}
            <div style={{ opacity: 0.75, marginTop: "2px" }}>{ref.email}</div>
            {ref.phone && <div style={{ opacity: 0.65 }}>{ref.phone}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
