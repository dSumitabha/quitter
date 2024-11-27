import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Calls the Gemini API with a given prompt.
 * @param {string} prompt - The prompt to send to the API.
 * @returns {Promise<string>} - The raw response text from the Gemini API.
 */

export async function callGeminiAPI(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();  // Returns the raw text
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch data from Gemini.");
  }
}
