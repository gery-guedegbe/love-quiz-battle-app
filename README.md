# Love Quiz Battle

A full-stack web application for creating interactive quizzes and sharing them with a partner to discover compatibility through fun, personalized questions.

## Project Overview

**Love Quiz Battle** is a modern web application that enables users to:

- Create custom or predefined quizzes
- Share quizzes uniquely with a partner
- Track partner responses in real-time
- Generate fun, personalized results

## Project Structure

```
love-quiz-battle-app/
├── frontend/          # Next.js React application
├── backend/           # Express.js REST API
└── README.md          # This file
```

## Quick Start

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation & Setup

```bash
# Clone repository
git clone <repo-url>
cd love-quiz-battle-app

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Run Locally

**Terminal 1 - Backend (Port 5000):**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend (Port 3000):**

```bash
cd frontend
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Documentation

- **[Frontend README](./frontend/README.md)** - UI, setup, and deployment
- **[Backend README](./backend/README.md)** - API, security, and architecture

## Tech Stack

| Layer                | Technology                       |
| -------------------- | -------------------------------- |
| **Frontend**         | Next.js, TypeScript, TailwindCSS |
| **Backend**          | Node.js, Express.js              |
| **Database**         | PostgreSQL (Supabase)            |
| **State Management** | Zustand                          |

## License

MIT
