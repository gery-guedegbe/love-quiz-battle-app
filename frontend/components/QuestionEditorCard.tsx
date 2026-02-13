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
      className="bg-white rounded-3xl shadow-lg p-4 md:p-6 space-y-6"
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
            className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <Shuffle className="h-4 w-4 md:w-5 md:h-5 text-gray-600" />
          </motion.button>
        )}
      </div>

      {/* Question Text */}
      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-500 mb-2 ml-3">
          {t("creation.questionLabel")}
        </label>

        <InlineInput
          value={question.question_text}
          onChange={(value) => onUpdate({ question_text: value })}
          placeholder={t("creation.questionPlaceholder")}
          multiline
          maxLength={150}
          className="text-lg md:text-xl font-semibold text-gray-900"
        />
      </div>

      {/* Options */}
      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-500 mb-3 ml-3">
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
                  className={`w-full p-2 md:p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between gap-2 md:gap-3 min-h-11 ${
                    question.correct_answer_index === index
                      ? "bg-success/10 border-success"
                      : "bg-white border-gray-200 hover:border-gray-300"
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
                      className={`text-sm md:text-base font-medium ${
                        question.correct_answer_index === index
                          ? "text-success"
                          : "text-gray-900"
                      }`}
                    />
                  </div>

                  {question.correct_answer_index === index && (
                    <Check className="w-4 md:w-5 h-4 md:h-5 text-success shrink-0" />
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
                  className={`p-3 md:p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                    question.correct_answer_index === index
                      ? "bg-success/10 border-success shadow-lg"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`text-base md:text-2xl font-semibold ${
                      question.correct_answer_index === index
                        ? "text-success"
                        : "text-gray-900"
                    }`}
                  >
                    {option.text}
                  </span>

                  {question.correct_answer_index === index && (
                    <Check className="w-4 md:w-6 h-4 md:h-6 hidden md:flex text-success" />
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
