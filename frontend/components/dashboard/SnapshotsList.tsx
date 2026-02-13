"use client";

import { motion } from "motion/react";
import { Calendar, Database } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { AnalyticsSnapshot } from "@/types/types";

interface SnapshotsListProps {
  snapshots: AnalyticsSnapshot[];
}

export function SnapshotsList({ snapshots }: SnapshotsListProps) {
  const { t, language } = useLanguage();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === "fr" ? "fr-FR" : "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  if (snapshots.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <Database className="mx-auto mb-3 h-12 w-12 text-gray-400" />
        <p>No snapshots available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {snapshots.slice(0, 5).map((snapshot, index) => (
        <motion.div
          key={snapshot.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex flex-col justify-between rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 sm:flex-row sm:items-center"
        >
          <div className="mb-2 flex items-center gap-3 sm:mb-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
              <Database className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {t("admin.snapshots.lastCalculated")}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(snapshot.last_calculated_at)}</span>
              </div>
            </div>
          </div>

          <div className="ml-13 flex items-center gap-4 sm:ml-0">
            <div className="text-right">
              <p className="text-xs text-gray-500">Quizzes</p>
              <p className="text-sm font-semibold text-gray-900">
                {snapshot.total_quizzes}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Avg Score</p>
              <p className="text-sm font-semibold text-gray-900">
                {snapshot.average_score}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Completed</p>
              <p className="text-sm font-semibold text-gray-900">
                {snapshot.total_completed_quizzes}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
