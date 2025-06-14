import React from 'react';
import CreatePost from '../components/CreatePost';
import '../globals.css';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export default async function CreatePostPage() {
  let isAuthenticated = false;

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (token) {
    try {
      // Verify token with the same secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      isAuthenticated = !!decoded;
    } catch (err) {
      isAuthenticated = false; // Token invalid or expired
    }
  }

  return (
    <>
      <CreatePost isAuthenticated={isAuthenticated}/>
      
    </>
  );
}
