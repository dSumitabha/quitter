import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';
import Post from '@/models/Post';
import dbConnect from '@/lib/db';


export async function GET(request) {
  await dbConnect(); // Ensure DB connection

  const { searchParams } = request.nextUrl; // ✅ Use request.nextUrl for URL parsing
  const username = searchParams.get('username');
  const id = searchParams.get('id');

  if (!username && !id) {
    return NextResponse.json(
      { error: 'Username or ID is required' },
      { status: 400 }
    );
  }

  try {
    let user;

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
      }
      user = await User.findById(id).select('-password'); // ✅ Exclude password
    } else {
      user = await User.findOne({ username }).select('-password');
    }


    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch posts for this user (newest first by default)
    const posts = await Post.find({ userId: user._id })
    .sort({ createdAt: -1 });
    
    return NextResponse.json({ user, posts }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
