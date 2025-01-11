import connectDB from '@/lib/db'; // Your database connection utility
import User from '@/models/User'; // Your Mongoose model

export async function GET(req) {
  try {
    await connectDB(); // Ensure the database connection is established
    const users = await User.find(); // Fetch users from the database

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
