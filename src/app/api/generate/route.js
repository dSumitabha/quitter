import { callGeminiAPI } from "../../utils/gemini";
import { selectTopics } from "../../utils/topicSelector";



export async function GET() {
  try {

    //Define the topics to be prompted
    const topics = await selectTopics(7);
console.log(topics);
    // Generate new posts using the Gemini API
    const newPosts = await callGeminiAPI(topics); // Fetches posts from Gemini API

    console.log("Posts generated successfully");
    
    return new Response(JSON.stringify({
        message: "Posts generated successfully",
        posts: newPosts ,
        topics: topics,
        totalPages: 2,
        currentPage: 1
      }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating posts:", error);
    return new Response(JSON.stringify({ error: "Failed to generate posts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
