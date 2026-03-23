import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: { type: String, required: true, trim: true },
    company: { type: String, trim: true, default: "" },
    level: { type: String, required: true, enum: ["junior", "mid", "senior"] },
    topics: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

export default mongoose.model("InterviewSession", interviewSessionSchema);
