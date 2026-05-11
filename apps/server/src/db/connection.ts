import mongoose from "mongoose";
import * as dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI is not defined in environment variables.");
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ Successfully connected to MongoDB Atlas!");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};
