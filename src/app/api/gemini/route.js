import { GoogleGenerativeAI } from '@google/generative-ai';
import Result from 'postcss/lib/result';


export async function GET() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const topics = { techSpace: true, ecoExplorer: true, aiAdvocateSarah: true, devDivaEmily: true, growthMasterAlex: true };

  // Create a simple prompt using the provided topics
  const prompt = `Return an JSON array of 5 jokes, within 20 words.`;

  try {
    let result = await model.generateContent(prompt);

    const jokes = result.response.candidates[0].content.parts[0].text;


    return new Response(JSON.stringify(jokes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error generating posts:", error);
    return new Response(JSON.stringify({ error: 'Failed to generate posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}