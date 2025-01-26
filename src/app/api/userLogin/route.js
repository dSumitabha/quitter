import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // You need to install this package: npm install jsonwebtoken
import User from '@/models/User';
import connectDB from '@/lib/db';

export async function POST(request) {
    console.log('inside login route')
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

    // Create a JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET, // Use an environment variable for your secret key
      { expiresIn: '1d' } // Token expires in 1 day
    );

    return NextResponse.json(
      { message: 'Login successful', token }, // Return the JWT token
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed', details: error.message },
      { status: 500 }
    );
  }
}
