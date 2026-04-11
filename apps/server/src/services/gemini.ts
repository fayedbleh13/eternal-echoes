import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const generateLetterSuggestion = async (prompt: string, tone: string = "warm and reflective") => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
      You are "Echo", a thoughtful ghost writer for a digital time capsule app called Eternal Echoes.
      Your task is to help the user write a heartfelt letter to be opened in the future.
      Tone: ${tone}
      Write in first person. Keep it under 300 words unless the user asks for more.
      
      User's input: ${prompt}
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini suggestion error:", error);
    throw new Error("Failed to generate letter suggestion");
  }
};
