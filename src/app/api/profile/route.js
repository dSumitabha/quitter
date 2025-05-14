import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';
import Post from '@/models/Post';
import Like from '@/models/Like';
import dbConnect from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET(request) {
  await dbConnect();

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Authorization token is required' },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip')) || 0;
    const limit = parseInt(searchParams.get('limit')) || 10;

    const totalPosts = await Post.countDocuments({ userId });

    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Fetch liked postIds for this user
    const likeDoc = await Like.findOne({ userId });
    const likedPostIdsSet = new Set((likeDoc?.postIds || []).map(id => id.toString()));

    const postsWithLikeStatus = posts.map(post => {
      const plainPost = post.toObject();
      plainPost.isLiked = likedPostIdsSet.has(post._id.toString());
      return plainPost;
    });

    return NextResponse.json({ user, posts: postsWithLikeStatus, totalPosts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
