"use client";

import { motion } from "motion/react";
import { Globe } from "lucide-react";
import { Language } from "@/i18n";
import { useLanguage } from "@/context/LanguageContext";

export function GlobalLanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const languages: { value: Language; label: string }[] = [
    { value: "en", label: "EN" },
    { value: "fr", label: "FR" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2"
    >
      <Globe className="h-4 w-4 text-gray-500" />

      <div className="inline-flex gap-1 rounded-full border border-gray-200 bg-white/90 p-1 shadow-lg backdrop-blur-sm">
        {languages.map((lang) => (
          <button
            key={lang.value}
            onClick={() => setLanguage(lang.value)}
            className="relative min-h-8 min-w-8 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
          >
            {language === lang.value && (
              <motion.div
                layoutId="language-bg"
                className="bg-primary absolute inset-0 rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}

            <span
              className={`relative z-10 ${
                language === lang.value ? "text-white" : "text-gray-600"
              }`}
            >
              {lang.label}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
