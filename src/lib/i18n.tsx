"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// ── Translation strings ────────────────────────────────────────────────────────

export type Lang = "en" | "ta" | "si";

type Strings = {
  // Nav
  exportCV: string;
  pdfDocument: string;
  imageFile: string;
  wordDoc: string;
  language: string;
  // Sidebar tabs
  data: string;
  settings: string;
  templates: string;
  // Sections
  personalDetails: string;
  professionalSummary: string;
  experience: string;
  education: string;
  projects: string;
  skills: string;
  certifications: string;
  languages: string;
  interests: string;
  references: string;
  // Fields
  fullName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  institution: string;
  degree: string;
  projectName: string;
  projectUrl: string;
  allSkills: string;
  skillSubCategories: string;
  issuer: string;
  date: string;
  refName: string;
  refPosition: string;
  // Actions
  addExperience: string;
  addEducation: string;
  addProject: string;
  addCategory: string;
  addCertification: string;
  addReference: string;
  clearAllFields: string;
  clickToConfirm: string;
  apply: string;
  applied: string;
  chooseTemplate: string;
  // Settings
  accentColor: string;
  textColor: string;
  cvFont: string;
  profilePictureShape: string;
  cvSpacing: string;
  sectionVisibility: string;
  // Template categories
  all: string;
  softwareEng: string;
  machineLearning: string;
  fullStack: string;
  finance: string;
  general: string;
  // Extra
  present: string;
  optional: string;
};

const translations: Record<Lang, Strings> = {
  en: {
    exportCV: "Export CV",
    pdfDocument: "PDF Document (.pdf)",
    imageFile: "Image File (.png)",
    wordDoc: "Word Doc (.doc)",
    language: "Language",
    data: "Data",
    settings: "Settings",
    templates: "Templates",
    personalDetails: "Personal Details",
    professionalSummary: "Professional Summary",
    experience: "Experience",
    education: "Education",
    projects: "Projects",
    skills: "Skills",
    certifications: "Certifications",
    languages: "Languages",
    interests: "Interests",
    references: "References",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    website: "Website",
    address: "Address",
    company: "Company",
    role: "Role / Title",
    startDate: "Start Date",
    endDate: "End Date",
    description: "Description",
    institution: "Institution",
    degree: "Degree / Programme",
    projectName: "Project Name",
    projectUrl: "Project URL",
    allSkills: "All Skills",
    skillSubCategories: "Skill Sub-Categories",
    issuer: "Issuer",
    date: "Date",
    refName: "Name",
    refPosition: "Position",
    addExperience: "Add Experience",
    addEducation: "Add Education",
    addProject: "Add Project",
    addCategory: "Add Category",
    addCertification: "Add Certification",
    addReference: "Add Reference",
    clearAllFields: "Clear all fields",
    clickToConfirm: "Click again to confirm",
    apply: "Apply",
    applied: "Applied",
    chooseTemplate: "Choose a Template",
    accentColor: "Accent Color",
    textColor: "Text Color",
    cvFont: "CV Font",
    profilePictureShape: "Profile Picture Shape",
    cvSpacing: "CV Spacing",
    sectionVisibility: "Section Visibility",
    all: "All",
    softwareEng: "Software Eng.",
    machineLearning: "Machine Learning",
    fullStack: "Full Stack",
    finance: "Finance",
    general: "General",
    present: "Present",
    optional: "Optional",
  },
  ta: {
    exportCV: "CV ஏற்றுமதி",
    pdfDocument: "PDF ஆவணம் (.pdf)",
    imageFile: "படக் கோப்பு (.png)",
    wordDoc: "Word ஆவணம் (.doc)",
    language: "மொழி",
    data: "தரவு",
    settings: "அமைப்புகள்",
    templates: "வார்ப்புருக்கள்",
    personalDetails: "தனிப்பட்ட விவரங்கள்",
    professionalSummary: "தொழில்முறை சுருக்கம்",
    experience: "அனுபவம்",
    education: "கல்வி",
    projects: "திட்டங்கள்",
    skills: "திறன்கள்",
    certifications: "சான்றிதழ்கள்",
    languages: "மொழிகள்",
    interests: "ஆர்வங்கள்",
    references: "பரிந்துரைகள்",
    fullName: "முழு பெயர்",
    email: "மின்னஞ்சல்",
    phone: "தொலைபேசி",
    website: "இணையதளம்",
    address: "முகவரி",
    company: "நிறுவனம்",
    role: "பதவி / தலைப்பு",
    startDate: "தொடக்க தேதி",
    endDate: "முடிவு தேதி",
    description: "விளக்கம்",
    institution: "நிறுவனம்",
    degree: "பட்டம் / திட்டம்",
    projectName: "திட்டப் பெயர்",
    projectUrl: "திட்ட URL",
    allSkills: "அனைத்து திறன்கள்",
    skillSubCategories: "திறன் துணை வகைகள்",
    issuer: "வழங்குநர்",
    date: "தேதி",
    refName: "பெயர்",
    refPosition: "பதவி",
    addExperience: "+ அனுபவம் சேர்",
    addEducation: "+ கல்வி சேர்",
    addProject: "+ திட்டம் சேர்",
    addCategory: "+ வகை சேர்",
    addCertification: "+ சான்றிதழ் சேர்",
    addReference: "+ பரிந்துரை சேர்",
    clearAllFields: "அனைத்தும் அழி",
    clickToConfirm: "மீண்டும் கிளிக் செய்",
    apply: "செயல்படுத்து",
    applied: "செயல்படுத்தப்பட்டது",
    chooseTemplate: "வார்ப்புரு தேர்ந்தெடு",
    accentColor: "முக்கிய நிறம்",
    textColor: "உரை நிறம்",
    cvFont: "CV எழுத்துரு",
    profilePictureShape: "சுயவிவர படத்தின் வடிவம்",
    cvSpacing: "CV இடைவெளி",
    sectionVisibility: "பிரிவு தெரிவு",
    all: "அனைத்தும்",
    softwareEng: "மென்பொருள் பொறியியல்",
    machineLearning: "இயந்திர கற்றல்",
    fullStack: "முழு அடுக்கு",
    finance: "நிதி",
    general: "பொது",
    present: "தற்போது",
    optional: "விருப்பமானது",
  },
  si: {
    exportCV: "CV අපනයනය",
    pdfDocument: "PDF ලේඛනය (.pdf)",
    imageFile: "රූප ගොනුව (.png)",
    wordDoc: "Word ලේඛනය (.doc)",
    language: "භාෂාව",
    data: "දත්ත",
    settings: "සැකසුම්",
    templates: "සැකිලි",
    personalDetails: "පෞද්ගලික විස්තර",
    professionalSummary: "වෘත්තීය සාරාංශය",
    experience: "අත්දැකීම",
    education: "අධ්‍යාපනය",
    projects: "ව්‍යාපෘති",
    skills: "කුසලතා",
    certifications: "සහතික",
    languages: "භාෂා",
    interests: "කැමැත්ත",
    references: "යොමු",
    fullName: "සම්පූර්ණ නම",
    email: "විද්‍යුත් තැපෑල",
    phone: "දුරකථන",
    website: "වෙබ් අඩවිය",
    address: "ලිපිනය",
    company: "සමාගම",
    role: "භූමිකාව / මාතෘකාව",
    startDate: "ආරම්භ දිනය",
    endDate: "අවසාන දිනය",
    description: "විස්තරය",
    institution: "ආයතනය",
    degree: "උපාධිය / වැඩසටහන",
    projectName: "ව්‍යාපෘති නම",
    projectUrl: "ව්‍යාපෘති URL",
    allSkills: "සියලු කුසලතා",
    skillSubCategories: "කුසලතා උප කාණ්ඩ",
    issuer: "නිකුත් කරන්නා",
    date: "දිනය",
    refName: "නම",
    refPosition: "තනතුර",
    addExperience: "+ අත්දැකීම එක් කරන්න",
    addEducation: "+ අධ්‍යාපනය එක් කරන්න",
    addProject: "+ ව්‍යාපෘතිය එක් කරන්න",
    addCategory: "+ කාණ්ඩය එක් කරන්න",
    addCertification: "+ සහතිකය එක් කරන්න",
    addReference: "+ යොමු එක් කරන්න",
    clearAllFields: "සියල්ල මකන්න",
    clickToConfirm: "නැවත ක්ලික් කරන්න",
    apply: "යොදන්න",
    applied: "යොදා ගත්තා",
    chooseTemplate: "සැකිලි තෝරන්න",
    accentColor: "උච්චාරණ වර්ණය",
    textColor: "පෙළ වර්ණය",
    cvFont: "CV අකුරු",
    profilePictureShape: "පෞද්ගලික පින්තූර හැඩය",
    cvSpacing: "CV පරතරය",
    sectionVisibility: "කොටස් දෘශ්‍යතාව",
    all: "සියල්ල",
    softwareEng: "මෘදුකාංග",
    machineLearning: "යන්ත්‍ර ඉගෙනීම",
    fullStack: "සම්පූර්ණ ස්ටෑක්",
    finance: "මූල්‍ය",
    general: "සාමාන්‍ය",
    present: "දැන්",
    optional: "විකල්ප",
  },
};

// ── Context ────────────────────────────────────────────────────────────────────

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Strings;
}

const I18nContext = createContext<I18nCtx>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export const LANG_OPTIONS: { id: Lang; label: string; native: string }[] = [
  { id: "en", label: "English",  native: "English" },
  { id: "ta", label: "Tamil",    native: "தமிழ்" },
  { id: "si", label: "Sinhala",  native: "සිංහල" },
];
