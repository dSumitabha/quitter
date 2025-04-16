import Post from '@/models/Post';
import User from '@/models/User';  
import connectDB from '@/lib/db';

export async function GET(request) {
  try {
    await connectDB();

    // Get the page query parameter (default to page 1)
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = 10;

    // Fetch posts with pagination
    const posts = await Post.find()
      .skip((page - 1) * limit) // Skip posts based on the page number
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by creation date in descending order

    // Get total posts count to calculate totalPages
    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    // Get the userIds of the users who created the posts
    const userIds = posts.map(post => post.userId);

    // Fetch user data for the users who created the posts
    const users = await User.find({ _id: { $in: userIds } });
    

    // Extract topics (assuming each post has a 'topic' field)
    const topics = [...new Set(posts.map(post => post.topic))]; // Get unique topics

    // Construct the response
    const response = new Response(JSON.stringify({
      message: "Posts generated successfully",
      posts: posts,
      topics: users,
      totalPages: totalPages,
      currentPage: page
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

    return response;

  } catch (error) {
    return new Response(JSON.stringify({
      error: "Failed to fetch posts",
      details: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
