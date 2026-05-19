"use client";

import { TemplateProps, spacingMap, ProfileImage, ContactRow, SkillChips, SectionHeading, Briefcase, GraduationCap, Code, Award, User } from "./shared";

/* ── General Template variations ───────────────────────────────────────────────
  gen-1  Elegant single column, big name, colored divider
  gen-2  Single column + circular image
  gen-3  Two-section layout (contact left, content right)
  gen-4  Two-section + image
  gen-5  Creative big accent header
──────────────────────────────────────────────────────────────────────────────── */

export default function GenTemplate({ data, settings }: TemplateProps) {
  const sp = spacingMap[settings.spacing ?? "standard"];
  const pad = `${sp.outer}mm`;
  const gap = `${sp.gap}mm`;
  const v = parseInt(settings.activeTemplate.split("-")[1]);

  const showImage = (v === 2 || v === 4) && !!data.image;
  const twoSection = v === 3 || v === 4;
  const creativeHeader = v === 5;

  if (twoSection) {
    return (
      <div style={{ display: "flex", minHeight: "297mm", background: "white", color: settings.fontColor, fontFamily: settings.fontFamily }}>
        {/* Left contact column */}
        <div style={{ width: "32%", padding: pad, borderRight: `3px solid ${settings.primaryColor}`, display: "flex", flexDirection: "column", gap }}>
          {showImage && <ProfileImage src={data.image!} shape={settings.profilePictureShape} className="w-24 h-24" />}
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 800, color: settings.primaryColor, lineHeight: 1.2 }}>{data.name}</h1>
          </div>
          <ContactRow data={data} className="flex flex-col gap-2" itemClass="flex items-center gap-1.5 text-[10px] opacity-75" />
          {data.skills?.length > 0 && (
            <div>
              <h3 style={{ fontSize: "11px", fontWeight: 700, color: settings.primaryColor, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Skills</h3>
              <SkillChips tags={data.skills} accentColor={settings.primaryColor} />
            </div>
          )}
        </div>
        {/* Right main column */}
        <div style={{ flex: 1, padding: pad, display: "flex", flexDirection: "column", gap }}>
          {data.professionalSummary && (
            <section>
              <SectionHeading icon={User} label="About" color={settings.primaryColor} style="underline" />
              <p style={{ fontSize: "11px", lineHeight: 1.65 }}>{data.professionalSummary}</p>
            </section>
          )}
          {data.experience?.length > 0 && (
            <section>
              <SectionHeading icon={Briefcase} label="Experience" color={settings.primaryColor} style="underline" />
              {data.experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong style={{ fontSize: "12px" }}>{exp.role}</strong>
                    <span style={{ fontSize: "10px", opacity: 0.7 }}>{exp.startDate} – {exp.endDate}</span>
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
              <SectionHeading icon={Code} label="Projects" color={settings.primaryColor} style="underline" />
              {data.projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: "10px" }}>
                  <strong style={{ fontSize: "12px" }}>{proj.name}</strong>
                  <p style={{ fontSize: "11px", lineHeight: 1.55, marginTop: "2px" }}>{proj.description}</p>
                  {proj.skills?.length > 0 && <SkillChips tags={proj.skills} accentColor={settings.primaryColor} compact />}
                </div>
              ))}
            </section>
          )}
          {data.education?.length > 0 && (
            <section>
              <SectionHeading icon={GraduationCap} label="Education" color={settings.primaryColor} style="underline" />
              {data.education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <strong style={{ fontSize: "12px" }}>{edu.degree}</strong>
                    <div style={{ fontSize: "11px", opacity: 0.8 }}>{edu.institution}</div>
                  </div>
                  <span style={{ fontSize: "10px", opacity: 0.7 }}>{edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    );
  }

  /* Variations 1, 2, 5 — single column */
  const headerPadV = creativeHeader ? `${sp.inner}mm` : pad;

  return (
    <div style={{ minHeight: "297mm", background: "white", color: settings.fontColor, fontFamily: settings.fontFamily }}>
      <header style={{
        background: creativeHeader ? settings.primaryColor : "transparent",
        color: creativeHeader ? "white" : settings.fontColor,
        padding: `${headerPadV} ${pad}`,
        display: "flex", alignItems: "center", gap: "16px",
      }}>
        {showImage && (
          <ProfileImage
            src={data.image!}
            shape={settings.profilePictureShape}
            className={`w-24 h-24 ${creativeHeader ? "border-2 border-white/30" : ""}`}
          />
        )}
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, lineHeight: 1.15 }}>{data.name}</h1>
          <div style={{ marginTop: "6px" }}>
            <ContactRow
              data={data}
              className="flex flex-wrap gap-x-4 gap-y-1"
              itemClass={`flex items-center gap-1 text-[10px] ${creativeHeader ? "text-white/80" : "opacity-70"}`}
            />
          </div>
        </div>
      </header>

      <div style={{ padding: `0 ${pad} ${pad}`, display: "flex", flexDirection: "column", gap }}>
        {data.professionalSummary && (
          <section>
            <SectionHeading icon={User} label="Professional Profile" color={settings.primaryColor} style="underline" />
            <p style={{ fontSize: "11px", lineHeight: 1.65 }}>{data.professionalSummary}</p>
          </section>
        )}

        {data.experience?.length > 0 && (
          <section>
            <SectionHeading icon={Briefcase} label="Work Experience" color={settings.primaryColor} style="underline" />
            {data.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: "12px", display: "flex", gap: "12px" }}>
                <div style={{ width: "3px", borderRadius: "2px", flexShrink: 0, background: `${settings.primaryColor}40`, marginTop: "3px" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong style={{ fontSize: "12px" }}>{exp.role}</strong>
                    <span style={{ fontSize: "10px", opacity: 0.7 }}>{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: settings.primaryColor, marginBottom: "3px" }}>{exp.company}</div>
                  <p style={{ fontSize: "11px", lineHeight: 1.55 }}>{exp.description}</p>
                  {exp.skills?.length > 0 && <SkillChips tags={exp.skills} accentColor={settings.primaryColor} compact />}
                </div>
              </div>
            ))}
          </section>
        )}

        {data.projects?.length > 0 && (
          <section>
            <SectionHeading icon={Code} label="Notable Projects" color={settings.primaryColor} style="underline" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {data.projects.map((proj) => (
                <div key={proj.id} style={{ padding: "8px 10px", borderRadius: "6px", border: `1px solid ${settings.primaryColor}25`, background: `${settings.primaryColor}05` }}>
                  <strong style={{ fontSize: "12px" }}>{proj.name}</strong>
                  {proj.link && <div style={{ fontSize: "9px", color: "#2563eb", marginBottom: "2px" }}>{proj.link}</div>}
                  <p style={{ fontSize: "10.5px", lineHeight: 1.5, marginTop: "2px" }}>{proj.description}</p>
                  {proj.skills?.length > 0 && <SkillChips tags={proj.skills} accentColor={settings.primaryColor} compact />}
                </div>
              ))}
            </div>
          </section>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap }}>
          {data.education?.length > 0 && (
            <section>
              <SectionHeading icon={GraduationCap} label="Education" color={settings.primaryColor} style="underline" />
              {data.education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: "8px", padding: "6px 8px", background: "#f9fafb", borderRadius: "4px" }}>
                  <strong style={{ fontSize: "12px" }}>{edu.degree}</strong>
                  <div style={{ fontSize: "11px", opacity: 0.8 }}>{edu.institution}</div>
                  <div style={{ fontSize: "10px", opacity: 0.65 }}>{edu.startDate} – {edu.endDate}</div>
                </div>
              ))}
            </section>
          )}
          {data.skills?.length > 0 && (
            <section>
              <SectionHeading icon={Award} label="Skills" color={settings.primaryColor} style="underline" />
              <SkillChips tags={data.skills} accentColor={settings.primaryColor} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
