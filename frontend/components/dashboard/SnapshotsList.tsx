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
      <div className="text-center py-8 text-gray-500">
        <Database className="w-12 h-12 mx-auto mb-3 text-gray-400" />
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
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3 mb-2 sm:mb-0">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Database className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {t("admin.snapshots.lastCalculated")}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(snapshot.last_calculated_at)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-13 sm:ml-0">
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
