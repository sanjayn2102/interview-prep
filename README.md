# AI Interview Prep Tool

A full-stack interview practice platform that helps users create mock interview sessions, generate tailored questions with AI, submit answers, and review feedback reports.

## Overview

This project is built as a MERN-style application with a React frontend and a Node.js/Express backend. Users can:

- register and log in securely
- create interview sessions based on role, level, company, and topics
- generate interview questions using OpenAI
- submit answers for practice
- receive AI-based feedback and score summaries
- review session-level reports

## Features

- JWT-based authentication
- Protected frontend routes
- Session creation and session history
- AI-generated interview questions
- Answer submission and evaluation flow
- Report view with feedback statistics
- MongoDB persistence for users, sessions, questions, answers, and feedback

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- OpenAI API

## Project Structure

```text
interview-prep/
|- client/   # React + Vite frontend
|- server/   # Express + MongoDB backend
|- README.md
```

## Environment Variables

Create local `.env` files inside `server/` and `client/`.

### `server/.env`

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/interview_prep
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
ALLOW_LOCAL_QUESTION_FALLBACK=false
CLIENT_ORIGIN=http://localhost:5173
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5001/api
```

## Getting Started

### 1. Install dependencies

Backend:

```bash
cd server
npm install
```

Frontend:

```bash
cd client
npm install
```

### 2. Start the backend

```bash
cd server
npm start
```

Runs the API on `http://localhost:5001`.

### 3. Start the frontend

```bash
cd client
npm start
```

Runs the app on `http://127.0.0.1:5173`.

## Available Scripts

### Backend

From `server/`:

```bash
npm start
```

Starts the Express server.

```bash
npm run dev
```

Starts the backend with `nodemon`.

### Frontend

From `client/`:

```bash
npm start
```

Starts the Vite dev server on `127.0.0.1`.

```bash
npm run dev
```

Starts the standard Vite dev server.

```bash
npm run build
```

Builds the frontend for production.

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Sessions

- `POST /api/sessions`
- `GET /api/sessions`
- `POST /api/sessions/:id/generate-questions`
- `GET /api/sessions/:id/questions`
- `GET /api/sessions/:id/report`

### Answers

- `POST /api/answers`
- `POST /api/answers/:id/evaluate`

### Health Check

- `GET /api/health`

## Workflow

1. Register or log in
2. Create an interview session
3. Generate questions for the selected role
4. Submit answers to individual questions
5. Evaluate answers and review feedback
6. Track performance in the session report

## Data Models

The backend stores:

- `User`
- `InterviewSession`
- `Question`
- `Answer`
- `Feedback`

## Notes

- Keep `.env` files private and never commit secrets.
- If OpenAI is unavailable, the backend can optionally fall back to local question generation depending on `ALLOW_LOCAL_QUESTION_FALLBACK`.
- MongoDB must be running locally unless you switch `MONGO_URI` to a hosted database.
- The frontend expects the backend API URL from `client/.env`.

## Future Improvements

- Add speech-based answer practice
- Add timer-based mock interview mode
- Add richer analytics dashboards
- Add admin/demo deployment configuration
- Add test coverage for API routes and UI flows

## Author

**Sanjay N**  
GitHub: https://github.com/sanjayn2102
