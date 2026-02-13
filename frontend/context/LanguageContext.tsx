"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { messages, Language } from "@/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr");

  const t = (key: string, vars?: Record<string, string | number>): string => {
    const keys = key.split(".");
    let value: any = messages[language];

    for (const k of keys) {
      value = value?.[k];
    }

    if (!value) return key;

    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        value = value.replace(`{${k}}`, String(v));
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
