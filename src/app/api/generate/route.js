import { callGeminiAPI } from "../../utils/gemini";
import { promises as fs } from "fs";
import path from "path";

export async function POST() {
  try {

    //Define the topics to be prompted
    const topics = { techSpace: true, ecoExplorerJS: true, aiAdvocateSarah: true, devDivaEmily: true, growthMasterAlex: true };
    // Generate new posts using the Gemini API
    const newPosts = await callGeminiAPI(topics); // Fetches posts from Gemini API

    // Load existing posts from the file
    //const postsFilePath = path.join(process.cwd(), "data", "posts.json");
    //const data = await fs.readFile(postsFilePath, "utf-8");
    //const existingPosts = JSON.parse(data);

    // Append new posts to the existing ones
   // const updatedPosts = [...newPosts, ...existingPosts];

    // Save the updated post list back to the file
    //await fs.writeFile(postsFilePath, JSON.stringify(updatedPosts, null, 2));

    return new Response(JSON.stringify({ message: "Posts generated successfully", posts: newPosts }), {
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
