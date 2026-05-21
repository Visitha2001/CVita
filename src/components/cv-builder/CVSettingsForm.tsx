"use client";

import { useCVStore } from "@/store/useCVStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Check, Circle, Square, RectangleHorizontal } from "lucide-react";

const presetColors = [
  "#2563eb", "#16a34a", "#dc2626", "#9333ea",
  "#ea580c", "#0891b2", "#4f46e5", "#e11d48",
  "#475569", "#0f172a",
];

const textColors = [
  "#111827", "#1f2937", "#374151", "#4b5563", "#000000",
];

const fontFamilies = [
  "Poppins", "Inter", "Roboto", "Open Sans",
  "Merriweather", "Playfair Display", "Montserrat",
  "Lora", "Oswald", "Raleway", "Nunito",
];

const shapes = [
  { id: "circle",  label: "Circle",  Icon: Circle },
  { id: "rounded", label: "Rounded", Icon: RectangleHorizontal },
  { id: "square",  label: "Square",  Icon: Square },
] as const;

const visibilityToggles = [
  { key: "showSummary"        as const, label: "Professional Summary" },
  { key: "showExperience"     as const, label: "Experience" },
  { key: "showProjects"       as const, label: "Projects" },
  { key: "showCertifications" as const, label: "Certifications" },
  { key: "showLanguages"      as const, label: "Languages" },
  { key: "showReferences"     as const, label: "References" },
] as const;

// ── Color swatch ─────────────────────────────────────────────────────────────

function ColorSwatch({ color, selected, onClick }: { color: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={color}
      className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-all ${
        selected ? "ring-2 ring-offset-2 ring-primary scale-110 shadow-md" : "hover:scale-105"
      }`}
      style={{ backgroundColor: color }}
    >
      {selected && <Check className="w-4 h-4 text-white drop-shadow-md" />}
    </button>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────────

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`relative inline-flex w-11 h-6 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
        on ? "bg-primary" : "bg-muted"
      }`}
    >
      <span
        className={`pointer-events-none block w-5 h-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ${
          on ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-primary/10 to-transparent px-4 sm:px-5 py-3 sm:py-4 border-b">
        <h3 className="font-bold text-base">{title}</h3>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <div className="px-4 sm:px-5 py-4 sm:py-5">{children}</div>
    </section>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────

export default function CVSettingsForm() {
  const { settings, setSettings } = useCVStore();

  return (
    <div className="space-y-7 max-w-2xl mx-auto pt-4 sm:pt-6 pb-12">

      {/* Accent Color */}
      <Section title="Accent Color" desc="Used for headings, borders and skill tags">
        <div className="flex flex-wrap gap-3 items-center mb-3">
          {presetColors.map((hex) => (
            <ColorSwatch key={hex} color={hex} selected={settings.primaryColor === hex} onClick={() => setSettings({ primaryColor: hex })} />
          ))}
          <div className="relative w-9 h-9 rounded-full overflow-hidden shadow-sm border-2 border-dashed border-muted-foreground/30 hover:border-primary transition-colors">
            <Input type="color" value={settings.primaryColor} onChange={(e) => setSettings({ primaryColor: e.target.value })}
              className="absolute inset-[-8px] w-16 h-16 cursor-pointer p-0 border-0" />
          </div>
        </div>
        <div className="h-2 rounded-full" style={{ background: `linear-gradient(to right, ${settings.primaryColor}30, ${settings.primaryColor})` }} />
      </Section>

      {/* Text Color */}
      <Section title="Text Color" desc="Main body text color in the CV">
        <div className="flex flex-wrap gap-3 items-center">
          {textColors.map((hex) => (
            <ColorSwatch key={hex} color={hex} selected={settings.fontColor === hex} onClick={() => setSettings({ fontColor: hex })} />
          ))}
          <div className="relative w-9 h-9 rounded-full overflow-hidden shadow-sm border-2 border-dashed border-muted-foreground/30 hover:border-primary transition-colors">
            <Input type="color" value={settings.fontColor} onChange={(e) => setSettings({ fontColor: e.target.value })}
              className="absolute inset-[-8px] w-16 h-16 cursor-pointer p-0 border-0" />
          </div>
        </div>
      </Section>

      {/* Font Family */}
      <Section title="CV Font">
        <div className="grid grid-cols-2 gap-2">
          {fontFamilies.map((font) => (
            <Card
              key={font}
              onClick={() => setSettings({ fontFamily: font })}
              className={`px-3 py-2.5 cursor-pointer flex items-center justify-between transition-all hover:border-primary/50 ${
                settings.fontFamily === font ? "border-primary ring-1 ring-primary bg-primary/5" : ""
              }`}
            >
              <span style={{ fontFamily: font }} className="text-sm truncate">{font}</span>
              {settings.fontFamily === font && <Check className="w-4 h-4 text-primary shrink-0 ml-1" />}
            </Card>
          ))}
        </div>
      </Section>

      {/* Profile Picture Shape */}
      <Section title="Profile Picture Shape">
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4">
          {shapes.map(({ id, label, Icon }) => (
            <Card
              key={id}
              onClick={() => setSettings({ profilePictureShape: id })}
              className={`p-4 cursor-pointer flex flex-col items-center gap-2 transition-all hover:border-primary/50 ${
                settings.profilePictureShape === id ? "border-primary ring-1 ring-primary bg-primary/5" : ""
              }`}
            >
              <Icon className={`w-8 h-8 ${settings.profilePictureShape === id ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-sm font-medium">{label}</span>
            </Card>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div>
            <Label className="text-sm font-medium cursor-pointer" onClick={() => setSettings({ showProfileRing: !settings.showProfileRing })}>
              Ring Border
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">Add an accent-colored ring around your photo</p>
          </div>
          <Toggle on={settings.showProfileRing} onToggle={() => setSettings({ showProfileRing: !settings.showProfileRing })} />
        </div>
      </Section>

      {/* CV Spacing */}
      <Section title="CV Spacing" desc="Controls internal padding for the selected template">
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4">
          {([
            { id: "compact",  label: "Compact",  desc: "Dense",    pad: "p-1" },
            { id: "standard", label: "Standard", desc: "Balanced", pad: "p-2" },
            { id: "spacious", label: "Spacious", desc: "Airy",     pad: "p-3" },
          ] as const).map(({ id, label, desc, pad }) => (
            <Card
              key={id}
              onClick={() => setSettings({ spacing: id })}
              className={`p-4 cursor-pointer flex flex-col gap-1 transition-all hover:border-primary/50 ${
                settings.spacing === id ? "border-primary ring-1 ring-primary bg-primary/5" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{label}</span>
                {settings.spacing === id && <Check className="w-4 h-4 text-primary" />}
              </div>
              <span className="text-xs text-muted-foreground">{desc}</span>
              <div className={`mt-2 rounded bg-muted flex flex-col gap-1 ${pad}`}>
                <div className="h-1 bg-muted-foreground/30 rounded" />
                <div className="h-1 bg-muted-foreground/20 rounded w-4/5" />
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Section Visibility */}
      <Section title="Section Visibility" desc="Toggle which sections appear in your CV">
        <div className="flex flex-col gap-4">
          {visibilityToggles.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <Label className="text-sm font-medium cursor-pointer" onClick={() => setSettings({ [key]: !settings[key] })}>
                {label}
              </Label>
              <Toggle on={settings[key]} onToggle={() => setSettings({ [key]: !settings[key] })} />
            </div>
          ))}
        </div>
      </Section>

      {/* Live status */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground px-1">
        <span className="w-2 h-2 rounded-full bg-primary/80 inline-block" />
        <span style={{ fontFamily: settings.fontFamily }} className="font-medium text-foreground">{settings.fontFamily}</span>
        <span>·</span>
        <span className="capitalize">{settings.spacing} spacing</span>
        <span>·</span>
        <span style={{ color: settings.primaryColor }} className="font-semibold">{settings.primaryColor}</span>
      </div>

    </div>
  );
}
