import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    answerId: { type: mongoose.Schema.Types.ObjectId, ref: "Answer", required: true, unique: true, index: true },
    score: { type: Number, required: true, min: 0, max: 10 },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    rewrittenAnswer: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
