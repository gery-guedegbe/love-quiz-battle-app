"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Heart, Sparkles } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/Button";
import { useQuizStore } from "@/store/quizStore";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { t, language } = useLanguage();
  const router = useRouter();

  const setCreatorName = useQuizStore((s) => s.setCreatorName);
  const setLanguage = useQuizStore((s) => s.setLanguage);

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError(t("landing.nameError"));
      return;
    }

    try {
      setLoading(true);

      // Save in global store
      setCreatorName(name.trim());

      // Optionnel : synchroniser langue avec store
      setLanguage(language);

      // Redirect vers setup
      router.push("/setup");
    } catch (err) {
      setError(`Something went wrong : ${err}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 md:p-6 max-w-md mx-auto">
      {/* Hero Section */}
      <div className=" flex flex-col items-center justify-center w-full space-y-8 py-8 md:py-12">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative"
        >
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            <Heart className="w-20 md:w-24 h-20 md:h-24 text-primary fill-primary" />
          </motion.div>

          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute top-2 -right-2 md:-top-2 md:-right-2"
          >
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-custom-yellow" />
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-3 md:space-y-4"
        >
          <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 leading-tight">
            {t("landing.title")}
            <br />
            <span className="text-primary">{t("landing.titleHighlight")}</span>
          </h1>

          <p className="text-base md:text-lg text-gray-600 max-w-sm">
            {t("landing.subtitle")}
          </p>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-2"
        >
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-primary-light rounded-full animate-pulse delay-75" />
          <div className="w-2 h-2 bg-primary-lighter rounded-full animate-pulse delay-150" />
        </motion.div>
      </div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full space-y-4 pb-6"
      >
        <Input
          value={name}
          onChange={(value) => {
            setName(value);
            setError("");
          }}
          placeholder={t("landing.namePlaceholder")}
          label={t("landing.nameLabel")}
          error={error}
          maxLength={20}
        />

        <Button onClick={handleSubmit} fullWidth>
          {t("landing.createButton")}
        </Button>

        <p className="text-xs text-center mt-6 text-gray-500">
          {t("landing.footer")}
        </p>
      </motion.div>
    </div>
  );
}
