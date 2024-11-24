import axios from 'axios';

export async function GET(request) {
  //const { prompt } = await request.json();  // Get the prompt from request body
    const prompt = "generate a post on technology within 20 words"

  try {
    const response = await axios.post(
      'https://your-gemini-endpoint-url',  // Replace with the actual URL
      { prompt },  // Data to send
      { headers: { 'Authorization': `Bearer ${process.env.GEMINI_API_KEY}` } }
    );

    return new Response(JSON.stringify(response.data), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to generate content' }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
