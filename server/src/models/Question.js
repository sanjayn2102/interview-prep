import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "InterviewSession", required: true, index: true },
    text: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, required: true, enum: ["easy", "medium", "hard"] }
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
