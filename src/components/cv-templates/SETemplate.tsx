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
  renderCertifications,
  renderLanguages,
  renderSkillCategories,
  renderReferences,
} from "./shared";

/* ── SE Template variations ────────────────────────────────────────────────────
  se-1  Clean left-aligned, timeline experience, no image
  se-2  Same layout + profile image right-aligned
  se-3  Split two-column (contact sidebar), no image
  se-4  Split two-column + image
  se-5  Dark accent header band
──────────────────────────────────────────────────────────────────────────────── */

// ── section renderers (plain functions, not components) ──────────────────────

function renderExperience(data: TemplateProps["data"], settings: TemplateProps["settings"], gap: string) {
  if (!data.experience?.length) return null;
  return (
    <section key="exp" style={{ marginBottom: gap }}>
      <SectionHeading icon={Briefcase} label="Experience" color={settings.primaryColor} style="underline" />
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {data.experience.map((exp) => (
          <div key={exp.id} style={{ paddingLeft: "10px", borderLeft: `2px solid ${settings.primaryColor}40` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <strong style={{ fontSize: "12px" }}>{exp.role}</strong>
              <span style={{ fontSize: "10px", opacity: 0.7 }}>{exp.startDate} – {exp.endDate}</span>
            </div>
            <div style={{ fontSize: "11px", opacity: 0.85, marginBottom: "3px" }}>{exp.company}</div>
            <p style={{ fontSize: "11px", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{exp.description}</p>
            {exp.skills?.length > 0 && (
              <SkillChips tags={exp.skills} accentColor={settings.primaryColor} compact />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function renderProjects(data: TemplateProps["data"], settings: TemplateProps["settings"], gap: string) {
  if (!data.projects?.length) return null;
  return (
    <section key="proj" style={{ marginBottom: gap }}>
      <SectionHeading icon={Code} label="Projects" color={settings.primaryColor} style="underline" />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {data.projects.map((proj) => (
          <div key={proj.id}>
            <strong style={{ fontSize: "12px" }}>{proj.name}</strong>
            {proj.link && (
              <span style={{ fontSize: "10px", color: "#2563eb", marginLeft: "6px" }}>{proj.link}</span>
            )}
            <p style={{ fontSize: "11px", lineHeight: 1.55, marginTop: "2px" }}>{proj.description}</p>
            {proj.skills?.length > 0 && (
              <SkillChips tags={proj.skills} accentColor={settings.primaryColor} compact />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function renderEducation(data: TemplateProps["data"], settings: TemplateProps["settings"], gap: string) {
  if (!data.education?.length) return null;
  return (
    <section key="edu" style={{ marginBottom: gap }}>
      <SectionHeading icon={GraduationCap} label="Education" color={settings.primaryColor} style="underline" />
      {data.education.map((edu) => (
        <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <div>
            <strong style={{ fontSize: "12px" }}>{edu.degree}</strong>
            <div style={{ fontSize: "11px", opacity: 0.8 }}>{edu.institution}</div>
          </div>
          <span style={{ fontSize: "10px", opacity: 0.7 }}>{edu.startDate} – {edu.endDate}</span>
        </div>
      ))}
    </section>
  );
}

function renderSkills(data: TemplateProps["data"], settings: TemplateProps["settings"], gap: string) {
  if (!data.skills?.length) return null;
  return (
    <section key="skills" style={{ marginBottom: gap }}>
      <SectionHeading icon={Award} label="Skills" color={settings.primaryColor} style="underline" />
      <SkillChips tags={data.skills} accentColor={settings.primaryColor} />
    </section>
  );
}

// ── main template ─────────────────────────────────────────────────────────────

export default function SETemplate({ data, settings }: TemplateProps) {
  const sp = spacingMap[settings.spacing ?? "standard"];
  const pad = `${sp.outer}mm`;
  const gap = `${sp.gap}mm`;
  const v = parseInt(settings.activeTemplate.split("-")[1]);

  const showImage = (v === 2 || v === 4) && !!data.image;
  const twoCol = v === 3 || v === 4;
  const darkHeader = v === 5;

  if (twoCol) {
    return (
      <div style={{ display: "flex", minHeight: "297mm", background: "white", color: settings.fontColor, fontFamily: settings.fontFamily }}>
        {/* sidebar */}
        <div style={{ width: "38%", padding: pad, background: `${settings.primaryColor}08`, borderRight: `1px solid ${settings.primaryColor}20`, display: "flex", flexDirection: "column", gap }}>
          {showImage && data.image && (
            <ProfileImage src={data.image} shape={settings.profilePictureShape} showRing={settings.showProfileRing} ringColor={settings.primaryColor} className="w-24 h-24 mb-2" />
          )}
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 800, color: settings.primaryColor, lineHeight: 1.2 }}>{data.name}</h1>
          </div>
          <ContactRow data={data} className="flex flex-col gap-1" itemClass="flex items-center gap-1.5 text-[10px] opacity-80" />
          {settings.showSummary && data.professionalSummary && (
            <div>
              <SectionHeading icon={User} label="Profile" color={settings.primaryColor} style="plain" />
              <p style={{ fontSize: "11px", lineHeight: 1.6 }}>{data.professionalSummary}</p>
            </div>
          )}
          {data.skillCategories?.length ? renderSkillCategories(data, settings, gap) : renderSkills(data, settings, gap)}
          {settings.showCertifications && renderCertifications(data, settings, gap)}
          {settings.showLanguages && renderLanguages(data, settings, gap)}
        </div>
        {/* main */}
        <div style={{ flex: 1, padding: pad, display: "flex", flexDirection: "column" }}>
          {settings.showExperience !== false && renderExperience(data, settings, gap)}
          {settings.showProjects && renderProjects(data, settings, gap)}
          {renderEducation(data, settings, gap)}
          {settings.showReferences && renderReferences(data, settings, gap)}
        </div>
      </div>
    );
  }

  const headerBg = darkHeader ? settings.primaryColor : "transparent";

  return (
    <div style={{ minHeight: "297mm", background: "white", color: settings.fontColor, fontFamily: settings.fontFamily }}>
      <header style={{ background: headerBg, padding: pad, display: "flex", alignItems: "flex-start", gap: "16px" }}>
        {showImage && data.image && (
          <ProfileImage src={data.image} shape={settings.profilePictureShape} showRing={settings.showProfileRing} ringColor={settings.primaryColor} className="w-24 h-24" />
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: darkHeader ? "white" : settings.primaryColor, lineHeight: 1.2 }}>
            {data.name}
          </h1>
          <div style={{ marginTop: "6px" }}>
            <ContactRow data={data} className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]" itemClass="flex items-center gap-1 opacity-80" />
          </div>
        </div>
      </header>

      <div style={{ padding: `0 ${pad} ${pad}`, display: "flex", flexDirection: "column" }}>
        {settings.showSummary && data.professionalSummary && (
          <section style={{ marginBottom: gap }}>
            <SectionHeading
              icon={User}
              label="Summary"
              color={darkHeader ? settings.fontColor : settings.primaryColor}
              style="underline"
            />
            <p style={{ fontSize: "11px", lineHeight: 1.6 }}>{data.professionalSummary}</p>
          </section>
        )}
        {settings.showExperience !== false && renderExperience(data, settings, gap)}
        {settings.showProjects && renderProjects(data, settings, gap)}
        {renderEducation(data, settings, gap)}
        {data.skillCategories?.length ? renderSkillCategories(data, settings, gap) : renderSkills(data, settings, gap)}
        {settings.showCertifications && renderCertifications(data, settings, gap)}
        {settings.showLanguages && renderLanguages(data, settings, gap)}
        {settings.showReferences && renderReferences(data, settings, gap)}
      </div>
    </div>
  );
}
