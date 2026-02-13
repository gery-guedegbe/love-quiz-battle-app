"use client";

import { motion } from "motion/react";
import { Eye } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface RecentQuiz {
  id: string;
  creatorName: string;
  partnerName: string;
  questionCount: number;
  status: "completed" | "pending";
  score: number;
  createdAt: Date;
}

interface RecentQuizzesTableProps {
  quizzes: RecentQuiz[];
  onViewDetails: (quizId: string) => void;
}

export function RecentQuizzesTable({
  quizzes,
  onViewDetails,
}: RecentQuizzesTableProps) {
  const { t, language } = useLanguage();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (quizzes.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500">{t("admin.recent.noData")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {t("admin.recent.creator")}
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {t("admin.recent.partner")}
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {t("admin.recent.questions")}
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {t("admin.recent.status")}
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {t("admin.recent.score")}
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {t("admin.recent.created")}
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {t("admin.recent.action")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {quizzes.map((quiz, index) => (
              <motion.tr
                key={quiz.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {quiz.creatorName}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {quiz.partnerName}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {quiz.questionCount}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      quiz.status === "completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {quiz.status === "completed"
                      ? t("admin.recent.completed")
                      : t("admin.recent.pending")}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {quiz.status === "completed" ? `${quiz.score}%` : "—"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(quiz.createdAt)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onViewDetails(quiz.id)}
                    className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-700 font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    {t("admin.recent.view")}
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-200">
        {quizzes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-gray-900">{quiz.creatorName}</p>
                <p className="text-sm text-gray-600">→ {quiz.partnerName}</p>
              </div>

              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  quiz.status === "completed"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {quiz.status === "completed"
                  ? t("admin.recent.completed")
                  : t("admin.recent.pending")}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span>
                {quiz.questionCount} {t("admin.recent.questions").toLowerCase()}
              </span>

              <span>{formatDate(quiz.createdAt)}</span>
            </div>

            {quiz.status === "completed" && (
              <p className="text-sm font-medium text-gray-900 mb-3">
                {t("admin.recent.score")}: {quiz.score}%
              </p>
            )}

            <button
              onClick={() => onViewDetails(quiz.id)}
              className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-700 font-medium text-sm"
            >
              <Eye className="w-4 h-4" />

              {t("admin.recent.viewDetails")}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
