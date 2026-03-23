import InterviewSession from "../models/InterviewSession.js";
import Question from "../models/Question.js";
import { generateQuestions } from "../services/aiService.js";

export async function createSession(req, res) {
  const { role, company = "", level = "mid", topics = [] } = req.body;
  if (!role) return res.status(400).json({ message: "role is required" });

  const session = await InterviewSession.create({
    userId: req.user.id,
    role,
    company,
    level,
    topics
  });

  res.status(201).json(session);
}

export async function getSessions(req, res) {
  const sessions = await InterviewSession.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(sessions);
}

export async function generateSessionQuestions(req, res) {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, userId: req.user.id });
    if (!session) return res.status(404).json({ message: "Session not found" });

    await Question.deleteMany({ sessionId: session._id });

    const generated = await generateQuestions({
      role: session.role,
      level: session.level,
      company: session.company,
      topics: session.topics
    });

    const payload = generated.slice(0, 12).map((q) => ({
      sessionId: session._id,
      text: String(q.text || "").trim(),
      category: String(q.category || "general").trim(),
      difficulty: ["easy", "medium", "hard"].includes(String(q.difficulty).toLowerCase())
        ? String(q.difficulty).toLowerCase()
        : "medium"
    })).filter((q) => q.text.length > 0);

    const questions = await Question.insertMany(payload);
    res.status(201).json(questions);
  } catch (err) {
    if (err?.status === 429 || err?.code === "insufficient_quota") {
      return res.status(503).json({
        message: "AI quota exceeded. Please check OpenAI billing/usage and try again."
      });
    }
    return res.status(500).json({ message: err.message || "Failed to generate questions" });
  }
}

export async function getSessionQuestions(req, res) {
  const session = await InterviewSession.findOne({ _id: req.params.id, userId: req.user.id });
  if (!session) return res.status(404).json({ message: "Session not found" });

  const questions = await Question.find({ sessionId: session._id }).sort({ createdAt: 1 });
  res.json(questions);
}
