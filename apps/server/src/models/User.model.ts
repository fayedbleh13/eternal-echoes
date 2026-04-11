import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatar: { type: String },
    googleId: { type: String, unique: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);
