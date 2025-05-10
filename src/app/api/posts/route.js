import Post from '@/models/Post';
import User from '@/models/User';
import Like from '@/models/Like';
import connectDB from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET(request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = 10;

    const posts = await Post.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    const userIds = posts.map(post => post.userId);
    const users = await User.find({ _id: { $in: userIds } });

    // --- AUTH: Get userId from JWT token ---
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    let likedPostIdsSet = new Set();

    if (token) {
      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        const userId = payload.userId;

        const likeDoc = await Like.findOne({ userId });
        likedPostIdsSet = new Set((likeDoc?.postIds || []).map(id => id.toString()));
      } catch (authErr) {
        // If token is invalid, just skip isLiked logic
        console.warn("JWT verification failed:", authErr.message);
      }
    }

    const postsWithLikeStatus = posts.map(post => {
      const plainPost = post.toObject();
      if (likedPostIdsSet.has(post._id.toString())) {
        plainPost.isLiked = true;
      }
      return plainPost;
    });

    return new Response(JSON.stringify({
      message: "Posts generated successfully",
      posts: postsWithLikeStatus,
      topics: users, // you may want to rename this from 'topics'
      totalPages,
      currentPage: page
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

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
