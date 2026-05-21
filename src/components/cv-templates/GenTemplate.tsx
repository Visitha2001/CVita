"use client";

import { TemplateProps, spacingMap, ProfileImage, ContactRow, SkillChips, SectionHeading, Briefcase, GraduationCap, Code, Award, User } from "./shared";

/* ── General Template variations ───────────────────────────────────────────────
  gen-1   Elegant single column, big name, colored divider
  gen-2   Single column + circular image
  gen-3   Two-section layout (contact left, content right)
  gen-4   Two-section + image
  gen-5   Creative big accent header
  gen-6   Compact modern single column (dense, no image)
  gen-7   Compact modern + photo
  gen-8   Timeline layout (vertical line + dots)
  gen-9   Timeline + photo
  gen-10  Bold colored sidebar
  gen-11  Bold sidebar + photo
  gen-12  Minimal clean (lots of whitespace, thin rules)
  gen-13  Card-style sections with subtle borders
  gen-14  Card layout + photo
──────────────────────────────────────────────────────────────────────────────── */

/* ── Shared sub-renderers ─────────────────────────────────────────────────── */

function ExpList({ data, settings, timeline }: { data: TemplateProps["data"]; settings: TemplateProps["settings"]; timeline?: boolean }) {
  if (settings.showExperience === false || !data.experience?.length) return null;
  return (
    <>
      {data.experience.map((exp) => (
        <div key={exp.id} style={{ marginBottom: "12px", paddingLeft: timeline ? "18px" : 0, borderLeft: timeline ? `2px solid ${settings.primaryColor}30` : "none", position: "relative" }}>
          {timeline && <span style={{ position: "absolute", left: -5, top: 4, width: 8, height: 8, borderRadius: "50%", background: settings.primaryColor }} />}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong style={{ fontSize: "12px" }}>{exp.role}</strong>
            <span style={{ fontSize: "10px", opacity: 0.7 }}>{exp.startDate} – {exp.endDate}</span>
          </div>
          <div style={{ fontSize: "11px", fontWeight: 600, color: settings.primaryColor, marginBottom: "3px" }}>{exp.company}</div>
          <p style={{ fontSize: "11px", lineHeight: 1.55 }}>{exp.description}</p>
          {exp.skills?.length > 0 && <SkillChips tags={exp.skills} accentColor={settings.primaryColor} compact />}
        </div>
      ))}
    </>
  );
}

function EduList({ data }: { data: TemplateProps["data"] }) {
  if (!data.education?.length) return null;
  return (
    <>
      {data.education.map((edu) => (
        <div key={edu.id} style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
          <div>
            <strong style={{ fontSize: "12px" }}>{edu.degree}</strong>
            <div style={{ fontSize: "11px", opacity: 0.8 }}>{edu.institution}</div>
          </div>
          <span style={{ fontSize: "10px", opacity: 0.7 }}>{edu.startDate} – {edu.endDate}</span>
        </div>
      ))}
    </>
  );
}

function ProjList({ data, settings }: { data: TemplateProps["data"]; settings: TemplateProps["settings"] }) {
  if (!data.projects?.length) return null;
  return (
    <>
      {data.projects.map((proj) => (
        <div key={proj.id} style={{ marginBottom: "10px" }}>
          <strong style={{ fontSize: "12px" }}>{proj.name}</strong>
          {proj.link && <div style={{ fontSize: "9px", color: "#2563eb", marginBottom: "2px" }}>{proj.link}</div>}
          <p style={{ fontSize: "11px", lineHeight: 1.5, marginTop: "2px" }}>{proj.description}</p>
          {proj.skills?.length > 0 && <SkillChips tags={proj.skills} accentColor={settings.primaryColor} compact />}
        </div>
      ))}
    </>
  );
}

/* ── Main component ───────────────────────────────────────────────────────── */

export default function GenTemplate({ data, settings }: TemplateProps) {
  const sp = spacingMap[settings.spacing ?? "standard"];
  const pad = `${sp.outer}mm`;
  const gap = `${sp.gap}mm`;
  const v = parseInt(settings.activeTemplate.split("-")[1]);

  /* ── gen-3 / gen-4: Split two-section ───────────────────────────────────── */
  if (v === 3 || v === 4) {
    const showImage = v === 4 && !!data.image;
    return (
      <div style={{ display: "flex", minHeight: "297mm", background: "white", color: settings.fontColor, fontFamily: settings.fontFamily }}>
        <div style={{ width: "32%", padding: pad, borderRight: `3px solid ${settings.primaryColor}`, display: "flex", flexDirection: "column", gap }}>
          {showImage && <ProfileImage src={data.image!} shape={settings.profilePictureShape} showRing={settings.showProfileRing} ringColor={settings.primaryColor} className="w-24 h-24" />}
          <div><h1 style={{ fontSize: "20px", fontWeight: 800, color: settings.primaryColor, lineHeight: 1.2 }}>{data.name}</h1></div>
          <ContactRow data={data} className="flex flex-col gap-2" itemClass="flex items-center gap-1.5 text-[10px] opacity-75" />
          {data.skills?.length > 0 && (
            <div>
              <h3 style={{ fontSize: "11px", fontWeight: 700, color: settings.primaryColor, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Skills</h3>
              <SkillChips tags={data.skills} accentColor={settings.primaryColor} />
            </div>
          )}
        </div>
        <div style={{ flex: 1, padding: pad, display: "flex", flexDirection: "column", gap }}>
          {data.professionalSummary && <section><SectionHeading icon={User} label="About" color={settings.primaryColor} style="underline" /><p style={{ fontSize: "11px", lineHeight: 1.65 }}>{data.professionalSummary}</p></section>}
          {settings.showExperience !== false && data.experience?.length > 0 && <section><SectionHeading icon={Briefcase} label="Experience" color={settings.primaryColor} style="underline" /><ExpList data={data} settings={settings} /></section>}
          {data.projects?.length > 0 && <section><SectionHeading icon={Code} label="Projects" color={settings.primaryColor} style="underline" /><ProjList data={data} settings={settings} /></section>}
          {data.education?.length > 0 && <section><SectionHeading icon={GraduationCap} label="Education" color={settings.primaryColor} style="underline" /><EduList data={data} /></section>}
        </div>
      </div>
    );
  }

  /* ── gen-5: Creative big accent header ──────────────────────────────────── */
  if (v === 5) {
    return (
      <div style={{ minHeight: "297mm", background: "white", color: settings.fontColor, fontFamily: settings.fontFamily }}>
        <header style={{ background: settings.primaryColor, color: "white", padding: `${sp.inner}mm ${pad}`, display: "flex", alignItems: "center", gap: "16px", marginBottom: "25px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, lineHeight: 1.15 }}>{data.name}</h1>
            <div style={{ marginTop: "6px" }}><ContactRow data={data} className="flex flex-wrap gap-x-4 gap-y-1" itemClass="flex items-center gap-1 text-[10px] text-white/80" /></div>
          </div>
        </header>
        <div style={{ padding: `0 ${pad} ${pad}`, display: "flex", flexDirection: "column", gap }}>
          {data.professionalSummary && <section><SectionHeading icon={User} label="Professional Profile" color={settings.primaryColor} style="underline" /><p style={{ fontSize: "11px", lineHeight: 1.65 }}>{data.professionalSummary}</p></section>}
          {settings.showExperience !== false && data.experience?.length > 0 && <section><SectionHeading icon={Briefcase} label="Work Experience" color={settings.primaryColor} style="underline" /><ExpList data={data} settings={settings} /></section>}
          {data.projects?.length > 0 && <section><SectionHeading icon={Code} label="Notable Projects" color={settings.primaryColor} style="underline" /><ProjList data={data} settings={settings} /></section>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap }}>
            {data.education?.length > 0 && <section><SectionHeading icon={GraduationCap} label="Education" color={settings.primaryColor} style="underline" /><EduList data={data} /></section>}
            {data.skills?.length > 0 && <section><SectionHeading icon={Award} label="Skills" color={settings.primaryColor} style="underline" /><SkillChips tags={data.skills} accentColor={settings.primaryColor} /></section>}
          </div>
        </div>
      </div>
    );
  }

  /* ── gen-6 / gen-7: Compact modern ─────────────────────────────────────── */
  if (v === 6 || v === 7) {
    const showImage = v === 7 && !!data.image;
    return (
      <div style={{ minHeight: "297mm", background: "white", color: settings.fontColor, fontFamily: settings.fontFamily, padding: pad }}>
        <header style={{ display: "flex", alignItems: "center", gap: "14px", borderBottom: `1px solid ${settings.primaryColor}40`, paddingBottom: "10px", marginBottom: gap }}>
          {showImage && <ProfileImage src={data.image!} shape={settings.profilePictureShape} showRing={settings.showProfileRing} ringColor={settings.primaryColor} className="w-16 h-16" />}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: settings.primaryColor, letterSpacing: "-0.02em" }}>{data.name}</h1>
            <ContactRow data={data} className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1" itemClass="flex items-center gap-1 text-[9px] opacity-70" />
          </div>
        </header>
        {data.professionalSummary && <p style={{ fontSize: "10.5px", lineHeight: 1.6, marginBottom: gap, borderLeft: `3px solid ${settings.primaryColor}`, paddingLeft: "10px" }}>{data.professionalSummary}</p>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap }}>
            {settings.showExperience !== false && data.experience?.length > 0 && <section><SectionHeading icon={Briefcase} label="Experience" color={settings.primaryColor} style="leftbar" /><ExpList data={data} settings={settings} /></section>}
            {data.projects?.length > 0 && <section><SectionHeading icon={Code} label="Projects" color={settings.primaryColor} style="leftbar" /><ProjList data={data} settings={settings} /></section>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap }}>
            {data.education?.length > 0 && <section><SectionHeading icon={GraduationCap} label="Education" color={settings.primaryColor} style="leftbar" /><EduList data={data} /></section>}
            {data.skills?.length > 0 && <section><SectionHeading icon={Award} label="Skills" color={settings.primaryColor} style="leftbar" /><SkillChips tags={data.skills} accentColor={settings.primaryColor} /></section>}
          </div>
        </div>
      </div>
    );
  }

  /* ── gen-8 / gen-9: Timeline layout ────────────────────────────────────── */
  if (v === 8 || v === 9) {
    const showImage = v === 9 && !!data.image;
    return (
      <div style={{ minHeight: "297mm", background: "white", color: settings.fontColor, fontFamily: settings.fontFamily }}>
        <header style={{ padding: pad, display: "flex", alignItems: "center", gap: "16px", borderBottom: `3px solid ${settings.primaryColor}` }}>
          {showImage && <ProfileImage src={data.image!} shape={settings.profilePictureShape} showRing={settings.showProfileRing} ringColor={settings.primaryColor} className="w-20 h-20" />}
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: 800, color: settings.primaryColor }}>{data.name}</h1>
            <ContactRow data={data} className="flex flex-wrap gap-x-4 gap-y-1 mt-1" itemClass="flex items-center gap-1 text-[10px] opacity-70" />
          </div>
        </header>
        <div style={{ padding: pad, display: "flex", flexDirection: "column", gap }}>
          {data.professionalSummary && <section><SectionHeading icon={User} label="Profile" color={settings.primaryColor} style="plain" /><p style={{ fontSize: "11px", lineHeight: 1.65 }}>{data.professionalSummary}</p></section>}
          {settings.showExperience !== false && data.experience?.length > 0 && <section><SectionHeading icon={Briefcase} label="Experience" color={settings.primaryColor} style="plain" /><ExpList data={data} settings={settings} timeline /></section>}
          {data.projects?.length > 0 && <section><SectionHeading icon={Code} label="Projects" color={settings.primaryColor} style="plain" /><ProjList data={data} settings={settings} /></section>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap }}>
            {data.education?.length > 0 && <section><SectionHeading icon={GraduationCap} label="Education" color={settings.primaryColor} style="plain" /><EduList data={data} /></section>}
            {data.skills?.length > 0 && <section><SectionHeading icon={Award} label="Skills" color={settings.primaryColor} style="plain" /><SkillChips tags={data.skills} accentColor={settings.primaryColor} /></section>}
          </div>
        </div>
      </div>
    );
  }

  /* ── gen-10 / gen-11: Bold colored sidebar ──────────────────────────────── */
  if (v === 10 || v === 11) {
    const showImage = v === 11 && !!data.image;
    return (
      <div style={{ display: "flex", minHeight: "297mm", background: "white", color: settings.fontColor, fontFamily: settings.fontFamily }}>
        <div style={{ width: "34%", padding: pad, background: settings.primaryColor, color: "white", display: "flex", flexDirection: "column", gap }}>
          {showImage && <ProfileImage src={data.image!} shape={settings.profilePictureShape} showRing={settings.showProfileRing} ringColor={settings.primaryColor} className="w-24 h-24 border-2 border-white/30" />}
          <h1 style={{ fontSize: "20px", fontWeight: 800, lineHeight: 1.2 }}>{data.name}</h1>
          <ContactRow data={data} className="flex flex-col gap-1.5" itemClass="flex items-center gap-1.5 text-[10px] text-white/80" />
          {data.skills?.length > 0 && (
            <div>
              <h3 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px", opacity: 0.7 }}>Skills</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {data.skills.map((s, i) => <span key={i} style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "3px", background: "rgba(255,255,255,0.2)", fontWeight: 500 }}>{s}</span>)}
              </div>
            </div>
          )}
          {data.education?.length > 0 && (
            <div>
              <h3 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px", opacity: 0.7 }}>Education</h3>
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
        <div style={{ flex: 1, padding: pad, display: "flex", flexDirection: "column", gap }}>
          {data.professionalSummary && <section><SectionHeading icon={User} label="About" color={settings.primaryColor} style="filled" /><p style={{ fontSize: "11px", lineHeight: 1.65 }}>{data.professionalSummary}</p></section>}
          {settings.showExperience !== false && data.experience?.length > 0 && <section><SectionHeading icon={Briefcase} label="Experience" color={settings.primaryColor} style="filled" /><ExpList data={data} settings={settings} /></section>}
          {data.projects?.length > 0 && <section><SectionHeading icon={Code} label="Projects" color={settings.primaryColor} style="filled" /><ProjList data={data} settings={settings} /></section>}
        </div>
      </div>
    );
  }

  /* ── gen-12: Minimal clean ──────────────────────────────────────────────── */
  if (v === 12) {
    return (
      <div style={{ minHeight: "297mm", background: "white", color: settings.fontColor, fontFamily: settings.fontFamily, padding: `${parseInt(sp.outer) + 4}mm` }}>
        <header style={{ textAlign: "center", marginBottom: gap }}>
          <h1 style={{ fontSize: "30px", fontWeight: 300, letterSpacing: "0.12em", textTransform: "uppercase", color: settings.primaryColor }}>{data.name}</h1>
          <div style={{ width: "50px", height: "1px", background: settings.primaryColor, margin: "10px auto" }} />
          <ContactRow data={data} className="flex flex-wrap justify-center gap-x-5 gap-y-1 mt-2" itemClass="flex items-center gap-1 text-[10px] opacity-60" />
        </header>
        {data.professionalSummary && <p style={{ fontSize: "11px", lineHeight: 1.7, textAlign: "center", maxWidth: "85%", margin: `0 auto ${gap}`, opacity: 0.85 }}>{data.professionalSummary}</p>}
        <div style={{ display: "flex", flexDirection: "column", gap }}>
          {settings.showExperience !== false && data.experience?.length > 0 && <section><h2 style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: settings.primaryColor, borderBottom: `1px solid ${settings.primaryColor}25`, paddingBottom: "4px", marginBottom: "10px" }}>Experience</h2><ExpList data={data} settings={settings} /></section>}
          {data.projects?.length > 0 && <section><h2 style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: settings.primaryColor, borderBottom: `1px solid ${settings.primaryColor}25`, paddingBottom: "4px", marginBottom: "10px" }}>Projects</h2><ProjList data={data} settings={settings} /></section>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap }}>
            {data.education?.length > 0 && <section><h2 style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: settings.primaryColor, borderBottom: `1px solid ${settings.primaryColor}25`, paddingBottom: "4px", marginBottom: "10px" }}>Education</h2><EduList data={data} /></section>}
            {data.skills?.length > 0 && <section><h2 style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: settings.primaryColor, borderBottom: `1px solid ${settings.primaryColor}25`, paddingBottom: "4px", marginBottom: "10px" }}>Skills</h2><SkillChips tags={data.skills} accentColor={settings.primaryColor} /></section>}
          </div>
        </div>
      </div>
    );
  }

  /* ── gen-13 / gen-14: Card layout ──────────────────────────────────────── */
  if (v === 13 || v === 14) {
    const showImage = v === 14 && !!data.image;
    const cardStyle = { padding: "12px 14px", borderRadius: "8px", border: `1px solid ${settings.primaryColor}20`, background: `${settings.primaryColor}04` };
    return (
      <div style={{ minHeight: "297mm", background: "white", color: settings.fontColor, fontFamily: settings.fontFamily, padding: pad }}>
        <header style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: gap }}>
          {showImage && <ProfileImage src={data.image!} shape={settings.profilePictureShape} showRing={settings.showProfileRing} ringColor={settings.primaryColor} className="w-20 h-20" />}
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: 800, color: settings.primaryColor }}>{data.name}</h1>
            <ContactRow data={data} className="flex flex-wrap gap-x-4 gap-y-1 mt-1" itemClass="flex items-center gap-1 text-[10px] opacity-70" />
          </div>
        </header>
        {data.professionalSummary && <div style={{ ...cardStyle, marginBottom: gap }}><SectionHeading icon={User} label="Profile" color={settings.primaryColor} style="leftbar" /><p style={{ fontSize: "11px", lineHeight: 1.65 }}>{data.professionalSummary}</p></div>}
        <div style={{ display: "flex", flexDirection: "column", gap }}>
          {settings.showExperience !== false && data.experience?.length > 0 && <div style={cardStyle}><SectionHeading icon={Briefcase} label="Experience" color={settings.primaryColor} style="leftbar" /><ExpList data={data} settings={settings} /></div>}
          {data.projects?.length > 0 && <div style={cardStyle}><SectionHeading icon={Code} label="Projects" color={settings.primaryColor} style="leftbar" /><ProjList data={data} settings={settings} /></div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap }}>
            {data.education?.length > 0 && <div style={cardStyle}><SectionHeading icon={GraduationCap} label="Education" color={settings.primaryColor} style="leftbar" /><EduList data={data} /></div>}
            {data.skills?.length > 0 && <div style={cardStyle}><SectionHeading icon={Award} label="Skills" color={settings.primaryColor} style="leftbar" /><SkillChips tags={data.skills} accentColor={settings.primaryColor} /></div>}
          </div>
        </div>
      </div>
    );
  }

  /* ── gen-1 / gen-2: Elegant single column (default) ────────────────────── */
  const showImage = v === 2 && !!data.image;
  return (
    <div style={{ minHeight: "297mm", background: "white", color: settings.fontColor, fontFamily: settings.fontFamily }}>
      <header style={{ padding: `${sp.inner}mm ${pad}`, display: "flex", alignItems: "center", gap: "16px" }}>
        {showImage && <ProfileImage src={data.image!} shape={settings.profilePictureShape} showRing={settings.showProfileRing} ringColor={settings.primaryColor} className="w-24 h-24" />}
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, lineHeight: 1.15 }}>{data.name}</h1>
          <div style={{ marginTop: "6px" }}><ContactRow data={data} className="flex flex-wrap gap-x-4 gap-y-1" itemClass="flex items-center gap-1 text-[10px] opacity-70" /></div>
        </div>
      </header>
      <div style={{ padding: `0 ${pad} ${pad}`, display: "flex", flexDirection: "column", gap }}>
        {data.professionalSummary && <section><SectionHeading icon={User} label="Professional Profile" color={settings.primaryColor} style="underline" /><p style={{ fontSize: "11px", lineHeight: 1.65 }}>{data.professionalSummary}</p></section>}
        {settings.showExperience !== false && data.experience?.length > 0 && (
          <section>
            <SectionHeading icon={Briefcase} label="Work Experience" color={settings.primaryColor} style="underline" />
            {data.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: "12px", display: "flex", gap: "12px" }}>
                <div style={{ width: "3px", borderRadius: "2px", flexShrink: 0, background: `${settings.primaryColor}40`, marginTop: "3px" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><strong style={{ fontSize: "12px" }}>{exp.role}</strong><span style={{ fontSize: "10px", opacity: 0.7 }}>{exp.startDate} – {exp.endDate}</span></div>
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
          {data.skills?.length > 0 && <section><SectionHeading icon={Award} label="Skills" color={settings.primaryColor} style="underline" /><SkillChips tags={data.skills} accentColor={settings.primaryColor} /></section>}
        </div>
      </div>
    </div>
  );
}
