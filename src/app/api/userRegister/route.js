// app/api/register/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';
import connectDB from '@/lib/db';

export async function POST(request) {
  try {
    await connectDB();

    const { username, email, password } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' }, 
        { status: 400 }
      );
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password, // Note: In production, hash this password
      role: 'user' // Default role
    });

    await newUser.save();

    return NextResponse.json(
      { message: 'User registered successfully' }, 
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: 'Registration failed', details: error.message }, 
      { status: 500 }
    );
  }
}