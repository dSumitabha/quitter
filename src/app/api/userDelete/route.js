import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import User from '@/models/User';
import Like from '@/models/Like';
import connectDB from '@/lib/db';

// Utility to verify JWT
async function verifyToken(token) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

export async function DELETE(request) {
  try {
    await connectDB();

    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    let payload;
    try {
      payload = await verifyToken(token);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userId = payload.userId;

    // Delete user
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete associated Likes
    await Like.findOneAndDelete({ userId });

    // Clear the token cookie
    const response = NextResponse.json(
      { message: 'User and associated likes deleted successfully' },
      { status: 200 }
    );

    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0), // Expire the cookie
      path: '/',
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete user', details: error.message },
      { status: 500 }
    );
  }
}
