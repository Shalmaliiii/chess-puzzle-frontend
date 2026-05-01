# Chess Puzzle Frontend

React + TypeScript frontend for the Chess Puzzle Platform. Interactive chessboard UI for solving "Mate in N" chess puzzles with user authentication, rating tracking, and leaderboards.

## Tech Stack

- **React 18** with TypeScript
- **Vite** — build tooling
- **Tailwind CSS** — styling
- **Zustand** — state management
- **react-chessboard** + **chess.js** — chess UI and move validation
- **Recharts** — dashboard charts
- **Axios** — HTTP client
- **React Router v6** — client-side routing

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | Email/password authentication |
| `/register` | Register | New user registration |
| `/` | Dashboard | Stats overview, charts, recent puzzles |
| `/puzzle` | Puzzle | Interactive chessboard puzzle solving |
| `/leaderboard` | Leaderboard | Top players ranked by rating |
| `/admin` | Admin | Puzzle generation controls (admin only) |

## Project Structure

```
src/
├── components/        # Shared UI components
├── hooks/             # Custom React hooks
├── pages/             # Route-level page components
├── services/          # API service layer (axios)
├── stores/            # Zustand state stores
└── types/             # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 22+
- Backend services running (API Gateway on port 8080)

### Development

```bash
# Install dependencies
npm install

# Start dev server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

### Docker

```bash
docker build -t chess-puzzle-frontend .
docker run -p 80:80 chess-puzzle-frontend
```

## Backend Services

This frontend connects to the following microservices via the API Gateway:

- **User Service** (`/api/users/**`, `/api/auth/**`) — Authentication, profiles, leaderboard
- **Puzzle Service** (`/api/puzzles/**`) — Puzzle serving, move validation, generation triggers
- **Engine Service** (`/api/engine/**`) — Stockfish analysis, engine health
