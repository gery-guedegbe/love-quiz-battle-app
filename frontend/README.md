# Frontend - Love Quiz Battle

Modern React-based user interface for creating, sharing and playing quizzes with partner compatibility results.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **State:** Zustand
- **Forms:** Formik + Yup
- **Animations:** Framer Motion
- **Internationalization:** i18n (EN / FR)
- **UI Components:** Custom components

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page
│   ├── admin/             # Admin dashboard
│   ├── create/            # Quiz creation
│   ├── play/              # Play quiz
│   ├── quiz/              # Quiz details
│   ├── history/           # Quiz history
│   ├── recap/             # Recap view
│   ├── result/            # Results page
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   ├── dashboard/         # Dashboard specific
│   └── ui/               # UI primitives
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── i18n/                 # Translation files
├── lib/                  # Utilities (API client)
├── services/             # Business logic services
├── store/                # Zustand stores
├── styles/               # Global styles
├── types/                # TypeScript types
└── utils/                # Helper functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Key Features

- **Quiz Creation:** Build custom quizzes with text or predefined questions
- **Partner Sharing:** Generate unique share links
- **Real-time Tracking:** Monitor partner responses
- **Bilingual:** English and French support
- **History:** Track all created quizzes
- **Responsive Design:** Mobile-friendly interface
- **Local Storage:** Persist quiz state

## API Integration

Frontend communicates with backend API at `http://localhost:5000/api`

### Core Endpoints Used:

- `POST /api/quizzes` - Create quiz
- `GET /api/quizzes/:id` - Fetch quiz details
- `GET /api/quizzes/share/:token` - Get shared quiz
- `POST /api/answers` - Submit answers
- `GET /api/results/:quizId` - Get results
- `GET /api/health` - Health check

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## License

MIT
