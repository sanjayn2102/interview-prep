# AI Job Interview Prep Tool (MERN)

MERN starter for an AI-powered interview preparation platform.

## Tech Stack
- MongoDB + Mongoose
- Express + Node.js
- React + Vite
- JWT Authentication
- OpenAI API integration for question generation and feedback

## Project Structure
- `server/` backend API
- `client/` frontend app

## Quick Start

### 1) Backend
```bash
cd server
npm install
cp .env.example .env
# set MONGO_URI, JWT_SECRET, OPENAI_API_KEY
npm run dev
```

### 2) Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

## Core API Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/sessions`
- `GET /api/sessions`
- `POST /api/sessions/:id/generate-questions`
- `POST /api/answers`
- `POST /api/answers/:id/evaluate`
- `GET /api/sessions/:id/report`

## Notes
- If `OPENAI_API_KEY` is missing, server returns deterministic fallback question/feedback JSON.
- Add HTTPS and secure cookie/auth strategy before production deployment.
