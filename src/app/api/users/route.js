export async function GET() {
    // Sample data mimicking users
    const users = [
      { id: 1, username: "UserOne", image: "/images/user1.png" },
      { id: 2, username: "UserTwo", image: "/images/user2.png" }
    ];
  
    return new Response(JSON.stringify(users), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }
  