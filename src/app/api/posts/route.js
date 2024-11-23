import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    // Get the page from URL params
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = 10; // Posts per page
    
    // Calculate start and end indices
    const start = (page - 1) * limit;
    const end = start + limit;

    // Read posts from JSON file
    const filePath = path.join(process.cwd(), 'data', 'posts.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const allPosts = JSON.parse(jsonData);
    
    // Slice the posts for current page
    const paginatedPosts = allPosts.slice(start, end);
    
    // Add total pages info
    const response = {
      posts: paginatedPosts,
      totalPosts: allPosts.length,
      currentPage: page,
      totalPages: Math.ceil(allPosts.length / limit)
    };

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to load posts' }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}