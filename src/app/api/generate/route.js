import { callGeminiAPI } from "../../utils/gemini";
import { selectTopics } from "../../utils/topicSelector";
import Post from '@/models/Post'; 
import connectDB from '@/lib/db';


export async function GET() {
  try {

    //Define the topics to be prompted
    const topics = await selectTopics(7);

    // Generate new posts using the Gemini API
    const newPosts = await callGeminiAPI(topics); // Fetches posts from Gemini API

    console.log("Posts generated successfully");
    
    const response = new Response(JSON.stringify({
        message: "Posts generated successfully",
        posts: newPosts ,
        topics: topics,
        totalPages: 2,
        currentPage: 1
      }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    // Perform the DB save in the background
    (async () => {
        try {
        await connectDB(); // Ensure DB connection
        // Format posts before saving
        const formattedPosts = newPosts.map(post => ({
            userId: post.userId, // Ensure this is an ObjectId
            content: post.post, // Convert 'post' to 'content'
            likes: 0,
            source: 1, // Default AI-generated source
            createdAt: post.createdAt || new Date()
        }));

        // Insert into database
        await Post.insertMany(formattedPosts);
        console.log("New posts saved to DB");
        } catch (dbError) {
        console.error("Error saving posts to DB:", dbError);
        }
    })();

    return response;
  } catch (error) {
    console.error("Error generating posts:", error);
    return new Response(JSON.stringify({ error: "Failed to generate posts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
