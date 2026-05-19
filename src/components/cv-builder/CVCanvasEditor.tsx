"use client";

import { useState } from "react";
import { useCVStore } from "@/store/useCVStore";
import {
  X, Check, ChevronUp, ChevronDown, User, Briefcase,
  GraduationCap, Code, Award, Globe, Star, Heart, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCVStore as useStore } from "@/store/useCVStore";
import type { Experience, Education, Project } from "@/store/useCVStore";

// ── Section config ─────────────────────────────────────────────────────────────

type SectionKey = "personal" | "experience" | "education" | "projects" | "skills";

const SECTIONS: { key: SectionKey; label: string; icon: React.ElementType }[] = [
  { key: "personal",   label: "Personal Info", icon: User },
  { key: "experience", label: "Experience",    icon: Briefcase },
  { key: "education",  label: "Education",     icon: GraduationCap },
  { key: "projects",   label: "Projects",      icon: Code },
  { key: "skills",     label: "Skills",        icon: Award },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function makeId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

// ── Editor panels ──────────────────────────────────────────────────────────────

function PersonalPanel() {
  const { cvData, setCVData } = useCVStore();
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Full Name" value={cvData.name} onChange={(v) => setCVData({ name: v })} />
        <Field label="Email" value={cvData.email} onChange={(v) => setCVData({ email: v })} />
        <Field label="Phone" value={cvData.phone} onChange={(v) => setCVData({ phone: v })} />
        <Field label="Location" value={cvData.address} onChange={(v) => setCVData({ address: v })} />
        <Field label="Website" value={cvData.website} onChange={(v) => setCVData({ website: v })} className="col-span-2" />
      </div>
      <ImageField />
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">Professional Summary</Label>
        <Textarea
          rows={4}
          value={cvData.professionalSummary}
          onChange={(e) => setCVData({ professionalSummary: e.target.value })}
          className="text-xs resize-none"
          placeholder="Write a brief professional summary..."
        />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, className = "" }: { label: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <div className={className}>
      <Label className="text-xs font-semibold mb-1 block">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="text-xs h-8" />
    </div>
  );
}

function ImageField() {
  const { cvData, setCVData } = useCVStore();
  const [draft, setDraft] = useState(cvData.image ?? "");
  const apply = () => setCVData({ image: draft });
  return (
    <div>
      <Label className="text-xs font-semibold mb-1.5 block">Profile Photo URL</Label>
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <Input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && apply()} className="text-xs h-8" placeholder="https://..." />
        </div>
        {draft !== (cvData.image ?? "") && (
          <Button size="sm" variant="secondary" onClick={apply} className="h-8 text-xs">Apply</Button>
        )}
        {cvData.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cvData.image} alt="Preview" className="w-10 h-10 rounded-full object-cover border shrink-0" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
        )}
      </div>
    </div>
  );
}

function ExperiencePanel() {
  const { cvData, addArrayItem, removeArrayItem, updateArrayItem, moveArrayItem } = useStore();
  const items = cvData.experience ?? [];

  function add() {
    const blank: Experience = { id: makeId(), company: "New Company", role: "Role Title", startDate: "2024-01", endDate: "Present", description: "", skills: [] };
    addArrayItem("experience", blank);
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((exp, idx) => (
        <div key={exp.id} className="border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-muted/40 border-b">
            <span className="text-xs font-semibold truncate">{exp.role} @ {exp.company}</span>
            <div className="flex gap-1 ml-2 shrink-0">
              <IconBtn onClick={() => moveArrayItem("experience", exp.id, "up")} disabled={idx === 0}><ChevronUp className="w-3 h-3" /></IconBtn>
              <IconBtn onClick={() => moveArrayItem("experience", exp.id, "down")} disabled={idx === items.length - 1}><ChevronDown className="w-3 h-3" /></IconBtn>
              <IconBtn variant="destructive" onClick={() => removeArrayItem("experience", exp.id)}><X className="w-3 h-3" /></IconBtn>
            </div>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            <Field label="Role" value={exp.role} onChange={(v) => updateArrayItem("experience", exp.id, { role: v })} />
            <Field label="Company" value={exp.company} onChange={(v) => updateArrayItem("experience", exp.id, { company: v })} />
            <Field label="Start Date" value={exp.startDate} onChange={(v) => updateArrayItem("experience", exp.id, { startDate: v })} />
            <Field label="End Date" value={exp.endDate} onChange={(v) => updateArrayItem("experience", exp.id, { endDate: v })} />
            <div className="col-span-2">
              <Label className="text-xs font-semibold mb-1 block">Description</Label>
              <Textarea rows={3} className="text-xs resize-none" value={exp.description} onChange={(e) => updateArrayItem("experience", exp.id, { description: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label className="text-xs font-semibold mb-1 block">Skills (comma separated)</Label>
              <Input className="text-xs h-8" value={exp.skills.join(", ")} onChange={(e) => updateArrayItem("experience", exp.id, { skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
            </div>
          </div>
        </div>
      ))}
      <Button size="sm" variant="outline" onClick={add} className="w-full text-xs">+ Add Experience</Button>
    </div>
  );
}

function EducationPanel() {
  const { cvData, addArrayItem, removeArrayItem, updateArrayItem, moveArrayItem } = useStore();
  const items = cvData.education ?? [];

  function add() {
    const blank: Education = { id: makeId(), institution: "University", degree: "Degree", startDate: "2020-09", endDate: "2024-05" };
    addArrayItem("education", blank);
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((edu, idx) => (
        <div key={edu.id} className="border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-muted/40 border-b">
            <span className="text-xs font-semibold truncate">{edu.degree}</span>
            <div className="flex gap-1 ml-2 shrink-0">
              <IconBtn onClick={() => moveArrayItem("education", edu.id, "up")} disabled={idx === 0}><ChevronUp className="w-3 h-3" /></IconBtn>
              <IconBtn onClick={() => moveArrayItem("education", edu.id, "down")} disabled={idx === items.length - 1}><ChevronDown className="w-3 h-3" /></IconBtn>
              <IconBtn variant="destructive" onClick={() => removeArrayItem("education", edu.id)}><X className="w-3 h-3" /></IconBtn>
            </div>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            <Field label="Degree" value={edu.degree} onChange={(v) => updateArrayItem("education", edu.id, { degree: v })} className="col-span-2" />
            <Field label="Institution" value={edu.institution} onChange={(v) => updateArrayItem("education", edu.id, { institution: v })} className="col-span-2" />
            <Field label="Start Date" value={edu.startDate} onChange={(v) => updateArrayItem("education", edu.id, { startDate: v })} />
            <Field label="End Date" value={edu.endDate} onChange={(v) => updateArrayItem("education", edu.id, { endDate: v })} />
          </div>
        </div>
      ))}
      <Button size="sm" variant="outline" onClick={add} className="w-full text-xs">+ Add Education</Button>
    </div>
  );
}

function ProjectsPanel() {
  const { cvData, addArrayItem, removeArrayItem, updateArrayItem, moveArrayItem } = useStore();
  const items = cvData.projects ?? [];

  function add() {
    const blank: Project = { id: makeId(), name: "New Project", description: "", skills: [], link: "" };
    addArrayItem("projects", blank);
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((proj, idx) => (
        <div key={proj.id} className="border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-muted/40 border-b">
            <span className="text-xs font-semibold truncate">{proj.name}</span>
            <div className="flex gap-1 ml-2 shrink-0">
              <IconBtn onClick={() => moveArrayItem("projects", proj.id, "up")} disabled={idx === 0}><ChevronUp className="w-3 h-3" /></IconBtn>
              <IconBtn onClick={() => moveArrayItem("projects", proj.id, "down")} disabled={idx === items.length - 1}><ChevronDown className="w-3 h-3" /></IconBtn>
              <IconBtn variant="destructive" onClick={() => removeArrayItem("projects", proj.id)}><X className="w-3 h-3" /></IconBtn>
            </div>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            <Field label="Project Name" value={proj.name} onChange={(v) => updateArrayItem("projects", proj.id, { name: v })} className="col-span-2" />
            <Field label="Link (optional)" value={proj.link ?? ""} onChange={(v) => updateArrayItem("projects", proj.id, { link: v })} className="col-span-2" />
            <div className="col-span-2">
              <Label className="text-xs font-semibold mb-1 block">Description</Label>
              <Textarea rows={3} className="text-xs resize-none" value={proj.description} onChange={(e) => updateArrayItem("projects", proj.id, { description: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label className="text-xs font-semibold mb-1 block">Tech Stack (comma separated)</Label>
              <Input className="text-xs h-8" value={proj.skills.join(", ")} onChange={(e) => updateArrayItem("projects", proj.id, { skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
            </div>
          </div>
        </div>
      ))}
      <Button size="sm" variant="outline" onClick={add} className="w-full text-xs">+ Add Project</Button>
    </div>
  );
}

function SkillsPanel() {
  const { cvData, setCVData } = useStore();
  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">Skills (comma separated)</Label>
        <Textarea rows={3} className="text-xs resize-none" value={cvData.skills.join(", ")} onChange={(e) => setCVData({ skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {cvData.skills.map((s, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{s}</span>
          ))}
        </div>
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">Languages</Label>
        <Input className="text-xs h-8" value={cvData.languages.join(", ")} onChange={(e) => setCVData({ languages: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
      </div>
      <div>
        <Label className="text-xs font-semibold mb-1.5 block">Interests</Label>
        <Input className="text-xs h-8" value={cvData.interests.join(", ")} onChange={(e) => setCVData({ interests: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
      </div>
    </div>
  );
}

function IconBtn({ onClick, disabled, variant = "ghost", children }: { onClick: () => void; disabled?: boolean; variant?: "ghost" | "destructive"; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-6 h-6 flex items-center justify-center rounded transition-colors disabled:opacity-30 ${
        variant === "destructive" ? "hover:bg-destructive/10 hover:text-destructive" : "hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}

// ── Unused icons kept to suppress build warnings ───────────────────────────────
const _unused = { Globe, Star, Heart, Users };
void _unused;

// ── Main canvas editor ────────────────────────────────────────────────────────

export default function CVCanvasEditor({ onExit }: { onExit: () => void }) {
  const [activeSection, setActiveSection] = useState<SectionKey>("personal");

  const panelContent: Record<SectionKey, React.ReactNode> = {
    personal:   <PersonalPanel />,
    experience: <ExperiencePanel />,
    education:  <EducationPanel />,
    projects:   <ProjectsPanel />,
    skills:     <SkillsPanel />,
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* ── Top bar ── */}
      <div className="h-14 bg-background border-b flex items-center px-5 gap-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Code className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-sm">Edit CV Content</span>
        </div>
        <p className="text-xs text-muted-foreground hidden sm:block">Changes are saved automatically and reflected in the preview</p>
        <div className="flex-1" />
        <Button size="sm" onClick={onExit} className="gap-1.5">
          <Check className="w-4 h-4" /> Done
        </Button>
        <Button size="sm" variant="ghost" onClick={onExit} className="w-9 p-0">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Section nav */}
        <div className="w-48 border-r bg-muted/30 flex flex-col py-3 shrink-0 overflow-y-auto">
          {SECTIONS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left ${
                activeSection === key
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-xl mx-auto">
            <h2 className="text-base font-bold mb-4 flex items-center gap-2">
              {(() => {
                const s = SECTIONS.find(s => s.key === activeSection);
                if (!s) return null;
                const Icon = s.icon;
                return <><Icon className="w-4 h-4 text-primary" /> {s.label}</>;
              })()}
            </h2>
            {panelContent[activeSection]}
          </div>
        </div>
      </div>
    </div>
  );
}
