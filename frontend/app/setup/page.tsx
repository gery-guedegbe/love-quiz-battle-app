"use client";

import { SelectableCard } from "@/components/SelectableCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLanguage } from "@/context/LanguageContext";
import { useQuizStore } from "@/store/quizStore";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { SegmentedControl } from "@/components/SegmentedControl";

export default function SetupPage() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(language || "");

  const {
    partnerName: storePartnerName,
    questionCount: storeQuestionCount,
    role,
    setPartnerName,
    setQuestionCount,
    setRole,
  } = useQuizStore();

  const [step, setStep] = useState(1);
  const [partnerName, setLocalPartnerName] = useState(storePartnerName);
  const [questionCount, setLocalQuestionCount] = useState(storeQuestionCount);
  const [error, setError] = useState("");

  const totalSteps = 3;

  // Access Control
  useEffect(() => {
    if (role === "partner") {
      router.replace("/");
    }
  }, [role, router]);

  const handleNext = () => {
    if (step === 1) {
      if (!partnerName.trim()) {
        setError(t("setup.step1Error"));
        return;
      }
      setStep(2);
      setError("");
      return;
    }

    if (step === 2) {
      if (!selectedLanguage) {
        setError(t("setup.languageError"));
        return;
      }

      setLanguage(selectedLanguage);
      setStep(3);
      setError("");
      return;
    }

    // FINAL STEP (step 3)
    setPartnerName(partnerName.trim());
    setQuestionCount(questionCount);
    setRole("creator");

    router.push("/create");
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError("");
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const handleSelectOption = (value: number) => {
    setLocalQuestionCount(value);
    setQuestionCount(value);
  };

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-0 min-w-11 min-h-11 flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>

          <span className="text-sm font-medium text-gray-600">
            {step} / {totalSteps}
          </span>

          <div className="w-11" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="space-y-8"
            >
              <div className="space-y-3 lg:space-y-4 ">
                <h2 className="text-4xl font-serif text-gray-900">
                  {t("setup.step1Title")}
                  <br />
                  {t("setup.step1TitleBreak")}
                </h2>

                <p className="text-gray-600">{t("setup.step1Subtitle")}</p>
              </div>

              <Input
                value={partnerName}
                onChange={(value) => {
                  setLocalPartnerName(value);
                  setError("");
                }}
                placeholder={t("setup.step1Placeholder")}
                label={t("setup.step1Label")}
                error={error}
                maxLength={20}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={2}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="space-y-8"
            >
              <div className="space-y-3 md:space-y-4">
                <h2 className="text-4xl font-serif text-gray-900">
                  {t("setup.languageTitle")}
                  <br />
                  {t("setup.languageTitleBreak")}
                </h2>

                <p className="text-gray-600">{t("setup.languageSubtitle")}</p>
              </div>

              <div className="flex justify-start">
                <SegmentedControl
                  options={[
                    { value: "en", label: t("setup.languageIsEnglish") },
                    { value: "fr", label: t("setup.languageIsFrench") },
                  ]}
                  selected={selectedLanguage}
                  onChange={(value) => {
                    setSelectedLanguage(value as "en" | "fr");
                    setLanguage(value as "en" | "fr");
                    setError("");
                  }}
                />

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="space-y-4"
            >
              <div className="space-y-3 lg:space-y-4">
                <h2 className="text-4xl font-serif text-gray-900">
                  {t("setup.step2Title")}
                  <br />
                  {t("setup.step2TitleBreak")}
                </h2>

                <p className="text-gray-600">{t("setup.step2Subtitle")}</p>
              </div>

              <div className="space-y-3 mt-6">
                {[
                  {
                    value: 8,
                    label: t("setup.step2Option1"),
                    description: t("setup.step2Option1Desc"),
                  },
                  {
                    value: 15,
                    label: t("setup.step2Option2"),
                    description: t("setup.step2Option2Desc"),
                  },
                  {
                    value: 20,
                    label: t("setup.step2Option3"),
                    description: t("setup.step2Option3Desc"),
                  },
                ].map((option) => (
                  <SelectableCard
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    description={option.description}
                    selected={questionCount === option.value}
                    onClick={() => handleSelectOption(option.value)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="py-6">
        <Button onClick={handleNext} fullWidth>
          {step === totalSteps
            ? t("setup.startButton")
            : t("setup.continueButton")}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
