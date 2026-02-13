# Backend - Love Quiz Battle

REST API server for managing quizzes, responses and analytics with production-grade security and reliability.

## Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** PostgreSQL (Supabase)
- **Validation:** Yup + Formik (frontend), custom validation (backend)
- **Security:** Helmet, CORS, Rate Limiting, Timing-safe auth
- **Documentation:** Swagger/OpenAPI
- **Logging:** Console with IP hashing

## Project Structure

```
backend/
├── src/
│   ├── app.js                  # Express app configuration
│   ├── server.js               # Server entry point
│   ├── config/                 # Configuration
│   │   ├── db.js              # Supabase client
│   │   ├── swagger.js         # Swagger documentation
│   │   └── seed/              # Database seeding
│   ├── controllers/            # Request handlers
│   │   ├── quizzesController.js
│   │   ├── answersController.js
│   │   ├── questionsController.js
│   │   ├── resultsController.js
│   │   └── analyticsController.js
│   ├── middlewares/            # Express middlewares
│   │   ├── adminGuard.js
│   │   ├── adminRateLimit.js
│   │   ├── verifyQuizAccess.js
│   │   └── auditLog.js
│   ├── routes/                 # API routes
│   │   ├── quizzes.js
│   │   ├── answers.js
│   │   ├── questions.js
│   │   ├── results.js
│   │   ├── analytics.js
│   │   └── health.js
│   ├── services/               # Business logic
│   │   ├── quizzesService.js
│   │   ├── answersService.js
│   │   └── questionsService.js
│   ├── models/                 # Database models
│   │   ├── Quiz.js
│   │   ├── Answer.js
│   │   ├── Question.js
│   │   ├── QuizQuestion.js
│   │   ├── Result.js
│   │   └── Analytics.js
│   └── utils/                  # Helper functions
├── .env.example               # Environment template
├── package.json               # Dependencies
└── predef-quiz.json          # Predefined questions
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account with PostgreSQL database

### Installation

```bash
cd backend
npm install
```

### Configuration

Create `.env` file (copy from `.env.example`):

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/db
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
ADMIN_ANALYTICS_KEY=your-admin-key
FRONTEND_DOMAIN=http://localhost:3000
```

Generate a strong admin key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`
Swagger docs at `http://localhost:5000/api/docs`

### Production Build

```bash
npm start
```

## 📡 API Endpoints

### Public Endpoints

| Method | Endpoint                    | Description                       |
| ------ | --------------------------- | --------------------------------- |
| `GET`  | `/api/health`               | Health check with DB connectivity |
| `POST` | `/api/quizzes`              | Create new quiz                   |
| `GET`  | `/api/quizzes/:id`          | Get quiz details                  |
| `GET`  | `/api/quizzes/share/:token` | Get quiz by share token           |
| `GET`  | `/api/questions`            | Get random questions              |
| `POST` | `/api/answers`              | Submit answers                    |
| `GET`  | `/api/results/:quizId`      | Get quiz results                  |

### Admin Endpoints (Requires `x-admin-key` header)

| Method | Endpoint                   | Description                |
| ------ | -------------------------- | -------------------------- |
| `GET`  | `/api/analytics`           | Get global analytics       |
| `POST` | `/api/analytics/snapshot`  | Create analytics snapshot  |
| `GET`  | `/api/analytics/snapshots` | List snapshots (paginated) |

## Security Features

**Production-Ready:**

- ✅ Timing-safe API key comparison
- ✅ CORS whitelist (frontend domain only)
- ✅ Rate limiting (100 requests/hour public, 50/15min admin)
- ✅ Request size limits (1MB max)
- ✅ HTTPS enforcement + HSTS headers
- ✅ Helmet security headers
- ✅ IP hashing in logs (GDPR compliant)
- ✅ Error messages don't leak system info
- ✅ Admin audit logging
- ✅ Health check with DB connectivity verification

**Infrastructure:**

- Supabase handles Row Level Security (RLS)
- Service Role Key for backend operations
- Anon Key for frontend (if frontend auth needed)

## Request/Response Format

### Create Quiz

```http
POST /api/quizzes
Content-Type: application/json

{
  "language": "en",
  "creatorName": "Alice",
  "partnerName": "Bob",
  "questionCount": 8,
  "questions": [
    {
      "questionText": "Question?",
      "type": "multiple",
      "options": [
        {"text": "Option 1", "index": 0},
        {"text": "Option 2", "index": 1}
      ],
      "correctAnswerIndex": 0,
      "isCustom": true
    }
  ]
}
```

### Submit Answers

```http
POST /api/answers
Content-Type: application/json

{
  "quizId": "abc123",
  "playerType": "partner",
  "batch": [
    {"questionId": "q1", "selectedOptionIndex": 0},
    {"questionId": "q2", "selectedOptionIndex": 1}
  ]
}
```

## Testing

```bash
# Syntax check
node -c src/app.js

# Run development server
npm run dev

# Health check
curl http://localhost:5000/api/health

# Check dependencies
npm audit
```

## Dependencies

**Core:**

- express 5.2.1
- @supabase/supabase-js 2.95.3

**Security:**

- helmet 8.1.0
- cors 2.8.6
- express-rate-limit 8.2.1

**Utilities:**

- dotenv 17.2.4
- nanoid 5.1.6

**Database:**

- pg 8.18.0
- postgres 3.4.8

**Documentation:**

- swagger-jsdoc 6.2.8
- swagger-ui-express 5.0.1

## License

MIT
