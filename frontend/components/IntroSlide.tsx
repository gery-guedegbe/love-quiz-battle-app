import { motion } from "motion/react";
import { Heart, Sparkles } from "lucide-react";

import { Quiz } from "@/types/types";
import { useLanguage } from "@/context/LanguageContext";

interface IntroSlideProps {
  quiz: Quiz;
}

export function IntroSlide({ quiz }: IntroSlideProps) {
  const { t } = useLanguage();

  // Sync language with quiz language
  const currentLang = quiz.language || "en";

  // Format completion date safely
  const formattedDate =
    quiz.partner_completed && quiz.partner_completed_at
      ? new Date(quiz.partner_completed_at).toLocaleDateString(
          currentLang === "fr" ? "fr-FR" : "en-US",
          {
            month: "long",
            day: "numeric",
            year: "numeric",
          },
        )
      : null;

  return (
    <div className="from-primary/10 flex h-full flex-col items-center justify-center bg-linear-to-br via-white to-[#FFD700]/10 p-6 md:p-8">
      {/* Floating Hearts Animation */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "100%", x: `${(i * 12.5) % 100}%`, opacity: 0 }}
            animate={{
              y: "-20%",
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 8 + (i % 4) * 1.5,
              delay: i * 0.8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute"
          >
            <Heart className="text-primary fill-primary/20 h-8 w-8" />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        className="relative z-10 space-y-6 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
        >
          <Sparkles className="text-custom-yellow mx-auto h-14 w-16 md:h-16 md:w-16" />
        </motion.div>

        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-serif text-4xl leading-tight text-gray-900 md:text-5xl"
          >
            {t("results.intro.titleLine1")}
            <br />
            {t("results.intro.titleLine2")}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-3 font-serif text-2xl"
          >
            <span className="text-primary">{quiz.creator_name}</span>
            <Heart className="text-primary fill-primary h-6 w-6" />
            <span className="text-primary">{quiz.partner_name}</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pt-8"
        >
          <div className="inline-block rounded-full border border-gray-200 bg-white/80 px-6 py-3 shadow-lg backdrop-blur-sm">
            <p className="text-sm text-gray-600">
              {formattedDate ? (
                <>
                  {t("results.intro.completedOn")} {formattedDate}
                </>
              ) : (
                t("results.intro.loveStory")
              )}
            </p>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-4 text-sm text-gray-500"
        >
          {t("results.intro.tapToContinue")} →
        </motion.p>
      </motion.div>
    </div>
  );
}
