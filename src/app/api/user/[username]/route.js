import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';
import Post from '@/models/Post';
import Like from '@/models/Like';
import dbConnect from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET(request, { params }) {
  await dbConnect();

  const { username } = params;

  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  let requesterId = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      requesterId = decoded.userId;
    } catch (err) {
      console.warn('Invalid or expired token. Proceeding as unauthenticated.');
    }
  }

  try {
    const user = await User.findOne({ username }).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip')) || 0;
    const limit = parseInt(searchParams.get('limit')) || 10;

    const totalPosts = await Post.countDocuments({ userId: user._id });

    const posts = await Post.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    let likedPostIdsSet = new Set();

    if (requesterId) {
      const likeDoc = await Like.findOne({ userId: requesterId });
      likedPostIdsSet = new Set((likeDoc?.postIds || []).map(id => id.toString()));
    }

    const postsWithLikeStatus = posts.map(post => {
      const plainPost = post.toObject();
      plainPost.isLiked = likedPostIdsSet.has(post._id.toString());
      return plainPost;
    });

    return NextResponse.json({ user, posts: postsWithLikeStatus, totalPosts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
