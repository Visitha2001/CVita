"use client";

import { TemplateProps, spacingMap, ProfileImage, ContactRow, SkillChips, SectionHeading, Briefcase, GraduationCap, Code, Award } from "./shared";

/* ── FS Template variations ────────────────────────────────────────────────────
  fs-1  Dark sidebar + white main
  fs-2  Dark sidebar + image  
  fs-3  Top band header, two content columns
  fs-4  Top band header + image, two content columns
  fs-5  Minimal sidebar, accent line header
──────────────────────────────────────────────────────────────────────────────── */

export default function FSTemplate({ data, settings }: TemplateProps) {
  const sp = spacingMap[settings.spacing ?? "standard"];
  const pad = `${sp.outer}mm`;
  const gap = `${sp.gap}mm`;
  const v = parseInt(settings.activeTemplate.split("-")[1]);

  const showImage = (v === 2 || v === 4) && !!data.image;
  const topBand = v === 3 || v === 4;
  const minimalSidebar = v === 5;

  if (topBand) {
    /* Variations 3 & 4 — top header band, two content columns */
    return (
      <div style={{ minHeight: "297mm", background: "white", color: settings.fontColor, fontFamily: settings.fontFamily }}>
        <header style={{ background: settings.primaryColor, color: "white", padding: pad, display: "flex", alignItems: "center", gap: "16px" }}>
          {showImage && <ProfileImage src={data.image!} shape={settings.profilePictureShape} className="w-20 h-20 border-2 border-white/30" />}
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 800 }}>{data.name}</h1>
            <ContactRow data={data} className="flex flex-wrap gap-x-4 gap-y-1 mt-1" itemClass="flex items-center gap-1 text-[10px] text-white/80" />
          </div>
        </header>
        <div style={{ padding: pad, display: "grid", gridTemplateColumns: "1fr 1fr", gap }}>
          <div style={{ display: "flex", flexDirection: "column", gap }}>
            {data.professionalSummary && (
              <section>
                <SectionHeading label="Profile" color={settings.primaryColor} style="leftbar" />
                <p style={{ fontSize: "11px", lineHeight: 1.6 }}>{data.professionalSummary}</p>
              </section>
            )}
            {data.experience?.length > 0 && (
              <section>
                <SectionHeading icon={Briefcase} label="Experience" color={settings.primaryColor} style="leftbar" />
                {data.experience.map((exp) => (
                  <div key={exp.id} style={{ marginBottom: "10px" }}>
                    <strong style={{ fontSize: "12px" }}>{exp.role}</strong>
                    <div style={{ fontSize: "10px", opacity: 0.75, marginBottom: "2px" }}>{exp.company} · {exp.startDate} – {exp.endDate}</div>
                    <p style={{ fontSize: "11px", lineHeight: 1.5 }}>{exp.description}</p>
                    {exp.skills?.length > 0 && <SkillChips tags={exp.skills} accentColor={settings.primaryColor} compact />}
                  </div>
                ))}
              </section>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap }}>
            {data.projects?.length > 0 && (
              <section>
                <SectionHeading icon={Code} label="Projects" color={settings.primaryColor} style="leftbar" />
                {data.projects.map((proj) => (
                  <div key={proj.id} style={{ marginBottom: "10px" }}>
                    <strong style={{ fontSize: "12px" }}>{proj.name}</strong>
                    <p style={{ fontSize: "11px", lineHeight: 1.5, marginTop: "2px" }}>{proj.description}</p>
                    {proj.skills?.length > 0 && <SkillChips tags={proj.skills} accentColor={settings.primaryColor} compact />}
                  </div>
                ))}
              </section>
            )}
            {data.education?.length > 0 && (
              <section>
                <SectionHeading icon={GraduationCap} label="Education" color={settings.primaryColor} style="leftbar" />
                {data.education.map((edu) => (
                  <div key={edu.id} style={{ marginBottom: "8px" }}>
                    <strong style={{ fontSize: "12px" }}>{edu.degree}</strong>
                    <div style={{ fontSize: "11px", opacity: 0.8 }}>{edu.institution}</div>
                    <div style={{ fontSize: "10px", opacity: 0.65 }}>{edu.startDate} – {edu.endDate}</div>
                  </div>
                ))}
              </section>
            )}
            {data.skills?.length > 0 && (
              <section>
                <SectionHeading icon={Award} label="Skills" color={settings.primaryColor} style="leftbar" />
                <SkillChips tags={data.skills} accentColor={settings.primaryColor} />
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* Variations 1, 2, 5 — sidebar layout */
  const sidebarWidth = minimalSidebar ? "30%" : "35%";
  const sidebarBg = minimalSidebar ? `${settings.primaryColor}08` : settings.primaryColor;
  const sidebarColor = minimalSidebar ? settings.fontColor : "white";

  return (
    <div style={{ display: "flex", minHeight: "297mm", background: "white", color: settings.fontColor, fontFamily: settings.fontFamily }}>
      {/* Sidebar */}
      <div style={{ width: sidebarWidth, minWidth: sidebarWidth, padding: pad, background: sidebarBg, color: sidebarColor, display: "flex", flexDirection: "column", gap }}>
        {showImage && <ProfileImage src={data.image!} shape={settings.profilePictureShape} className={`w-24 h-24 ${minimalSidebar ? "" : "border-2 border-white/30"}`} />}
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: 800, lineHeight: 1.2, color: minimalSidebar ? settings.primaryColor : "white" }}>{data.name}</h1>
        </div>
        <ContactRow
          data={data}
          className="flex flex-col gap-1.5"
          itemClass={`flex items-center gap-1.5 text-[10px] ${minimalSidebar ? "opacity-75" : "text-white/80"}`}
        />
        {data.skills?.length > 0 && (
          <div>
            <h3 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px", opacity: 0.85, color: minimalSidebar ? settings.primaryColor : "inherit" }}>Skills</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {data.skills.map((s, i) => (
                <span key={i} style={{
                  fontSize: "10px", padding: "2px 6px", borderRadius: "3px",
                  background: minimalSidebar ? `${settings.primaryColor}18` : "rgba(255,255,255,0.2)",
                  color: minimalSidebar ? settings.primaryColor : "white",
                  fontWeight: 500
                }}>{s}</span>
              ))}
            </div>
          </div>
        )}
        {data.education?.length > 0 && (
          <div>
            <h3 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px", opacity: 0.85, color: minimalSidebar ? settings.primaryColor : "inherit" }}>Education</h3>
            {data.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: "8px", fontSize: "11px" }}>
                <strong>{edu.degree}</strong>
                <div style={{ opacity: 0.85, fontStyle: "italic" }}>{edu.institution}</div>
                <div style={{ opacity: 0.7, fontSize: "10px" }}>{edu.startDate} – {edu.endDate}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: pad, display: "flex", flexDirection: "column", gap }}>
        {data.professionalSummary && (
          <section>
            <SectionHeading label="Profile" color={settings.primaryColor} style="leftbar" />
            <p style={{ fontSize: "11px", lineHeight: 1.6 }}>{data.professionalSummary}</p>
          </section>
        )}
        {data.experience?.length > 0 && (
          <section>
            <SectionHeading icon={Briefcase} label="Experience" color={settings.primaryColor} style="leftbar" />
            {data.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ fontSize: "12px" }}>{exp.role}</strong>
                  <span style={{ fontSize: "10px", background: "#f3f4f6", padding: "1px 6px", borderRadius: "3px", color: "#6b7280" }}>{exp.startDate} – {exp.endDate}</span>
                </div>
                <div style={{ fontSize: "11px", fontWeight: 600, opacity: 0.8, marginBottom: "4px" }}>{exp.company}</div>
                <p style={{ fontSize: "11px", lineHeight: 1.55 }}>{exp.description}</p>
                {exp.skills?.length > 0 && <SkillChips tags={exp.skills} accentColor={settings.primaryColor} compact />}
              </div>
            ))}
          </section>
        )}
        {data.projects?.length > 0 && (
          <section>
            <SectionHeading icon={Code} label="Projects" color={settings.primaryColor} style="leftbar" />
            {data.projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: "10px" }}>
                <strong style={{ fontSize: "12px" }}>{proj.name}</strong>
                {proj.link && <span style={{ fontSize: "10px", color: "#2563eb", marginLeft: "6px" }}>{proj.link}</span>}
                <p style={{ fontSize: "11px", lineHeight: 1.55, marginTop: "2px" }}>{proj.description}</p>
                {proj.skills?.length > 0 && <SkillChips tags={proj.skills} accentColor={settings.primaryColor} compact />}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
