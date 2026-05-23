"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  Eraser,
  FolderOpen,
  Users,
  Award,
  Languages,
  X,
  Link as LinkIcon,
  ClipboardPaste,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

// ── helpers ──────────────────────────────────────────────────────────────────

type ArrayKey = "experience" | "education" | "projects";



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
  const [urlDraft, setUrlDraft] = useState(cvData.image ?? "");
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const preview = cvData.image;

  /** Convert any File to a base64 data-URL and save it */
  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    setError("");
    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setCVData({ image: reader.result as string });
      setLoading(false);
    };
    reader.onerror = () => { setError("Failed to read file."); setLoading(false); };
    reader.readAsDataURL(file);
  }

  /** Fetch an external URL via the server to bypass CORS and convert it to base64 */
  async function applyUrl() {
    const url = urlDraft.trim();
    if (!url) return;
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(`/api/fetch-image?url=${encodeURIComponent(url)}`);
      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to load image");
      }
      const data = await resp.json();
      setCVData({ image: data.dataUrl });
      setLoading(false);
    } catch (err) {
      // Fallback: Just save the URL directly if our proxy fails
      setCVData({ image: url });
      setLoading(false);
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Warning: The image could not be proxy-fetched (${msg}). It may not appear in exported PDFs.`);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function clearImage() {
    setCVData({ image: "" });
    setUrlDraft("");
    setError("");
  }

  return (
    <div className="space-y-3 sm:col-span-2">
      <Label className="flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-primary" />
        Profile Picture
      </Label>

      {/* ── Mode tabs ── */}
      <div className="flex rounded-lg border overflow-hidden text-xs font-semibold">
        <button
          onClick={() => setMode("upload")}
          className={`flex-1 py-1.5 transition-colors ${mode === "upload" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
        >
          Upload File
        </button>
        <button
          onClick={() => setMode("url")}
          className={`flex-1 py-1.5 transition-colors border-l ${mode === "url" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
        >
          Paste URL
        </button>
      </div>

      {mode === "upload" ? (
        /* ── Drag & drop zone ── */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-all py-5 px-4 text-center ${
            dragging
              ? "border-primary bg-primary/10 scale-[1.01]"
              : "border-border hover:border-primary/50 hover:bg-muted/40"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-muted-foreground">Processing…</span>
            </div>
          ) : (
            <>
              <div className="p-2.5 rounded-full bg-primary/10">
                <ImageIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Drop image here or <span className="text-primary underline underline-offset-2">browse</span></p>
                <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, WebP, GIF · any source</p>
              </div>
            </>
          )}
        </div>
      ) : (
        /* ── URL input ── */
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={urlDraft}
              onChange={(e) => { setUrlDraft(e.target.value); setError(""); }}
              placeholder="https://lh3.googleusercontent.com/…"
              className="flex-1 text-xs"
              onKeyDown={(e) => e.key === "Enter" && applyUrl()}
            />
            <Button
              size="sm"
              onClick={applyUrl}
              disabled={loading || !urlDraft.trim()}
              className="shrink-0"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                "Apply"
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Works with Google, GitHub, LinkedIn, social media, or any direct image link.
          </p>
        </div>
      )}

      {error && (
        <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded-lg px-3 py-2 leading-relaxed">
          {error}
        </p>
      )}

      {/* ── Preview ── */}
      {preview && (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Profile preview"
            className="w-16 h-16 rounded-full object-cover border-2 border-primary/30 shadow-md shrink-0"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">Image applied ✓</p>
            <p className="text-xs text-muted-foreground truncate">
              {preview.startsWith("data:") ? "Local file (base64)" : preview}
            </p>
          </div>
          <button
            onClick={clearImage}
            className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
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
    <div className="space-y-6 max-w-2xl mx-auto pt-4 sm:pt-6 pb-12">

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

        {/* Social Links */}
        <AccordionItem value="social" className="rounded-2xl border bg-card shadow-sm overflow-hidden px-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold">Social Links ({cvData.socialMedia?.length || 0})</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5 space-y-4">
            {cvData.socialMedia?.map((social, idx) => (
              <div key={idx} className="rounded-xl border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">{social.platform || "New Link"}</span>
                  <div className="flex items-center gap-1">
                    <button disabled={idx === 0} onClick={() => {
                        const newLinks = [...cvData.socialMedia];
                        const temp = newLinks[idx];
                        newLinks[idx] = newLinks[idx - 1];
                        newLinks[idx - 1] = temp;
                        setCVData({ socialMedia: newLinks });
                    }} className="p-1 rounded hover:bg-muted disabled:opacity-30 transition"><ChevronUp className="w-4 h-4" /></button>
                    <button disabled={idx === cvData.socialMedia.length - 1} onClick={() => {
                        const newLinks = [...cvData.socialMedia];
                        const temp = newLinks[idx];
                        newLinks[idx] = newLinks[idx + 1];
                        newLinks[idx + 1] = temp;
                        setCVData({ socialMedia: newLinks });
                    }} className="p-1 rounded hover:bg-muted disabled:opacity-30 transition"><ChevronDown className="w-4 h-4" /></button>
                    <button onClick={() => setCVData({ socialMedia: cvData.socialMedia.filter((_, i) => i !== idx) })} className="p-1 rounded hover:bg-destructive/10 text-destructive transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Platform</Label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={social.platform}
                      onChange={(e) => {
                        const newLinks = [...cvData.socialMedia];
                        newLinks[idx].platform = e.target.value;
                        setCVData({ socialMedia: newLinks });
                      }}
                    >
                      <option value="" className="bg-background text-foreground">Select Platform</option>
                      <option value="GitHub" className="bg-background text-foreground">GitHub</option>
                      <option value="LinkedIn" className="bg-background text-foreground">LinkedIn</option>
                      <option value="Medium" className="bg-background text-foreground">Medium</option>
                      <option value="Facebook" className="bg-background text-foreground">Facebook</option>
                      <option value="Twitter" className="bg-background text-foreground">Twitter / X</option>
                      <option value="Portfolio" className="bg-background text-foreground">Portfolio</option>
                      <option value="Other" className="bg-background text-foreground">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label>Link URL</Label>
                    <div className="flex gap-2">
                      <Input
                        value={social.url}
                        onChange={(e) => {
                          const newLinks = [...cvData.socialMedia];
                          newLinks[idx].url = e.target.value;
                          setCVData({ socialMedia: newLinks });
                        }}
                        placeholder="https://..."
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="shrink-0 h-9 w-9"
                        title="Paste from clipboard"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            if (text) {
                              const newLinks = [...cvData.socialMedia];
                              newLinks[idx].url = text;
                              setCVData({ socialMedia: newLinks });
                            }
                          } catch (err) {
                            console.error("Failed to read clipboard", err);
                          }
                        }}
                      >
                        <ClipboardPaste className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                const newLinks = [...(cvData.socialMedia || []), { platform: "GitHub", url: "" }];
                setCVData({ socialMedia: newLinks });
              }}
            >
              <Plus className="w-4 h-4" /> Add Social Link
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Experience */}
        <AccordionItem value="experience" className="rounded-2xl border bg-card shadow-sm overflow-hidden px-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold">{t.experience} ({cvData.experience.length})</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5 space-y-4">
            <AnimatePresence mode="popLayout">
            {cvData.experience.map((exp, idx) => (
              <motion.div
                key={exp.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border bg-muted/30 p-4 space-y-3"
              >
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
                    <Label>{t.skills}</Label>
                    <TagInput
                      tags={exp.skills ?? []}
                      onChange={(skills) => updateItem("experience", exp.id, { skills })}
                      placeholder="Add skill, press Enter…"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
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
            <AnimatePresence mode="popLayout">
            {cvData.education.map((edu, idx) => (
              <motion.div
                key={edu.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border bg-muted/30 p-4 space-y-3"
              >
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
              </motion.div>
            ))}
            </AnimatePresence>
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
            <AnimatePresence mode="popLayout">
            {cvData.projects.map((proj, idx) => (
              <motion.div
                key={proj.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border bg-muted/30 p-4 space-y-3"
              >
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
                    <Label>Skills</Label>
                    <TagInput
                      tags={proj.skills ?? []}
                      onChange={(skills) => updateItem("projects", proj.id, { skills })}
                      placeholder="Add skill, press Enter…"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
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
              <Label>{t.allSkills}</Label>
              <TagInput
                tags={cvData.skills.filter(Boolean)}
                onChange={(skills) => setCVData({ skills })}
                placeholder="Add skill, press Enter…"
              />
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
            <AnimatePresence mode="popLayout">
            {cvData.certifications.map((cert, idx) => (
              <motion.div
                key={cert.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border bg-muted/30 p-4 space-y-3"
              >
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
              </motion.div>
            ))}
            </AnimatePresence>
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
            <Label>Languages</Label>
            <TagInput
              tags={cvData.languages.filter(Boolean)}
              onChange={(languages) => setCVData({ languages })}
              placeholder="e.g. English (Native), press Enter…"
            />
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
            <AnimatePresence mode="popLayout">
            {cvData.references.map((ref, idx) => (
              <motion.div
                key={ref.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border bg-muted/30 p-4 space-y-3"
              >
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
              </motion.div>
            ))}
            </AnimatePresence>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => addItem("references" as unknown as ArrayKey, { name: "", position: "", company: "", email: "", phone: "" })}>
              <Plus className="w-4 h-4" /> Add Reference
            </Button>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
