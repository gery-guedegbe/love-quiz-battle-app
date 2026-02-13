export type QuestionType = "yesno" | "multiple";

export interface QuestionOption {
  text: string;
  index: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  question_text: string;
  options: QuestionOption[];
  correct_answer_index?: number;
  is_custom?: boolean;
  is_active: boolean;
  order_index?: number;
}

export interface QuizSetup {
  language: "fr" | "en";
  creatorName: string;
  partnerName: string;
  questionCount: 8 | 15 | 20;
}

export interface CompletedBy {
  score: number;
  completedAt: string;
}

export interface Quiz {
  id: string;
  language: string;
  creator_name: string;
  partner_name: string;
  partner_completed: false;
  partner_session_id: string;
  question_count: number;
  questions: Question[];
  expires_at: string;
  creator_completed: boolean;
  creator_completed_at: string;
  partner_completed_at: string;
  creator_score: number;
  partner_score: number;
  created_at: string | Date;
  answers: {
    question_id: string;
    selected_option_index: number;
    player_type: string;
  }[];
}

export interface AnswerPayload {
  quizId: string;
  playerType: "creator" | "partner";
  token?: string;
  // Soit une réponse unique...
  questionId?: string | null;
  selectedOptionIndex?: number | null;
  // ...soit un batch de réponses
  batch?: { questionId: string; selectedOptionIndex: number }[];
}

export interface GlobalStats {
  totalQuizzes: number;
  totalQuestionsGenerated: number;
  totalCompletedQuizzes: number;
  averageScore: number;
}

export interface AnalyticsSnapshot {
  id: string;
  total_quizzes: number;
  total_questions_generated: number;
  total_completed_quizzes: number;
  average_score: number;
  last_calculated_at: string;
  created_at: string;
}

export interface AnalyticsSnapshotFormatted {
  id: string;
  totalQuizzes: number;
  totalQuestionsGenerated: number;
  totalCompletedQuizzes: number;
  averageScore: number;
  lastCalculatedAt: string;
  createdAt: string;
}

export interface APIError {
  error: string;
}
