import { promises as fs } from 'fs';
import path from 'path';
import { callGeminiAPI } from '../../utils/gemini';  // Import the Gemini interaction module

export async function POST(req) {
  try {
    const { topics } = await req.json(); // Expecting topics array in request body
    if (!Array.isArray(topics) || topics.length !== 5) {
      return new Response(JSON.stringify({ error: "Provide exactly 5 topics." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Load existing users
    const usersData = await fs.readFile(path.join(process.cwd(), 'data', 'users.json'), 'utf8');
    const users = JSON.parse(usersData);

    // Assign users to topics randomly
    const assignedTopics = topics.map((topic, index) => ({
      topic,
      userId: users[index % users.length].id, // Cycle through users
    }));

    // Prepare the prompt for Gemini
    const prompt = `
      Generate 5 factual posts, each 24 words, based on these topics. Return a JSON array of objects with 'content' only.
      Topics: ${assignedTopics.map(t => t.topic).join(", ")}
    `;

    // Call the Gemini API
    const apiResponse = await callGeminiAPI(prompt);
    const postsFromAI = JSON.parse(apiResponse);

    // Load existing posts
    const postsData = await fs.readFile(path.join(process.cwd(), 'data', 'posts.json'), 'utf8');
    const posts = JSON.parse(postsData);

    // Map AI responses to users and add metadata
    const newPosts = postsFromAI.map((post, index) => ({
      id: posts.length + index + 1,
      userId: assignedTopics[index].userId,
      content: post.content,
      likes: Math.floor(Math.random() * 40) + 10, // Randomize likes
      createdAt: new Date().toISOString().split('T')[0], // Today's date
    }));

    // Update posts.json with new posts
    posts.push(...newPosts);
    await fs.writeFile(path.join(process.cwd(), 'data', 'posts.json'), JSON.stringify(posts, null, 2));

    // Return the new posts
    return new Response(JSON.stringify(newPosts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in route:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
