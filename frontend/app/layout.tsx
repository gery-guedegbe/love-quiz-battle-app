import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { GlobalLanguageToggle } from "@/components/GlobalLanguageToggle";
import { HistoryHeaderButton } from "@/components/HistoryHeaderButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yourdomain.com"),
  title: {
    default: "Do You Really Know Me ?",
    template: "%s | Do You Really Know Me",
  },
  description:
    "Crée un quiz de couple personnalisé, compare vos réponses et découvre à quel point vous vous connaissez vraiment. Un jeu interactif, fun et intime à partager à deux.",
  keywords: [
    "quiz couple",
    "questions de couple",
    "jeu amoureux",
    "quiz amoureux",
    "test de compatibilité",
    "questions pour couple",
    "quiz relation",
    "jeu à deux",
    "relationship quiz",
    "couple questions",
    "love quiz",
    "interactive quiz",
    "compatibility test",
  ],
  authors: [{ name: "Géry GUEDEGBE" }],
  creator: "Géry GUEDEGBE",
  openGraph: {
    title: "Do You Really Know Me ?",
    description:
      "Crée un quiz privé à partager avec ton/ta partenaire et découvrez ensemble à quel point vous vous connaissez.",
    url: "https://yourdomain.com",
    siteName: "Do You Really Know Me",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Do You Really Know Me ?",
    description:
      "Un quiz interactif pour tester votre complicité et comparer vos réponses.",
  },
};

// export const metadata: Metadata = {
//   metadataBase: new URL("https://yourdomain.com"),
//   title: {
//     default: "Do You Really Know Me?",
//     template: "%s | Do You Really Know Me",
//   },
//   description:
//     "Create relationship quizzes, compare answers and discover how well you truly know each other.",
//   keywords: [
//     "relationship quiz",
//     "couple questions",
//     "love quiz",
//     "interactive quiz",
//     "compatibility test",
//   ],
//   authors: [{ name: "Géry GUEDEGBE" }],
//   creator: "Géry GUEDEGBE",
//   openGraph: {
//     title: "Do You Really Know Me?",
//     description:
//       "Create a private quiz and see how well your partner really knows you.",
//     url: "https://yourdomain.com",
//     siteName: "Do You Really Know Me",
//     locale: "fr_FR",
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Do You Really Know Me?",
//     description: "Create a private quiz and compare your answers instantly.",
//   },
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <LanguageProvider>
          <div className="fixed top-4 right-0 z-50 flex w-full items-center justify-between gap-2 bg-transparent px-3 py-1 md:top-2 md:right-0 md:px-6 md:py-4 lg:gap-3">
            {/* <RecapHeaderButton /> */}
            <HistoryHeaderButton />

            <GlobalLanguageToggle />
          </div>

          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
