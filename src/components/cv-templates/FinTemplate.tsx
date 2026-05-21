"use client";

import {
  TemplateProps,
  spacingMap,
  ProfileImage,
  ContactRow,
  SkillChips,
  SectionHeading,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  User,
} from "./shared";

/* ── Finance Template variations ────────────────────────────────────────────────
  fin-1  Classic conservative single column, no image
  fin-2  Classic + executive circular photo
  fin-3  Prestigious two-column with dark accent sidebar
  fin-4  Two-column + photo
  fin-5  Modern finance with accent top bar & two content columns
──────────────────────────────────────────────────────────────────────────────── */

function renderExp(data: TemplateProps["data"], settings: TemplateProps["settings"], gap: string) {
  if (!data.experience?.length) return null;
  return (
    <section key="exp" style={{ marginBottom: gap }}>
      <SectionHeading icon={Briefcase} label="Professional Experience" color={settings.primaryColor} style="underline" />
      {data.experience.map((exp) => (
        <div key={exp.id} style={{ marginBottom: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <strong style={{ fontSize: "12px", letterSpacing: "0.01em" }}>{exp.role}</strong>
            <span style={{ fontSize: "10px", opacity: 0.65, fontStyle: "italic" }}>{exp.startDate} – {exp.endDate}</span>
          </div>
          <div style={{ fontSize: "11px", fontWeight: 600, color: settings.primaryColor, marginBottom: "4px" }}>{exp.company}</div>
          <p style={{ fontSize: "11px", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{exp.description}</p>
          {exp.skills?.length > 0 && <SkillChips tags={exp.skills} accentColor={settings.primaryColor} compact />}
        </div>
      ))}
    </section>
  );
}

function renderEdu(data: TemplateProps["data"], settings: TemplateProps["settings"], gap: string) {
  if (!data.education?.length) return null;
  return (
    <section key="edu" style={{ marginBottom: gap }}>
      <SectionHeading icon={GraduationCap} label="Education" color={settings.primaryColor} style="underline" />
      {data.education.map((edu) => (
        <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <div>
            <strong style={{ fontSize: "12px" }}>{edu.degree}</strong>
            <div style={{ fontSize: "11px", opacity: 0.8, fontStyle: "italic" }}>{edu.institution}</div>
          </div>
          <span style={{ fontSize: "10px", opacity: 0.65 }}>{edu.startDate} – {edu.endDate}</span>
        </div>
      ))}
    </section>
  );
}

function renderProj(data: TemplateProps["data"], settings: TemplateProps["settings"], gap: string) {
  if (!data.projects?.length) return null;
  return (
    <section key="proj" style={{ marginBottom: gap }}>
      <SectionHeading icon={Code} label="Key Transactions & Projects" color={settings.primaryColor} style="underline" />
      {data.projects.map((proj) => (
        <div key={proj.id} style={{ marginBottom: "10px" }}>
          <strong style={{ fontSize: "12px" }}>{proj.name}</strong>
          <p style={{ fontSize: "11px", lineHeight: 1.6, marginTop: "2px" }}>{proj.description}</p>
          {proj.skills?.length > 0 && <SkillChips tags={proj.skills} accentColor={settings.primaryColor} compact />}
        </div>
      ))}
    </section>
  );
}

function renderSkills(data: TemplateProps["data"], settings: TemplateProps["settings"], gap: string) {
  if (!data.skills?.length) return null;
  return (
    <section key="skills" style={{ marginBottom: gap }}>
      <SectionHeading icon={Award} label="Core Competencies" color={settings.primaryColor} style="underline" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
        {data.skills.map((s, i) => (
          <div key={i} style={{ fontSize: "11px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: settings.primaryColor, flexShrink: 0, display: "inline-block" }} />
            {s}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function FinTemplate({ data, settings }: TemplateProps) {
  const sp = spacingMap[settings.spacing ?? "standard"];
  const pad = `${sp.outer}mm`;
  const gap = `${sp.gap}mm`;
  const v = parseInt(settings.activeTemplate.split("-")[1]);

  const showImage = (v === 2 || v === 4) && !!data.image;
  const darkSidebar = v === 3 || v === 4;
  const topBand = v === 5;

  /* ── Variation 5: Modern finance top band + two column ── */
  if (topBand) {
    return (
      <div style={{ minHeight: "297mm", background: "white", color: settings.fontColor, fontFamily: settings.fontFamily }}>
        {/* Authoritative top header */}
        <header style={{ background: settings.primaryColor, padding: pad, color: "white" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.01em", marginBottom: "6px" }}>{data.name}</h1>
          <ContactRow data={data} className="flex flex-wrap gap-x-5 gap-y-1" itemClass="flex items-center gap-1 text-[10px] text-white/80" />
        </header>
        {/* Two content columns */}
        <div style={{ padding: pad, display: "grid", gridTemplateColumns: "1fr 1fr", gap, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap }}>
            {data.professionalSummary && (
              <section>
                <SectionHeading icon={User} label="Executive Profile" color={settings.primaryColor} style="leftbar" />
                <p style={{ fontSize: "11px", lineHeight: 1.65 }}>{data.professionalSummary}</p>
              </section>
            )}
            {renderExp(data, settings, gap)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap }}>
            {renderEdu(data, settings, gap)}
            {renderSkills(data, settings, gap)}
            {renderProj(data, settings, gap)}
          </div>
        </div>
      </div>
    );
  }

  /* ── Variations 3 & 4: Prestigious dark sidebar ── */
  if (darkSidebar) {
    return (
      <div style={{ display: "flex", minHeight: "297mm", background: "white", color: settings.fontColor, fontFamily: settings.fontFamily }}>
        {/* Dark sidebar */}
        <div style={{ width: "36%", background: settings.primaryColor, color: "white", padding: pad, display: "flex", flexDirection: "column", gap }}>
          {showImage && data.image && (
            <ProfileImage src={data.image} shape={settings.profilePictureShape} showRing={settings.showProfileRing} ringColor={settings.primaryColor} className="w-24 h-24 border-2 border-white/30" />
          )}
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em" }}>{data.name}</h1>
          </div>
          <ContactRow data={data} className="flex flex-col gap-1.5" itemClass="flex items-center gap-1.5 text-[10px] text-white/80" />
          {data.skills?.length > 0 && (
            <div>
              <h3 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", opacity: 0.7 }}>Core Competencies</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {data.skills.map((s, i) => (
                  <div key={i} style={{ fontSize: "11px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "white", opacity: 0.7, flexShrink: 0 }} />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.education?.length > 0 && (
            <div>
              <h3 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", opacity: 0.7 }}>Education</h3>
              {data.education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: "8px", fontSize: "11px" }}>
                  <strong style={{ display: "block" }}>{edu.degree}</strong>
                  <span style={{ opacity: 0.8, fontStyle: "italic" }}>{edu.institution}</span>
                  <span style={{ display: "block", opacity: 0.6, fontSize: "10px" }}>{edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Main */}
        <div style={{ flex: 1, padding: pad, display: "flex", flexDirection: "column", gap }}>
          {data.professionalSummary && (
            <section>
              <SectionHeading icon={User} label="Executive Profile" color={settings.primaryColor} style="leftbar" />
              <p style={{ fontSize: "11px", lineHeight: 1.65 }}>{data.professionalSummary}</p>
            </section>
          )}
          {renderExp(data, settings, gap)}
          {renderProj(data, settings, gap)}
        </div>
      </div>
    );
  }

  /* ── Variations 1 & 2: Classic conservative single column ── */
  return (
    <div style={{ minHeight: "297mm", background: "white", color: settings.fontColor, fontFamily: settings.fontFamily }}>
      {/* Header — name centered, conservative */}
      <header style={{ padding: `${sp.inner}mm ${pad}`, textAlign: "center", borderBottom: `2px solid ${settings.primaryColor}`, marginBottom: "0" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px" }}>
          {showImage && data.image && (
            <ProfileImage src={data.image} shape={settings.profilePictureShape} showRing={settings.showProfileRing} ringColor={settings.primaryColor} className="w-20 h-20" />
          )}
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.01em", color: settings.primaryColor }}>{data.name}</h1>
            <div style={{ marginTop: "4px" }}>
              <ContactRow data={data} className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px]" itemClass="flex items-center gap-1 opacity-70" />
            </div>
          </div>
        </div>
      </header>
      <div style={{ padding: `${sp.inner}mm ${pad}`, display: "flex", flexDirection: "column", gap }}>
        {data.professionalSummary && (
          <section>
            <SectionHeading icon={User} label="Professional Profile" color={settings.primaryColor} style="underline" />
            <p style={{ fontSize: "11px", lineHeight: 1.7 }}>{data.professionalSummary}</p>
          </section>
        )}
        {renderExp(data, settings, gap)}
        {renderEdu(data, settings, gap)}
        {renderSkills(data, settings, gap)}
        {renderProj(data, settings, gap)}
      </div>
    </div>
  );
}
