"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { useCVStore, type CVData, type SkillCategory } from "@/store/useCVStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Trash2,
  Plus,
  ChevronUp,
  ChevronDown,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Sparkles,
  ImageIcon,
  CheckCircle2,
  Eraser,
  FolderOpen,
  Users,
  Award,
  Languages,
  X,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

// ── helpers ──────────────────────────────────────────────────────────────────

type ArrayKey = "experience" | "education" | "projects";

function ItemControls({
  id,
  arrayKey,
  isFirst,
  isLast,
}: {
  id: string;
  arrayKey: ArrayKey;
  isFirst: boolean;
  isLast: boolean;
}) {
  const { moveArrayItem, removeArrayItem } = useCVStore();
  return (
    <div className="flex items-center gap-1">
      <button
        disabled={isFirst}
        onClick={() => moveArrayItem(arrayKey, id, "up")}
        className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition"
        title="Move up"
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      <button
        disabled={isLast}
        onClick={() => moveArrayItem(arrayKey, id, "down")}
        className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition"
        title="Move down"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
      <button
        onClick={() => removeArrayItem(arrayKey, id)}
        className="p-1 rounded hover:bg-destructive/10 text-destructive transition"
        title="Remove"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── section header ────────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  label,
  count,
}: {
  icon: React.ElementType;
  label: string;
  count?: number;
}) {
  return (
    <span className="flex items-center gap-2 font-semibold text-base">
      <Icon className="w-4 h-4 text-primary" />
      {label}
      {count !== undefined && count > 0 && (
        <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5 rounded-full">
          {count}
        </Badge>
      )}
    </span>
  );
}

// ── image field with preview ──────────────────────────────────────────────────

function ImageField() {
  const { cvData, setCVData } = useCVStore();
  const [draft, setDraft] = useState(cvData.image ?? "");
  const [applied, setApplied] = useState(false);

  const apply = () => {
    setCVData({ image: draft });
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-primary" />
        Profile Picture URL
      </Label>

      {/* preview */}
      {draft && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={draft}
          alt="Profile preview"
          className="w-20 h-20 rounded-full object-cover border-2 border-primary/30 shadow"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}

      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setApplied(false);
          }}
          placeholder="https://example.com/photo.jpg"
          className="flex-1"
        />
        <Button
          size="sm"
          variant={applied ? "secondary" : "default"}
          onClick={apply}
          className="shrink-0 gap-1.5"
        >
          {applied ? (
            <>
              <CheckCircle2 className="w-4 h-4" /> Applied
            </>
          ) : (
            "Apply"
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Paste a public image URL and click Apply to show in the preview.
      </p>
    </div>
  );
}

// ── Tag chip input ────────────────────────────────────────────────────────────

function TagInput({
  tags,
  onChange,
  placeholder = "Type and press Enter…",
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setDraft("");
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  return (
    <div
      className="flex flex-wrap gap-1.5 p-2 rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0 min-h-[36px] cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
            className="hover:text-destructive transition-colors"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKey}
        onBlur={commit}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[100px] bg-transparent text-xs outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

// ── Skill sub-categories (optional) ──────────────────────────────────────────

function SkillCategoriesEditor() {
  const { cvData, setCVData } = useCVStore();
  const { t } = useI18n();
  const cats = cvData.skillCategories ?? [];
  const [showHelp, setShowHelp] = useState(false);

  function addCategory() {
    const blank: SkillCategory = { id: Date.now().toString(), name: "", skills: [] };
    setCVData({ skillCategories: [...cats, blank] });
  }

  function updateCat(id: string, patch: Partial<SkillCategory>) {
    setCVData({ skillCategories: cats.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  }

  function removeCat(id: string) {
    setCVData({ skillCategories: cats.filter((c) => c.id !== id) });
  }

  return (
    <div className="border-t pt-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">{t.skillSubCategories}</span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">Optional</Badge>
        </div>
        <button
          className="text-xs text-muted-foreground underline underline-offset-2"
          onClick={() => setShowHelp((h) => !h)}
        >
          {showHelp ? "hide" : "what is this?"}
        </button>
      </div>

      {showHelp && (
        <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
          Group your skills into named categories (e.g. &ldquo;Programming Languages&rdquo;, &ldquo;Frameworks&rdquo;).
          Type a skill name and press <kbd className="px-1 py-0.5 rounded bg-muted text-[10px]">Enter</kbd> or comma to add it.
          Click <strong>&times;</strong> to remove a tag.
        </p>
      )}

      {cats.map((cat) => (
        <div key={cat.id} className="rounded-xl border bg-muted/30 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Input
              value={cat.name}
              onChange={(e) => updateCat(cat.id, { name: e.target.value })}
              className="h-7 text-xs font-semibold flex-1"
              placeholder="Category name…"
            />
            <button onClick={() => removeCat(cat.id)} className="p-1 rounded hover:bg-destructive/10 text-destructive transition shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <TagInput
            tags={cat.skills}
            onChange={(skills) => updateCat(cat.id, { skills })}
            placeholder="Add skill, press Enter…"
          />
        </div>
      ))}

      <Button variant="outline" size="sm" className="gap-2 w-full text-xs" onClick={addCategory}>
        <Plus className="w-3.5 h-3.5" /> {t.addCategory}
      </Button>
    </div>
  );
}

// ── main form ─────────────────────────────────────────────────────────────────

export default function CVDataForm() {
  const { cvData, setCVData, clearData } = useCVStore();
  const { t } = useI18n();
  const [confirmClear, setConfirmClear] = useState(false);

  function handleField(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setCVData({ [name]: value } as Partial<CVData>);
  }

  function updateItem(key: ArrayKey, id: string, patch: Record<string, unknown>) {
    useCVStore.getState().updateArrayItem(key, id, patch);
  }

  function addItem(key: ArrayKey, template: Record<string, unknown>) {
    type Item = CVData[ArrayKey] extends (infer U)[] ? U : never;
    useCVStore.getState().addArrayItem(key, { id: Date.now().toString(), ...template } as Item);
  }

  function handleClear() {
    if (!confirmClear) { setConfirmClear(true); setTimeout(() => setConfirmClear(false), 3000); return; }
    clearData();
    setConfirmClear(false);
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">

      {/* ── Header row with clear button ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight">CV Data</h2>
        <Button
          size="sm"
          variant={confirmClear ? "destructive" : "outline"}
          onClick={handleClear}
          className="gap-1.5 text-xs"
        >
          <Eraser className="w-3.5 h-3.5" />
          {confirmClear ? t.clickToConfirm : t.clearAllFields}
        </Button>
      </div>

      {/* ── Personal Details ── */}
      <section className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-transparent px-4 sm:px-5 py-3 sm:py-4 border-b flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold tracking-tight">{t.personalDetails}</h2>
        </div>
        <div className="px-4 sm:px-5 py-4 sm:py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImageField />

          {/* name row */}
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="name">{t.fullName}</Label>
            <Input id="name" name="name" value={cvData.name} onChange={handleField} placeholder="Jane Doe" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">{t.email}</Label>
            <Input id="email" name="email" type="email" value={cvData.email} onChange={handleField} placeholder="jane@example.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">{t.phone}</Label>
            <Input id="phone" name="phone" value={cvData.phone} onChange={handleField} placeholder="+1 234 567 8900" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="website">{t.website}</Label>
            <Input id="website" name="website" value={cvData.website} onChange={handleField} placeholder="https://janedoe.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">{t.address}</Label>
            <Input id="address" name="address" value={cvData.address} onChange={handleField} placeholder="City, Country" />
          </div>
        </div>
      </section>

      {/* ── Professional Summary ── */}
      <section className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-transparent px-4 sm:px-5 py-3 sm:py-4 border-b flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold tracking-tight">{t.professionalSummary}</h2>
        </div>
        <div className="px-4 sm:px-5 py-4 sm:py-5">
          <Textarea
            id="professionalSummary"
            name="professionalSummary"
            value={cvData.professionalSummary}
            onChange={handleField}
            placeholder="Write a brief summary of your professional background…"
            className="h-32 resize-none"
          />
        </div>
      </section>

      {/* ── Dynamic Sections ── */}
      <Accordion className="w-full space-y-3">

        {/* Experience */}
        <AccordionItem value="experience" className="rounded-2xl border bg-card shadow-sm overflow-hidden px-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold">{t.experience} ({cvData.experience.length})</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5 space-y-4">
            {cvData.experience.map((exp, idx) => (
              <div key={exp.id} className="rounded-xl border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">
                    {exp.role || "New Entry"} {exp.company ? `@ ${exp.company}` : ""}
                  </span>
                  <div className="flex items-center gap-1">
                    <button disabled={idx === 0} onClick={() => useCVStore.getState().moveArrayItem("experience", exp.id, "up")} className="p-1 rounded hover:bg-muted disabled:opacity-30 transition"><ChevronUp className="w-4 h-4" /></button>
                    <button disabled={idx === cvData.experience.length - 1} onClick={() => useCVStore.getState().moveArrayItem("experience", exp.id, "down")} className="p-1 rounded hover:bg-muted disabled:opacity-30 transition"><ChevronDown className="w-4 h-4" /></button>
                    <button onClick={() => useCVStore.getState().removeArrayItem("experience", exp.id)} className="p-1 rounded hover:bg-destructive/10 text-destructive transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>{t.company}</Label>
                    <Input value={exp.company} onChange={(e) => updateItem("experience", exp.id, { company: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>{t.role}</Label>
                    <Input value={exp.role} onChange={(e) => updateItem("experience", exp.id, { role: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>{t.startDate}</Label>
                    <Input type="month" value={exp.startDate} onChange={(e) => updateItem("experience", exp.id, { startDate: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>{t.endDate}</Label>
                    <Input value={exp.endDate} onChange={(e) => updateItem("experience", exp.id, { endDate: e.target.value })} placeholder={t.present} />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label>{t.description}</Label>
                    <Textarea value={exp.description} onChange={(e) => updateItem("experience", exp.id, { description: e.target.value })} className="resize-none h-24" />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label>{t.skills} <span className="text-muted-foreground text-xs">(comma separated)</span></Label>
                    <Input
                      value={exp.skills?.join(", ")}
                      onChange={(e) => updateItem("experience", exp.id, { skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => addItem("experience", { company: "", role: "", startDate: "", endDate: "", description: "", skills: [] })}
            >
              <Plus className="w-4 h-4" /> {t.addExperience}
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Education */}
        <AccordionItem value="education" className="rounded-2xl border bg-card shadow-sm overflow-hidden px-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold">{t.education} ({cvData.education.length})</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5 space-y-4">
            {cvData.education.map((edu, idx) => (
              <div key={edu.id} className="rounded-xl border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">
                    {edu.degree || "New Entry"} {edu.institution ? `— ${edu.institution}` : ""}
                  </span>
                  <div className="flex items-center gap-1">
                    <button disabled={idx === 0} onClick={() => useCVStore.getState().moveArrayItem("education", edu.id, "up")} className="p-1 rounded hover:bg-muted disabled:opacity-30 transition"><ChevronUp className="w-4 h-4" /></button>
                    <button disabled={idx === cvData.education.length - 1} onClick={() => useCVStore.getState().moveArrayItem("education", edu.id, "down")} className="p-1 rounded hover:bg-muted disabled:opacity-30 transition"><ChevronDown className="w-4 h-4" /></button>
                    <button onClick={() => useCVStore.getState().removeArrayItem("education", edu.id)} className="p-1 rounded hover:bg-destructive/10 text-destructive transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>{t.institution}</Label>
                    <Input value={edu.institution} onChange={(e) => updateItem("education", edu.id, { institution: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>{t.degree}</Label>
                    <Input value={edu.degree} onChange={(e) => updateItem("education", edu.id, { degree: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>{t.startDate}</Label>
                    <Input type="month" value={edu.startDate} onChange={(e) => updateItem("education", edu.id, { startDate: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>{t.endDate}</Label>
                    <Input type="month" value={edu.endDate} onChange={(e) => updateItem("education", edu.id, { endDate: e.target.value })} />
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => addItem("education", { institution: "", degree: "", startDate: "", endDate: "" })}
            >
              <Plus className="w-4 h-4" /> {t.addEducation}
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Projects */}
        <AccordionItem value="projects" className="rounded-2xl border bg-card shadow-sm overflow-hidden px-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold">{t.projects} ({cvData.projects.length})</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5 space-y-4">
            {cvData.projects.map((proj, idx) => (
              <div key={proj.id} className="rounded-xl border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">{proj.name || "New Project"}</span>
                  <div className="flex items-center gap-1">
                    <button disabled={idx === 0} onClick={() => useCVStore.getState().moveArrayItem("projects", proj.id, "up")} className="p-1 rounded hover:bg-muted disabled:opacity-30 transition"><ChevronUp className="w-4 h-4" /></button>
                    <button disabled={idx === cvData.projects.length - 1} onClick={() => useCVStore.getState().moveArrayItem("projects", proj.id, "down")} className="p-1 rounded hover:bg-muted disabled:opacity-30 transition"><ChevronDown className="w-4 h-4" /></button>
                    <button onClick={() => useCVStore.getState().removeArrayItem("projects", proj.id)} className="p-1 rounded hover:bg-destructive/10 text-destructive transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <Label>{t.projectName}</Label>
                    <Input value={proj.name} onChange={(e) => updateItem("projects", proj.id, { name: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>{t.projectUrl} <span className="text-muted-foreground text-xs">{t.optional}</span></Label>
                    <Input value={proj.link ?? ""} onChange={(e) => updateItem("projects", proj.id, { link: e.target.value })} placeholder="https://github.com/…" />
                  </div>
                  <div className="space-y-1">
                    <Label>{t.description}</Label>
                    <Textarea value={proj.description} onChange={(e) => updateItem("projects", proj.id, { description: e.target.value })} className="resize-none h-24" />
                  </div>
                  <div className="space-y-1">
                    <Label>Skills <span className="text-muted-foreground text-xs">(comma separated)</span></Label>
                    <Input
                      value={proj.skills?.join(", ")}
                      onChange={(e) => updateItem("projects", proj.id, { skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => addItem("projects", { name: "", description: "", skills: [], link: "" })}
            >
              <Plus className="w-4 h-4" /> Add Project
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem value="skills" className="rounded-2xl border bg-card shadow-sm overflow-hidden px-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <SectionHeader icon={Sparkles} label={t.skills} count={cvData.skills.filter(Boolean).length} />
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5 space-y-4">
            {/* Flat skills */}
            <div className="space-y-2">
              <Label>{t.allSkills} <span className="text-muted-foreground text-xs">(comma separated)</span></Label>
              <Textarea
                value={cvData.skills.join(", ")}
                onChange={(e) => setCVData({ skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                placeholder="JavaScript, React, Node.js…"
                className="resize-none h-20"
              />
              {cvData.skills.filter(Boolean).length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cvData.skills.filter(Boolean).map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                </div>
              )}
            </div>
            {/* Skill sub-categories (optional) */}
            <SkillCategoriesEditor />
          </AccordionContent>
        </AccordionItem>

        {/* Certifications */}
        <AccordionItem value="certifications" className="rounded-2xl border bg-card shadow-sm overflow-hidden px-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <SectionHeader icon={Award} label={t.certifications} count={cvData.certifications.length} />
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5 space-y-4">
            {cvData.certifications.map((cert, idx) => (
              <div key={cert.id} className="rounded-xl border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">{cert.name || "New Certification"}</span>
                  <div className="flex items-center gap-1">
                    <button disabled={idx === 0} onClick={() => useCVStore.getState().moveArrayItem("certifications", cert.id, "up")} className="p-1 rounded hover:bg-muted disabled:opacity-30 transition"><ChevronUp className="w-4 h-4" /></button>
                    <button disabled={idx === cvData.certifications.length - 1} onClick={() => useCVStore.getState().moveArrayItem("certifications", cert.id, "down")} className="p-1 rounded hover:bg-muted disabled:opacity-30 transition"><ChevronDown className="w-4 h-4" /></button>
                    <button onClick={() => useCVStore.getState().removeArrayItem("certifications", cert.id)} className="p-1 rounded hover:bg-destructive/10 text-destructive transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <Label>Certification Name</Label>
                    <Input value={cert.name} onChange={(e) => useCVStore.getState().updateArrayItem("certifications", cert.id, { name: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Issuer</Label>
                    <Input value={cert.issuer} onChange={(e) => useCVStore.getState().updateArrayItem("certifications", cert.id, { issuer: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Date</Label>
                    <Input type="month" value={cert.date} onChange={(e) => useCVStore.getState().updateArrayItem("certifications", cert.id, { date: e.target.value })} />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="gap-2" onClick={() => addItem("certifications" as unknown as ArrayKey, { name: "", issuer: "", date: "" })}>
              <Plus className="w-4 h-4" /> Add Certification
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Languages */}
        <AccordionItem value="languages" className="rounded-2xl border bg-card shadow-sm overflow-hidden px-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <SectionHeader icon={Languages} label={t.languages} count={cvData.languages.filter(Boolean).length} />
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5 space-y-2">
            <Label>Languages <span className="text-muted-foreground text-xs">(comma separated, e.g. English (Native))</span></Label>
            <Input
              value={cvData.languages.join(", ")}
              onChange={(e) => setCVData({ languages: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
              placeholder="English (Native), Tamil (Fluent)…"
            />
            {cvData.languages.filter(Boolean).length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {cvData.languages.filter(Boolean).map((l, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{l}</Badge>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* References */}
        <AccordionItem value="references" className="rounded-2xl border bg-card shadow-sm overflow-hidden px-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <SectionHeader icon={Users} label={t.references} count={cvData.references.length} />
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5 space-y-4">
            <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
              References are hidden by default. Enable them in the <strong>Settings</strong> tab under &ldquo;Section Visibility&rdquo;.
            </p>
            {cvData.references.map((ref, idx) => (
              <div key={ref.id} className="rounded-xl border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">{ref.name || "New Reference"}</span>
                  <div className="flex items-center gap-1">
                    <button disabled={idx === 0} onClick={() => useCVStore.getState().moveArrayItem("references", ref.id, "up")} className="p-1 rounded hover:bg-muted disabled:opacity-30 transition"><ChevronUp className="w-4 h-4" /></button>
                    <button disabled={idx === cvData.references.length - 1} onClick={() => useCVStore.getState().moveArrayItem("references", ref.id, "down")} className="p-1 rounded hover:bg-muted disabled:opacity-30 transition"><ChevronDown className="w-4 h-4" /></button>
                    <button onClick={() => useCVStore.getState().removeArrayItem("references", ref.id)} className="p-1 rounded hover:bg-destructive/10 text-destructive transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Name</Label>
                    <Input value={ref.name} onChange={(e) => useCVStore.getState().updateArrayItem("references", ref.id, { name: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Position</Label>
                    <Input value={ref.position} onChange={(e) => useCVStore.getState().updateArrayItem("references", ref.id, { position: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Company</Label>
                    <Input value={ref.company} onChange={(e) => useCVStore.getState().updateArrayItem("references", ref.id, { company: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Email</Label>
                    <Input type="email" value={ref.email} onChange={(e) => useCVStore.getState().updateArrayItem("references", ref.id, { email: e.target.value })} />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label>Phone <span className="text-muted-foreground text-xs">(optional)</span></Label>
                    <Input value={ref.phone} onChange={(e) => useCVStore.getState().updateArrayItem("references", ref.id, { phone: e.target.value })} />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="gap-2" onClick={() => addItem("references" as unknown as ArrayKey, { name: "", position: "", company: "", email: "", phone: "" })}>
              <Plus className="w-4 h-4" /> Add Reference
            </Button>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
