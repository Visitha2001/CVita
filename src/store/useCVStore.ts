import { create } from 'zustand';

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface SocialMedia {
  platform: string;
  url: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  skills: string[];
  link?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  skills: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Award {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
}

export interface CVData {
  image?: string;
  name: string;
  professionalSummary: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  socialMedia: SocialMedia[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  skills: string[];
  skillCategories: SkillCategory[];
  certifications: Certification[];
  awards: Award[];
  languages: string[];
  interests: string[];
  references: Reference[];
}

export interface CVSettings {
  activeTemplate: string;
  primaryColor: string;
  fontColor: string;
  fontFamily: string;
  profilePictureShape: 'circle' | 'square' | 'rounded';
  spacing: 'compact' | 'standard' | 'spacious';
  showSummary: boolean;
  showExperience: boolean;
  showProjects: boolean;
  showCertifications: boolean;
  showLanguages: boolean;
  showReferences: boolean;
  showProfileRing: boolean;
}

// Base type that all array-item entries must satisfy
type WithId = { id: string };

interface CVStore {
  cvData: CVData;
  settings: CVSettings;
  setCVData: (data: Partial<CVData>) => void;
  setSettings: (settings: Partial<CVSettings>) => void;
  clearData: () => void;
  updateArrayItem: <T extends keyof CVData>(
    key: T,
    id: string,
    data: Partial<CVData[T] extends (infer U)[] ? U : never>
  ) => void;
  addArrayItem: <T extends keyof CVData>(key: T, item: CVData[T] extends (infer U)[] ? U : never) => void;
  removeArrayItem: <T extends keyof CVData>(key: T, id: string) => void;
  moveArrayItem: <T extends keyof CVData>(key: T, id: string, direction: 'up' | 'down') => void;
}

const initialCVData: CVData = {
  name: 'John Doe',
  professionalSummary: 'Passionate software engineer with 5+ years of experience in building scalable web applications. Proficient in modern web technologies and always eager to learn.',
  address: '123 Tech Street, Silicon Valley, CA',
  phone: '+1 234 567 8900',
  email: 'john.doe@example.com',
  website: 'https://johndoe.com',
  socialMedia: [
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' },
    { platform: 'GitHub', url: 'https://github.com/johndoe' }
  ],
  projects: [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Developed a full-stack e-commerce platform with real-time inventory management and secure payment gateways.',
      skills: ['React', 'Node.js', 'PostgreSQL', 'Stripe']
    }
  ],
  experience: [
    {
      id: '1',
      company: 'Tech Corp Inc.',
      role: 'Senior Frontend Developer',
      startDate: '2020-01',
      endDate: 'Present',
      description: 'Lead the development of the core product dashboard. Improved performance by 40% and mentored junior developers.',
      skills: ['React', 'TypeScript', 'Tailwind CSS']
    }
  ],
  education: [
    {
      id: '1',
      institution: 'University of Technology',
      degree: 'B.S. in Computer Science',
      startDate: '2015-08',
      endDate: '2019-05'
    }
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python'],
  skillCategories: [],
  certifications: [],
  awards: [],
  languages: ['English (Native)', 'Spanish (Conversational)'],
  interests: ['Open Source', 'Photography', 'Hiking'],
  references: []
};

const initialSettings: CVSettings = {
  activeTemplate: 'se-1',
  primaryColor: '#2563eb',
  fontColor: '#1f2937',
  fontFamily: 'Poppins',
  profilePictureShape: 'circle',
  spacing: 'standard',
  showSummary: true,
  showExperience: true,
  showProjects: true,
  showCertifications: true,
  showLanguages: true,
  showReferences: false,
  showProfileRing: true,
};

export const useCVStore = create<CVStore>((set) => ({
  cvData: initialCVData,
  settings: initialSettings,
  setCVData: (data) =>
    set((state) => ({ cvData: { ...state.cvData, ...data } })),
  setSettings: (settings) =>
    set((state) => ({ settings: { ...state.settings, ...settings } })),
  clearData: () =>
    set(() => ({ cvData: {
      image: undefined,
      name: '',
      professionalSummary: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      socialMedia: [],
      projects: [],
      experience: [],
      education: [],
      skills: [],
      skillCategories: [],
      certifications: [],
      awards: [],
      languages: [],
      interests: [],
      references: [],
    } })),
  updateArrayItem: (key, id, data) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        [key]: (state.cvData[key] as WithId[]).map((item) =>
          item.id === id ? { ...item, ...data } : item
        ),
      },
    })),
  addArrayItem: (key, item) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        [key]: [...(state.cvData[key] as WithId[]), item],
      },
    })),
  removeArrayItem: (key, id) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        [key]: (state.cvData[key] as WithId[]).filter(
          (item) => item.id !== id
        ),
      },
    })),
  moveArrayItem: (key, id, direction) =>
    set((state) => {
      const arr = [...(state.cvData[key] as WithId[])];
      const idx = arr.findIndex((item) => item.id === id);
      if (idx < 0) return state;
      if (direction === 'up' && idx > 0) {
        const temp = arr[idx];
        arr[idx] = arr[idx - 1];
        arr[idx - 1] = temp;
      } else if (direction === 'down' && idx < arr.length - 1) {
        const temp = arr[idx];
        arr[idx] = arr[idx + 1];
        arr[idx + 1] = temp;
      }
      return {
        cvData: {
          ...state.cvData,
          [key]: arr,
        },
      };
    }),
}));

