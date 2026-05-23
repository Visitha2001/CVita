"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, LayoutTemplate, FileText, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    title: "Live Preview",
    description: "See your CV update in real-time as you type. No guessing.",
    icon: FileText,
  },
  {
    title: "Premium Templates",
    description: "Choose from dozens of ATS-friendly and creative layouts.",
    icon: LayoutTemplate,
  },
  {
    title: "One-Click Export",
    description: "Export your perfect CV to high-quality PDF instantly.",
    icon: Download,
  },
];

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has seen the welcome popup before
    const hasSeen = localStorage.getItem("vita-forge-welcome-seen");
    if (!hasSeen) {
      // Small delay for dramatic effect
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    localStorage.setItem("vita-forge-welcome-seen", "true");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-lg bg-card rounded-3xl border shadow-2xl overflow-hidden"
          >
            {/* Header pattern */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent pointer-events-none" />

            <div className="p-6 sm:p-8 relative">
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                Welcome to VitaForge
              </h2>
              <p className="text-muted-foreground mb-8">
                Build your professional CV in minutes with our powerful drag-and-drop builder. Here's what you can do:
              </p>

              <div className="space-y-6 mb-8">
                {FEATURES.map((feat, idx) => (
                  <motion.div
                    key={feat.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="mt-0.5 w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                      <feat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{feat.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {feat.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button onClick={closePopup} className="w-full text-base py-6 rounded-xl">
                Get Started
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
