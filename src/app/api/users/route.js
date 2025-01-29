import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    await connectDB();

    // Fetch all users from the database
    const users = await User.find({});

    // Return the users as a JSON response
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}