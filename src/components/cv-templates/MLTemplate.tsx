"use client";

import {
  TemplateProps,
  spacingMap,
  ProfileImage,
  ContactRow,
  SectionHeading,
  Briefcase,
  GraduationCap,
  Code,
  Award,
} from "./shared";


/* ── ML Template variations ────────────────────────────────────────────────────
  ml-1  Academic centered header, serif-style, no image
  ml-2  Centered header + circular image
  ml-3  Formal left-aligned with filled section headings
  ml-4  Formal left-aligned + image
  ml-5  Research-style with publications-like project layout
──────────────────────────────────────────────────────────────────────────────── */

export default function MLTemplate({ data, settings }: TemplateProps) {
  const sp = spacingMap[settings.spacing ?? "standard"];
  const pad = `${sp.outer}mm`;
  const gap = `${sp.gap}mm`;
  const v = parseInt(settings.activeTemplate.split("-")[1]);

  const showImage = (v === 2 || v === 4) && !!data.image;
  const filledHeadings = v === 3 || v === 4;
  const researchStyle = v === 5;
  const headingStyle: "underline" | "filled" | "leftbar" = filledHeadings ? "filled" : "underline";

  return (
    <div style={{ minHeight: "297mm", background: "white", color: settings.fontColor, fontFamily: settings.fontFamily }}>
      {/* Header */}
      <header style={{ padding: pad, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px", borderBottom: `2px solid ${settings.primaryColor}` }}>
        {showImage && <ProfileImage src={data.image!} shape={settings.profilePictureShape} showRing={settings.showProfileRing} ringColor={settings.primaryColor} className="w-24 h-24 mb-2" />}
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: settings.primaryColor }}>{data.name}</h1>
        <ContactRow data={data} className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px]" itemClass="flex items-center gap-1 opacity-75" />
      </header>

      <div style={{ padding: `${pad} ${pad} ${pad}`, display: "flex", flexDirection: "column", gap }}>
        {data.professionalSummary && (
          <section>
            <SectionHeading label="Summary" color={settings.primaryColor} style={headingStyle} />
            <p style={{ fontSize: "11px", lineHeight: 1.65 }}>{data.professionalSummary}</p>
          </section>
        )}

        {data.education?.length > 0 && (
          <section>
            <SectionHeading icon={GraduationCap} label="Education" color={settings.primaryColor} style={headingStyle} />
            {data.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                <div>
                  <strong style={{ fontSize: "12px" }}>{edu.degree}</strong>
                  <div style={{ fontSize: "11px", fontStyle: "italic", opacity: 0.8 }}>{edu.institution}</div>
                </div>
                <span style={{ fontSize: "10px", opacity: 0.7 }}>{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </section>
        )}

        {settings.showExperience !== false && data.experience?.length > 0 && (
          <section>
            <SectionHeading icon={Briefcase} label="Experience" color={settings.primaryColor} style={headingStyle} />
            {data.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ fontSize: "12px" }}>{exp.role}</strong>
                  <span style={{ fontSize: "10px", opacity: 0.7 }}>{exp.startDate} – {exp.endDate}</span>
                </div>
                <div style={{ fontSize: "11px", fontStyle: "italic", opacity: 0.8, marginBottom: "4px" }}>{exp.company}</div>
                <p style={{ fontSize: "11px", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{exp.description}</p>
                {exp.skills?.length > 0 && (
                  <div style={{ fontSize: "10px", marginTop: "3px", opacity: 0.75 }}>
                    <strong>Technologies:</strong> {exp.skills.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {data.projects?.length > 0 && (
          <section>
            <SectionHeading icon={Code} label={researchStyle ? "Publications & Projects" : "Projects"} color={settings.primaryColor} style={headingStyle} />
            {data.projects.map((proj, i) => (
              <div key={proj.id} style={{ marginBottom: "10px", paddingLeft: researchStyle ? "0" : "0" }}>
                {researchStyle ? (
                  <p style={{ fontSize: "11px" }}>
                    [{i + 1}] <strong>{proj.name}</strong>. {proj.description}
                    {proj.link && <> [<span style={{ color: "#2563eb" }}>{proj.link}</span>]</>}
                  </p>
                ) : (
                  <>
                    <strong style={{ fontSize: "12px" }}>{proj.name}</strong>
                    {proj.link && <span style={{ fontSize: "10px", color: "#2563eb", marginLeft: "6px" }}>{proj.link}</span>}
                    <p style={{ fontSize: "11px", lineHeight: 1.55, marginTop: "2px" }}>{proj.description}</p>
                    {proj.skills?.length > 0 && (
                      <div style={{ fontSize: "10px", marginTop: "3px", opacity: 0.75 }}>
                        <strong>Technologies:</strong> {proj.skills.join(", ")}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </section>
        )}

        {data.skills?.length > 0 && (
          <section>
            <SectionHeading icon={Award} label="Technical Skills" color={settings.primaryColor} style={headingStyle} />
            <p style={{ fontSize: "11px", lineHeight: 1.7 }}>{data.skills.join(" · ")}</p>
          </section>
        )}
      </div>
    </div>
  );
}
