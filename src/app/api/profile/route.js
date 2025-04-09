import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';
import Post from '@/models/Post';
import dbConnect from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET(request) {
  await dbConnect(); // Ensure DB connection

  // Retrieve token from cookies
  const token = cookies().get('token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Authorization token is required' },
      { status: 401 }
    );
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get('skip')) || 0;
    const limit = parseInt(searchParams.get('limit')) || 10;

    // Fetch the total number of posts for this user
    const totalPosts = await Post.countDocuments({ userId: user._id });

    // Fetch posts for this user (newest first by default)
    const posts = await Post.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({ user, posts, totalPosts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}