import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import Post from '@/models/Post';
import connectDB from '@/lib/db';

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Post content cannot be empty.' }, { status: 400 });
    }

    // Extract token from cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided.' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    let payload;
    try {
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 403 });
    }

    const newPost = new Post({
      userId: payload.userId,
      content,
      source: 0
    });

    await newPost.save();

    return NextResponse.json({ message: 'Post created successfully.', postId: newPost._id }, { status: 201 });
  } catch (err) {
    console.error('Error creating post:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
