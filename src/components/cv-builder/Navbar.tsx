"use client";

import { Moon, Sun, Download, FileText, Image as ImageIcon, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { useI18n, LANG_OPTIONS } from "@/lib/i18n";

export default function Navbar() {
  const { setTheme, theme } = useTheme();
  const { t, lang, setLang } = useI18n();

  const getElement = () => document.getElementById("cv-preview-container");

  const downloadPDF = async () => {
    const el = getElement();
    if (!el) return;
    try {
      const dataUrl = await toPng(el, { quality: 1, pixelRatio: 2 });
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("cv.pdf");
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  const downloadImage = async () => {
    const el = getElement();
    if (!el) return;
    try {
      const dataUrl = await toPng(el, { quality: 1, pixelRatio: 2 });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "cv.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error generating image:", err);
    }
  };

  const downloadWord = () => {
    const el = getElement();
    if (!el) return;
    const header =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>CV</title></head><body>";
    const footer = "</body></html>";
    const source = "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(header + el.innerHTML + footer);
    const a = document.createElement("a");
    a.href = source;
    a.download = "cv.doc";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const currentLang = LANG_OPTIONS.find((l) => l.id === lang);

  return (
    <nav className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="bg-primary/10 p-1.5 sm:p-2 rounded-xl text-primary">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <h1 className="text-lg sm:text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          VitaForge
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-1.5 sm:space-x-2.5">

        {/* Language switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center gap-1.5 rounded-full h-8 sm:h-9 px-2.5 sm:px-3 border border-border bg-muted/50 hover:bg-muted text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{currentLang?.native}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {LANG_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.id}
                onClick={() => setLang(opt.id)}
                className={`cursor-pointer gap-3 ${lang === opt.id ? "font-semibold text-primary" : ""}`}
              >
                <span className="w-4 text-center text-xs">{lang === opt.id ? "✓" : " "}</span>
                <span>{opt.native}</span>
                <span className="text-muted-foreground text-xs ml-auto">{opt.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-5 w-px bg-border" />

        {/* Export — icon-only on mobile, full label on sm+ */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 sm:h-10 sm:w-auto sm:px-5 shadow-lg shadow-primary/20">
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">{t.exportCV}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={downloadPDF} className="cursor-pointer">
              <FileText className="mr-2 h-4 w-4 text-blue-500" />
              {t.pdfDocument}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={downloadImage} className="cursor-pointer">
              <ImageIcon className="mr-2 h-4 w-4 text-green-500" />
              {t.imageFile}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={downloadWord} className="cursor-pointer">
              <FileText className="mr-2 h-4 w-4 text-indigo-500" />
              {t.wordDoc}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme toggle */}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-8 h-8 sm:w-10 sm:h-10 border-muted bg-muted/50 hover:bg-muted shrink-0"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </nav>
  );
}
