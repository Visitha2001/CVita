"use client";

import { CVData, CVSettings } from "@/store/useCVStore";
import { Mail, MapPin, Phone, Globe, Link as LinkIcon, Briefcase, GraduationCap, Code, Award, User } from "lucide-react";

interface Props {
  data: CVData;
  settings: CVSettings;
}

const spacingMap = {
  compact:  { outer: "6", inner: "4", gap: "4" },
  standard: { outer: "10", inner: "8", gap: "6" },
  spacious: { outer: "14", inner: "12", gap: "8" },
} as const;

export default function BaseTemplate({ data, settings }: Props) {
  const [category, variation] = settings.activeTemplate.split("-");
  const varIndex = parseInt(variation);
  const sp = spacingMap[settings.spacing ?? "standard"];
  
  // Helpers
  const isImageVariant = varIndex % 2 !== 0; // Odd variations have images
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderIcon = (_platform: string) => <LinkIcon className="w-4 h-4" />;
  
  const ImageBox = ({ className = "" }: { className?: string }) => (
    isImageVariant && data.image ? (
      <div 
        className={`overflow-hidden flex-shrink-0 ${
          settings.profilePictureShape === 'circle' ? 'rounded-full' : 
          settings.profilePictureShape === 'rounded' ? 'rounded-2xl' : 'rounded-none'
        } ${className}`}
      >
        <div 
          className="w-full h-full bg-muted/20" 
          style={{ backgroundImage: `url(${data.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} 
        />
      </div>
    ) : null
  );

  const ContactInfo = ({ className = "flex flex-wrap gap-x-4 gap-y-2 text-sm", itemClass = "flex items-center gap-1.5" }) => (
    <div className={className}>
      {data.email && <span className={itemClass}><Mail className="w-4 h-4 opacity-70" /> {data.email}</span>}
      {data.phone && <span className={itemClass}><Phone className="w-4 h-4 opacity-70" /> {data.phone}</span>}
      {data.address && <span className={itemClass}><MapPin className="w-4 h-4 opacity-70" /> {data.address}</span>}
      {data.website && <span className={itemClass}><Globe className="w-4 h-4 opacity-70" /> {data.website}</span>}
      {data.socialMedia?.map((social, i) => (
        <span key={i} className={itemClass}>
          {renderIcon(social.platform)} {social.url.replace(/^https?:\/\//, '')}
        </span>
      ))}
    </div>
  );

  const SkillsTags = ({ tags, className = "bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium" }: { tags: string[], className?: string }) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((skill, i) => (
        <span key={i} className={className} style={{ backgroundColor: `${settings.primaryColor}20`, color: settings.primaryColor }}>
          {skill}
        </span>
      ))}
    </div>
  );

  // Template 1: Software Engineer (Modern & Clean, Accent Borders)
  const renderSoftwareEngineer = () => (
    <div className="w-full h-full flex flex-col bg-white">
      <header
        className={`flex items-start gap-6 ${varIndex > 3 ? 'bg-gray-50 border-b' : ''}`}
        style={{ padding: `${sp.outer}mm ${sp.outer}mm ${sp.inner}mm` }}
      >
        <ImageBox />
        <div className="flex flex-col gap-3 flex-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{data.name}</h1>
          <ContactInfo />
        </div>
      </header>

      <div className="flex flex-col flex-1" style={{ padding: `0 ${sp.outer}mm ${sp.outer}mm`, gap: `${sp.gap}mm` }}>
        {data.professionalSummary && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: settings.primaryColor }}>
              <User className="w-5 h-5" /> Summary
            </h2>
            <p className="text-sm leading-relaxed">{data.professionalSummary}</p>
          </section>
        )}

        {data.experience?.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: settings.primaryColor }}>
              <Briefcase className="w-5 h-5" /> Experience
            </h2>
            <div className="flex flex-col gap-5">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: `${settings.primaryColor}50` }}>
                  <div className="absolute w-2 h-2 rounded-full -left-[5px] top-1.5" style={{ backgroundColor: settings.primaryColor }}></div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-base font-bold">{exp.role}</h3>
                    <span className="text-sm font-medium opacity-70">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-sm font-semibold opacity-90 mb-2">{exp.company}</div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                  {exp.skills?.length > 0 && <SkillsTags tags={exp.skills} />}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects?.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: settings.primaryColor }}>
              <Code className="w-5 h-5" /> Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.projects.map((proj) => (
                <div key={proj.id} className="border rounded-lg p-4" style={{ borderColor: `${settings.primaryColor}30` }}>
                  <h3 className="font-bold text-base mb-1">{proj.name}</h3>
                  {proj.link && <div className="text-xs text-blue-600 mb-2 truncate">{proj.link}</div>}
                  <p className="text-sm leading-relaxed">{proj.description}</p>
                  {proj.skills?.length > 0 && <SkillsTags tags={proj.skills} />}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education?.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: settings.primaryColor }}>
              <GraduationCap className="w-5 h-5" /> Education
            </h2>
            <div className="flex flex-col gap-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold">{edu.degree}</h3>
                    <div className="text-sm opacity-90">{edu.institution}</div>
                  </div>
                  <span className="text-sm font-medium opacity-70">{edu.startDate} - {edu.endDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills?.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: settings.primaryColor }}>
              <Award className="w-5 h-5" /> Core Skills
            </h2>
            <SkillsTags tags={data.skills} className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium" />
          </section>
        )}
      </div>
    </div>
  );

  // Template 2: Machine Learning (Academic / Formal, Centered Header)
  const renderMachineLearning = () => (
    <div className="w-full h-full flex flex-col bg-white">
      <header
        className="flex flex-col items-center text-center"
        style={{ padding: `${sp.outer}mm ${sp.outer}mm ${sp.inner}mm`, gap: `${sp.gap}mm` }}
      >
        <ImageBox />
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">{data.name}</h1>
          <ContactInfo className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600" />
        </div>
      </header>

      <div className="flex flex-col flex-1" style={{ padding: `0 ${sp.outer}mm ${sp.outer}mm`, gap: `${sp.gap}mm` }}>
        {data.professionalSummary && (
          <section>
            <h2 className="text-xl font-serif font-bold border-b-2 pb-1 mb-3" style={{ borderColor: settings.primaryColor }}>Professional Summary</h2>
            <p className="text-sm leading-relaxed">{data.professionalSummary}</p>
          </section>
        )}

        {data.education?.length > 0 && (
          <section>
            <h2 className="text-xl font-serif font-bold border-b-2 pb-1 mb-3" style={{ borderColor: settings.primaryColor }}>Education</h2>
            <div className="flex flex-col gap-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between">
                  <div>
                    <h3 className="text-base font-bold">{edu.degree}</h3>
                    <div className="text-sm italic">{edu.institution}</div>
                  </div>
                  <span className="text-sm">{edu.startDate} - {edu.endDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.experience?.length > 0 && (
          <section>
            <h2 className="text-xl font-serif font-bold border-b-2 pb-1 mb-3" style={{ borderColor: settings.primaryColor }}>Experience</h2>
            <div className="flex flex-col gap-5">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-base font-bold">{exp.role}</h3>
                    <span className="text-sm">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-sm italic mb-2">{exp.company}</div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                  {exp.skills?.length > 0 && (
                    <div className="text-xs mt-2 text-gray-600"><span className="font-bold">Technologies:</span> {exp.skills.join(", ")}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {data.projects?.length > 0 && (
          <section>
            <h2 className="text-xl font-serif font-bold border-b-2 pb-1 mb-3" style={{ borderColor: settings.primaryColor }}>Projects</h2>
            <div className="flex flex-col gap-4">
              {data.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-base font-bold">{proj.name}</h3>
                  </div>
                  <p className="text-sm leading-relaxed">{proj.description}</p>
                  {proj.skills?.length > 0 && (
                    <div className="text-xs mt-1 text-gray-600"><span className="font-bold">Technologies:</span> {proj.skills.join(", ")}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills?.length > 0 && (
          <section>
            <h2 className="text-xl font-serif font-bold border-b-2 pb-1 mb-3" style={{ borderColor: settings.primaryColor }}>Technical Skills</h2>
            <p className="text-sm leading-relaxed">{data.skills.join(", ")}</p>
          </section>
        )}
      </div>
    </div>
  );

  // Template 3: Full Stack (Two Column Sidebar Layout)
  const renderFullStack = () => (
    <div className="w-full h-full flex bg-white">
      {/* Sidebar */}
      <div className="w-1/3 flex flex-col text-white" style={{ backgroundColor: settings.primaryColor, padding: `${sp.outer}mm`, gap: `${sp.gap}mm` }}>
        <div className="flex flex-col items-center text-center gap-4">
          <ImageBox className="border-4 border-white/20" />
          <div>
            <h1 className="text-2xl font-bold">{data.name}</h1>
            <div className="text-sm opacity-90 mt-1">Full Stack Developer</div>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-sm mt-4">
          <h2 className="text-lg font-bold border-b border-white/30 pb-1">Contact</h2>
          {data.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> <span className="break-all">{data.email}</span></div>}
          {data.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {data.phone}</div>}
          {data.address && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {data.address}</div>}
          {data.website && <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> {data.website.replace(/^https?:\/\//, '')}</div>}
        </div>

        {data.skills?.length > 0 && (
          <div className="flex flex-col gap-4 mt-2">
            <h2 className="text-lg font-bold border-b border-white/30 pb-1">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="bg-white/20 px-2 py-1 rounded text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-2/3 flex flex-col bg-gray-50" style={{ padding: `${sp.outer}mm`, gap: `${sp.gap}mm` }}>
        {data.professionalSummary && (
          <section>
            <h2 className="text-xl font-bold uppercase tracking-wider mb-2 text-gray-800">Profile</h2>
            <p className="text-sm leading-relaxed text-gray-600">{data.professionalSummary}</p>
          </section>
        )}

        {data.experience?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold uppercase tracking-wider mb-4 text-gray-800">Experience</h2>
            <div className="flex flex-col gap-5">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-base font-bold text-gray-900">{exp.role}</h3>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-gray-200 text-gray-700">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-600 mb-2">{exp.company}</div>
                  <p className="text-sm leading-relaxed text-gray-600">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold uppercase tracking-wider mb-4 text-gray-800">Education</h2>
            <div className="flex flex-col gap-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="text-base font-bold text-gray-900">{edu.degree}</h3>
                  <div className="text-sm text-gray-600">{edu.institution}</div>
                  <div className="text-xs text-gray-500 mt-1">{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );

  // Template 4: General (Elegant Top Header with solid background block)
  const renderGeneral = () => (
    <div className="w-full h-full flex flex-col bg-white">
      <header className="text-white relative" style={{ backgroundColor: settings.primaryColor }}>
        <div className="flex items-center relative z-10" style={{ padding: `${sp.inner}mm ${sp.outer}mm`, gap: `${sp.gap}mm` }}>
          <ImageBox className="border-4 border-white/20 shadow-xl" />
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-bold tracking-tight">{data.name}</h1>
            <ContactInfo className="flex flex-wrap gap-x-6 gap-y-2 text-sm opacity-90 mt-2" itemClass="flex items-center gap-2" />
          </div>
        </div>
      </header>

      <div className="flex flex-col flex-1" style={{ padding: `${sp.inner}mm ${sp.outer}mm`, gap: `${sp.gap}mm` }}>
        {data.professionalSummary && (
          <section>
            <h2 className="text-xl font-bold uppercase mb-3 text-gray-800 border-l-4 pl-3" style={{ borderColor: settings.primaryColor }}>
              About Me
            </h2>
            <p className="text-sm leading-relaxed text-gray-600">{data.professionalSummary}</p>
          </section>
        )}

        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            {data.experience?.length > 0 && (
              <section>
                <h2 className="text-xl font-bold uppercase mb-4 text-gray-800 border-l-4 pl-3" style={{ borderColor: settings.primaryColor }}>
                  Experience
                </h2>
                <div className="flex flex-col gap-6">
                  {data.experience.map((exp) => (
                    <div key={exp.id}>
                      <h3 className="text-base font-bold text-gray-900">{exp.role}</h3>
                      <div className="text-sm font-medium text-gray-600 mb-1">{exp.company} <span className="mx-1">•</span> {exp.startDate} - {exp.endDate}</div>
                      <p className="text-sm leading-relaxed text-gray-600">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          
          <div className="flex flex-col gap-8">
            {data.education?.length > 0 && (
              <section>
                <h2 className="text-xl font-bold uppercase mb-4 text-gray-800 border-l-4 pl-3" style={{ borderColor: settings.primaryColor }}>
                  Education
                </h2>
                <div className="flex flex-col gap-4">
                  {data.education.map((edu) => (
                    <div key={edu.id} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-base font-bold text-gray-900">{edu.degree}</h3>
                      <div className="text-sm text-gray-600">{edu.institution}</div>
                      <div className="text-sm text-gray-500 mt-1">{edu.startDate} - {edu.endDate}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.skills?.length > 0 && (
              <section>
                <h2 className="text-xl font-bold uppercase mb-4 text-gray-800 border-l-4 pl-3" style={{ borderColor: settings.primaryColor }}>
                  Skills
                </h2>
                <SkillsTags tags={data.skills} className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200" />
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  switch (category) {
    case "se": return renderSoftwareEngineer();
    case "ml": return renderMachineLearning();
    case "fs": return renderFullStack();
    case "gen": return renderGeneral();
    default: return renderSoftwareEngineer();
  }
}
