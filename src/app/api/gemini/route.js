
import { callGeminiAPI } from '../../utils/gemini';

export async function POST(req) {
  try {
    const { topics } = await req.json();
    console.log("Received topics:", topics);

    if (!Array.isArray(topics) || topics.length !== 5) {
      return new Response(JSON.stringify({ error: "Provide exactly 5 topics." }), { status: 400 });
    }

    // Call the Gemini API
    const prompt = `Generate 5 factual posts...`;  // Simplified for now
    console.log("Prompt for Gemini:", prompt);

    const apiResponse = await callGeminiAPI(prompt);
    console.log("Gemini API response:", apiResponse);

    return new Response(JSON.stringify(apiResponse), { status: 200 });
  } catch (error) {
    console.error("Error in generate/route.js:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
