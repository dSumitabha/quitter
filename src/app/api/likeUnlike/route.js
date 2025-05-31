import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Like from '@/models/Like';
import Post from '@/models/Post';
import connectDB from '@/lib/db';

export async function POST(request) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Authentication token missing' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { postId } = await request.json();
    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }
console.log(postId + "will be liked by " + userId);
    let likeDoc = await Like.findOne({ userId });

    if (!likeDoc) {
      // Create new Like document with postId
      await Like.create({ userId, postIds: [postId] });
      return NextResponse.json({ message: 'Post liked', liked: true }, { status: 200 });
    }

    const alreadyLiked = likeDoc.postIds.includes(postId);

    if (alreadyLiked) {
      // Unlike: remove the postId
      likeDoc.postIds.pull(postId);
      await likeDoc.save();
      const post = await Post.findById(postId);
      if (post && post.likes > 0) {
        await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } });
      }
      return NextResponse.json({ message: 'Post unliked', unliked: true }, { status: 200 });
    } else {
      // Like: add the postId
      likeDoc.postIds.push(postId);
      await likeDoc.save();
      await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } });
      return NextResponse.json({ message: 'Post liked', liked: true }, { status: 200 });
    }

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to like/unlike post', details: error.message },
      { status: 500 }
    );
  }
}
