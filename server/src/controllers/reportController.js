import InterviewSession from "../models/InterviewSession.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import Feedback from "../models/Feedback.js";

export async function getSessionReport(req, res) {
  const session = await InterviewSession.findOne({ _id: req.params.id, userId: req.user.id });
  if (!session) return res.status(404).json({ message: "Session not found" });

  const questions = await Question.find({ sessionId: session._id });
  const questionIds = questions.map((q) => q._id);

  const answers = await Answer.find({ sessionId: session._id, userId: req.user.id });
  const feedbacks = await Feedback.find({ answerId: { $in: answers.map((a) => a._id) } });

  const avgScore = feedbacks.length
    ? Number((feedbacks.reduce((acc, f) => acc + f.score, 0) / feedbacks.length).toFixed(2))
    : 0;

  res.json({
    session,
    stats: {
      totalQuestions: questionIds.length,
      answered: answers.length,
      feedbackCount: feedbacks.length,
      averageScore: avgScore
    },
    answers,
    feedbacks
  });
}
