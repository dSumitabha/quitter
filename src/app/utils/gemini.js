import { GoogleGenerativeAI } from "@google/generative-ai";

export async function callGeminiAPI(topics) {
  console.log("Calling Gemini API...");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: "Always use the key 'author' to indicate the person who wrote the post. Never use 'user'."
   });
  const prompt = `Write posts on behalf of them, each within 24 words: ${Object.keys(topics).join(", ")}. The response must be a JSON array. Don't use emoji.`;

  //const prompt = `Return an JSON array of 5 jokes, within 20 words.`;

  //const mockResponse = [{ joke: "Why don't scientists trust atoms? Because they make up everything!" },{ joke: "Parallel lines have so much in common. It’s a shame they’ll never meet." },{ joke: "Why did the bicycle fall over? Because it was two tired." },{ joke: "What do you call a fake noodle? An impasta." },{ joke: "Why can't Monday lift Saturday? It's a weak day!" }];

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.candidates[0].content.parts[0].text;

    // Clean and parse the response to ensure it is a valid JSON array
    const cleanedResponse = response
    .replace(/```json\n|```/g, "") // Remove code block markers
    .trim(); // Remove unnecessary whitespace or newlines

    // Directly parse the JSON response, even if it's unexpected
    let posts = JSON.parse(cleanedResponse);
    // Add the "createdAt" field to each post
    
    posts = posts.map(post => ({
      ...post,
      createdAt: new Date().toISOString(), // Current timestamp in ISO format
      likes : 0,
    }));

    return posts; // Return the JSON array of posts
  } catch (error) {
    console.error("Error generating posts:", error);
    throw error;
  }
}