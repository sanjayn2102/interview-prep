import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true, index: true },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "InterviewSession", required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    text: { type: String, required: true },
    durationSec: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Answer", answerSchema);
