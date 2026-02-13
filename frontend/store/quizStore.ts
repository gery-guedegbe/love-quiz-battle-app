import { create } from "zustand";

type Role = "creator" | "partner" | null;

interface QuizState {
  quizId: string | null;
  creatorName: string;
  partnerName: string;
  questionCount: number;
  language: "fr" | "en";
  role: Role;
  token: string | null;
  expiresAt: string | null;
  answers: Record<string, number>;

  setCreatorName: (name: string) => void;
  setPartnerName: (name: string) => void;
  setQuestionCount: (count: number) => void;
  setLanguage: (lang: "fr" | "en") => void;
  setRole: (role: Role) => void;

  setSession: (data: {
    quizId: string;
    role: Role;
    token: string;
    expiresAt: string;
  }) => void;

  addAnswer: (questionId: string, index: number) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  quizId: null,
  role: null,
  token: null,
  expiresAt: null,
  answers: {},
  creatorName: "",
  partnerName: "",
  questionCount: 8,
  language: "fr",

  setCreatorName: (name) => set({ creatorName: name }),
  setPartnerName: (name) => set({ partnerName: name }),
  setQuestionCount: (count) => set({ questionCount: count }),
  setLanguage: (lang) => set({ language: lang }),
  setRole: (role: Role) => set({ role: role }),

  setSession: ({ quizId, role, token, expiresAt }) =>
    set({ quizId, role, token, expiresAt }),

  addAnswer: (questionId, index) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: index,
      },
    })),

  reset: () =>
    set({
      quizId: null,
      role: null,
      token: null,
      expiresAt: null,
      answers: {},
      partnerName: "",
      questionCount: 8,
    }),
}));
