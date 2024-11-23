export async function GET() {
    // Sample data mimicking posts
    const posts = [
      { id: 1, userId: 1, content: "Hello World!", likes: 10, createdAt: "2024-11-22T10:00:00Z" },
      { id: 2, userId: 2, content: "Next.js is awesome!", likes: 15, createdAt: "2024-11-22T11:00:00Z" }
    ];
  
    return new Response(JSON.stringify(posts), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }
  