import mongoose from "mongoose";

const letterSchema = new mongoose.Schema(
  {
    capsuleId: { type: mongoose.Schema.Types.ObjectId, ref: "Capsule", required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String },
    content: { type: String, required: true },
    mediaUrls: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const LetterModel = mongoose.model("Letter", letterSchema);
