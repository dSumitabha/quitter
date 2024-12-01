import { GoogleGenerativeAI } from "@google/generative-ai";

export async function callGeminiAPI(topics) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Create a simple prompt using the provided topics
  const prompt = `Write posts on behalf of them, each within 24 words: ${Object.keys(topics).join(', ')}`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.candidates[0].content.parts[0].text;

    // Directly parse the JSON response, even if it's unexpected
    const posts = JSON.parse(response);

    return posts; // Return the JSON array of posts
  } catch (error) {
    console.error("Error generating posts:", error);
    throw error;
  }
}