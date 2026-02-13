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
      <Globe className="w-4 h-4 text-gray-500" />

      <div className="inline-flex bg-white/90 backdrop-blur-sm shadow-lg rounded-full p-1 gap-1 border border-gray-200">
        {languages.map((lang) => (
          <button
            key={lang.value}
            onClick={() => setLanguage(lang.value)}
            className="relative px-3 py-1.5 rounded-full text-xs font-semibold transition-colors min-h-8 min-w-8"
          >
            {language === lang.value && (
              <motion.div
                layoutId="language-bg"
                className="absolute inset-0 bg-primary rounded-full"
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
