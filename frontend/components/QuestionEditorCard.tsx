import { motion, AnimatePresence } from "motion/react";
import { Shuffle, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { TypeSwitcher } from "./TypeSwitcher";
import { InlineInput } from "./InlineInput";
import { Question } from "@/types/types";
import { useQuizStore } from "@/store/quizStore";
import { questionTypeToUiType, uiTypeToQuestionType } from "@/utils/utils";

interface QuestionEditorCardProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  onShuffle?: () => void;
  showShuffle?: boolean;
}

export function QuestionEditorCard({
  question,
  onUpdate,
  onShuffle,
  showShuffle = true,
}: QuestionEditorCardProps) {
  const { t } = useLanguage();
  const role = useQuizStore((s) => s.role);

  const updateOption = (index: number, value: string) => {
    const newOptions = [...question.options];
    newOptions[index] = { ...newOptions[index], text: value };
    onUpdate({ options: newOptions });
  };

  const handleTypeChange = (type: "multiple-choice" | "yes-no") => {
    const newType = uiTypeToQuestionType(type);
    if (newType === question.type) return;

    onUpdate({
      type: newType,
      options:
        newType === "yesno"
          ? [
              { text: "Yes", index: 0 },
              { text: "No", index: 1 },
            ]
          : Array.from({ length: 4 }, (_, i) => ({ text: "", index: i })),
      correct_answer_index: 0,
    });
  };

  return (
    <motion.div
      layout
      className="space-y-6 rounded-3xl bg-white p-4 shadow-lg md:p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        {/* <TypeSwitcher
          type={questionTypeToUiType(question.type)}
          onChange={handleTypeChange}
          disabled={question.is_custom || role !== "creator"}
        /> */}

        <TypeSwitcher
          type={questionTypeToUiType(question.type)}
          onChange={handleTypeChange}
          disabled={question.is_custom !== true || role !== "creator"}
        />

        {showShuffle && !question.is_custom && role === "creator" && (
          <motion.button
            onClick={onShuffle}
            whileTap={{ scale: 0.9, rotate: 180 }}
            className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <Shuffle className="h-4 w-4 text-gray-600 md:h-5 md:w-5" />
          </motion.button>
        )}
      </div>

      {/* Question Text */}
      <div>
        <label className="mb-2 ml-3 block text-xs font-medium text-gray-500 md:text-sm">
          {t("creation.questionLabel")}
        </label>

        <InlineInput
          value={question.question_text}
          onChange={(value) => onUpdate({ question_text: value })}
          placeholder={t("creation.questionPlaceholder")}
          multiline
          maxLength={150}
          className="text-lg font-semibold text-gray-900 md:text-xl"
        />
      </div>

      {/* Options */}
      <div>
        <label className="mb-3 ml-3 block text-xs font-medium text-gray-500 md:text-sm">
          {t("creation.optionsLabel")}
        </label>

        <AnimatePresence mode="wait">
          {question.type === "multiple" ? (
            <motion.div
              key="multiple"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  layout
                  onClick={() =>
                    role === "creator" &&
                    onUpdate({ correct_answer_index: index })
                  }
                  className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-2xl border-2 p-2 text-left transition-all md:gap-3 md:p-4 ${
                    question.correct_answer_index === index
                      ? "bg-success/10 border-success"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex-1">
                    <InlineInput
                      value={option.text}
                      onChange={(value) => updateOption(index, value)}
                      placeholder={`${t("creation.optionPlaceholder")} ${String.fromCharCode(
                        65 + index,
                      )}`}
                      maxLength={80}
                      className={`text-sm font-medium md:text-base ${
                        question.correct_answer_index === index
                          ? "text-success"
                          : "text-gray-900"
                      }`}
                    />
                  </div>

                  {question.correct_answer_index === index && (
                    <Check className="text-success h-4 w-4 shrink-0 md:h-5 md:w-5" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="yesno"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  layout
                  onClick={() =>
                    role === "creator" &&
                    onUpdate({ correct_answer_index: index })
                  }
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-3 transition-all md:p-6 ${
                    question.correct_answer_index === index
                      ? "bg-success/10 border-success shadow-lg"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`text-base font-semibold md:text-2xl ${
                      question.correct_answer_index === index
                        ? "text-success"
                        : "text-gray-900"
                    }`}
                  >
                    {option.text}
                  </span>

                  {question.correct_answer_index === index && (
                    <Check className="text-success hidden h-4 w-4 md:flex md:h-6 md:w-6" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
