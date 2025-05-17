'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CreatePost = ({isAuthenticated}) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!content.trim()) {
      setError('Post content cannot be empty.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/newPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post.');
      }

      // Navigate back to profile or home page after successful post
      router.push('/profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-4">
      <div className="bg-white dark:bg-slate-950 w-full max-w-md p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">Create a Post</h2>
        <form onSubmit={handleSubmit}>
          <textarea className="w-full dark:bg-slate-800 p-3 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-32 text-sm text-neutral-800 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-500" placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)} maxLength={280} />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <button type="submit" disabled={submitting} className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50" >
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </form>
        {!isAuthenticated && <small className="my-4 text-red-600 dark:text-red-500">You aren't logged in. <Link href="/authentication" className="text-blue-700 hover:text-blue-500">Login </Link></small>}
      </div>
    </div>
  );
};

export default CreatePost;
