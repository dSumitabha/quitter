import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "Machine Lerarning";

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();  // Extract generated text

    return new Response(JSON.stringify({ content: responseText }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching content from Gemini:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch content from Gemini" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
