import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

export const generateLetterSuggestion = async (prompt: string, tone: string = "warm and reflective") => {
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in environment variables");
    throw new Error("AI service is not configured. Please set GEMINI_API_KEY in your .env file.");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
  } catch (error: any) {
    console.error("Gemini suggestion error:", error);
    
    if (error.status === 404) {
      throw new Error("AI service unavailable. Please check your GEMINI_API_KEY configuration.");
    }
    if (error.status === 403) {
      throw new Error("Invalid API key. Please verify your GEMINI_API_KEY is correct.");
    }
    
    throw new Error("Failed to generate letter suggestion. Please try again later.");
  }
};
