import Answer from "../models/Answer.js";
import Feedback from "../models/Feedback.js";
import Question from "../models/Question.js";
import InterviewSession from "../models/InterviewSession.js";
import { evaluateAnswer } from "../services/aiService.js";

export async function submitAnswer(req, res) {
  const { questionId, sessionId, text, durationSec = 0 } = req.body;
  if (!questionId || !sessionId || !text) {
    return res.status(400).json({ message: "questionId, sessionId and text are required" });
  }

  const session = await InterviewSession.findOne({ _id: sessionId, userId: req.user.id });
  if (!session) return res.status(404).json({ message: "Session not found" });

  const question = await Question.findOne({ _id: questionId, sessionId });
  if (!question) return res.status(404).json({ message: "Question not found" });

  const answer = await Answer.create({
    questionId,
    sessionId,
    userId: req.user.id,
    text,
    durationSec
  });

  res.status(201).json(answer);
}

export async function evaluateSubmittedAnswer(req, res) {
  const answer = await Answer.findOne({ _id: req.params.id, userId: req.user.id });
  if (!answer) return res.status(404).json({ message: "Answer not found" });

  const existing = await Feedback.findOne({ answerId: answer._id });
  if (existing) return res.json(existing);

  const [question, session] = await Promise.all([
    Question.findById(answer.questionId),
    InterviewSession.findById(answer.sessionId)
  ]);

  if (!question || !session) return res.status(404).json({ message: "Related question/session not found" });

  const ai = await evaluateAnswer({
    questionText: question.text,
    answerText: answer.text,
    role: session.role,
    level: session.level
  });

  const feedback = await Feedback.create({
    answerId: answer._id,
    score: ai.score,
    strengths: ai.strengths,
    improvements: ai.improvements,
    rewrittenAnswer: ai.rewrittenAnswer
  });

  res.status(201).json(feedback);
}
