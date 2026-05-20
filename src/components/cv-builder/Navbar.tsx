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
import { useCVStore } from "@/store/useCVStore";
import { spacingMap } from "@/components/cv-templates/shared";

// A4 at 96 dpi (must match CVPreview.tsx)
const A4_W_PX = 794;

export default function Navbar() {
  const { setTheme, theme } = useTheme();
  const { t, lang, setLang } = useI18n();
  const { settings } = useCVStore();

  // Use the same outer padding as the CV spacing setting for PDF margins
  const PAGE_MARGIN_MM = parseInt(spacingMap[settings.spacing ?? "standard"].outer);

  const getElement = () => document.getElementById("cv-preview-container");

  const downloadPDF = async () => {
    const el = getElement();
    if (!el) return;
    try {
      // Capture the element at its real A4 pixel size regardless of CSS transform.
      const dataUrl = await toPng(el, {
        quality: 1,
        pixelRatio: 2,
        width: A4_W_PX,
        height: el.scrollHeight,   // full content height, not clipped
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
          opacity: "1", // Force fully visible capture, overriding the 0.01 layout hack
        },
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfW = pdf.internal.pageSize.getWidth();   // 210 mm
      const pdfH = pdf.internal.pageSize.getHeight();  // 297 mm

      // Content area after applying uniform top/bottom margin
      const contentW = pdfW - PAGE_MARGIN_MM * 2;
      const contentH = pdfH - PAGE_MARGIN_MM * 2;

      // Work out how many pages the content needs.
      const img = new Image();
      await new Promise<void>((res) => { img.onload = () => res(); img.src = dataUrl; });
      const imgNaturalH = img.naturalHeight;
      const imgNaturalW = img.naturalWidth;

      // Full mm height of the captured image (scaled to contentW)
      const imgMmH = (imgNaturalH / imgNaturalW) * contentW;
      const totalPages = Math.ceil(imgMmH / contentH);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();
        // Shift the image up by page * contentH, then offset by top margin so
        // content starts at PAGE_MARGIN_MM from the top on every page.
        pdf.addImage(
          dataUrl,
          "PNG",
          PAGE_MARGIN_MM,                          // x: left margin
          PAGE_MARGIN_MM - page * contentH,        // y: top margin – page offset
          contentW,                                // width inside margins
          imgMmH,                                  // full image height
        );
      }

      pdf.save("cv.pdf");
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  const downloadImage = async () => {
    const el = getElement();
    if (!el) return;
    try {
      const dataUrl = await toPng(el, {
        quality: 1,
        pixelRatio: 2,
        width: A4_W_PX,
        height: el.scrollHeight,
        style: { 
          transform: "scale(1)", 
          transformOrigin: "top left",
          opacity: "1", 
        },
      });
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

  const downloadWord = async () => {
    const el = getElement();
    if (!el) return;
    // Clone the element so we can mutate safely without touching the live DOM.
    const clone = el.cloneNode(true) as HTMLElement;

    // Task 2.1 / 11-fix: embed the profile image as a base64 data URI at its
    // *rendered* display size so Word shows it at the correct scale (not giant).
    const imgEls = Array.from(clone.querySelectorAll<HTMLImageElement>("img"));
    await Promise.all(
      imgEls.map(async (cloneImg, idx) => {
        const liveImg = el.querySelectorAll<HTMLImageElement>("img")[idx];
        if (!liveImg || !liveImg.src || liveImg.naturalWidth === 0) return;
        try {
          // Use the rendered display rect so Word gets the same size as the UI.
          const rect = liveImg.getBoundingClientRect();
          const dispW = Math.round(rect.width)  || liveImg.naturalWidth;
          const dispH = Math.round(rect.height) || liveImg.naturalHeight;

          const canvas  = document.createElement("canvas");
          canvas.width  = dispW;
          canvas.height = dispH;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          // Draw the live image scaled to the display size
          ctx.drawImage(liveImg, 0, 0, dispW, dispH);

          // Replace both src and explicit size on the cloned element
          cloneImg.src    = canvas.toDataURL("image/png");
          cloneImg.width  = dispW;
          cloneImg.height = dispH;
          cloneImg.style.width  = `${dispW}px`;
          cloneImg.style.height = `${dispH}px`;
        } catch {
          // Cross-origin: remove to avoid Word errors
          cloneImg.remove();
        }
      })
    );

    const header =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>CV</title></head><body>";
    const footer = "</body></html>";
    const source = "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(header + clone.innerHTML + footer);
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
