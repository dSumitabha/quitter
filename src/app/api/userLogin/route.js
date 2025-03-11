import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose'; 
import jwt from 'jsonwebtoken'; 
import User from '@/models/User';
import connectDB from '@/lib/db';

export async function POST(request) {
  try {
    await connectDB();

    const { username, password } = await request.json();
    

    // Find the user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }] // Check both username and email
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Compare the provided password with the hashed password stored in DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Encode the secret
    // Create a JWT token
    const token = await new SignJWT({ userId: user._id, username: user.username, email: user.email })
    .setProtectedHeader({ alg: 'HS256' }) // Set the algorithm
    .setExpirationTime('1d') // Set the expiration time
    .sign(secret); // Sign the token

    // Set the token in cookies
    const response = NextResponse.json(
        { message: 'Login successful', token },
        { status: 200 }
    );
    
    response.cookies.set('token', token, {
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Ensure cookies are only sent over HTTPS in production
        maxAge: 86400, // 1 day in seconds
        path: '/', // Make the cookie accessible across the entire site
    });
    
    return response;

  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed', details: error.message },
      { status: 500 }
    );
  }
}
