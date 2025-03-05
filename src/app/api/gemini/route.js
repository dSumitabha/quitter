import { promises as fs } from "fs";
import path from "path";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // Query parameters
  const currentPage = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const source = parseInt(searchParams.get("source") || "0"); // 0: stored, 1: AI
  
  try {
    const postsFilePath = path.join(process.cwd(), "data", "posts.json");
    const data = await fs.readFile(postsFilePath, "utf-8");
    const allPosts = JSON.parse(data);

    // Filter posts based on the source parameter
    const filteredPosts = allPosts.filter(post => post.source === source);

    // Calculate total pages
    const totalPages = Math.ceil(filteredPosts.length / limit);

    // Paginate the filtered posts
    const startIndex = (currentPage - 1) * limit;
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit);

    return new Response(JSON.stringify({
      posts: paginatedPosts,
      totalPages,
      currentPage
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch posts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}