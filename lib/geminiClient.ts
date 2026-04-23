import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  console.error(
    "[Gemini] Missing EXPO_PUBLIC_GEMINI_API_KEY in environment variables"
  );
}

const genAI = new GoogleGenerativeAI(apiKey || "");

/**
 * Shared Gemini model instance.
 * Using gemini-2.5-flash for fast, cost-effective responses.
 */
export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 4096,
    responseMimeType: "application/json",
  },
});
