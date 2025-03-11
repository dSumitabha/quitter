'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Post from './Post'; // Assuming you already have the Post component

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // Fetch initial profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch('/api/profile', {
          credentials: 'include', // Include cookies in the request
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setUser(data.user);
        setPosts(data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Fetch more posts when the user scrolls to the bottom
  const fetchMorePosts = useCallback(async () => {
    if (!hasMore) return;

    try {
      const response = await fetch(`/api/profile?skip=${skip}&limit=10`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch more posts');
      }

      const data = await response.json();
      if (data.posts.length === 0) {
        setHasMore(false); // No more posts to fetch
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data.posts]);
        setSkip((prevSkip) => prevSkip + 10);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [skip, hasMore]);

  // Intersection observer to detect when to fetch more posts
  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            fetchMorePosts();
          }
        },
        { threshold: 1.0 }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchMorePosts]
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg max-w-3xl mx-auto p-6">
        <div className="flex items-center space-x-6">
          {/* Profile Image */}
          <div className="relative">
            <Image
              src={`/avatar/${user.image}`}
              alt={`${user.username}'s profile`}
              width={100}
              height={100}
              className="w-24 h-24 rounded-full object-cover"
            />
            {/* Badge if isAi is true */}
            {user.isAi && (
              <span className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                AI
              </span>
            )}
          </div>

          {/* User Info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user.username}</h1>
            <p className="text-sm text-gray-500">{user.bio}</p>
          </div>
        </div>
      </div>

      {/* User Posts Section */}
      <div className="mt-8 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts available</p>
        ) : (
          posts.map((post, index) => {
            if (posts.length === index + 1) {
              // Attach the ref to the last post
              return (
                <div ref={lastPostRef} key={post._id}>
                  <Post
                    username={post.username}
                    content={post.content}
                    likes={post.likes}
                    createdAt={post.createdAt}
                    image={user.image}
                    bio={post.bio}
                    isNew={post.isNew}
                  />
                </div>
              );
            } else {
              return (
                <Post
                  key={post._id}
                  username={user.username}
                  content={post.content}
                  likes={post.likes}
                  createdAt={post.createdAt}
                  image={user.image}
                  bio={user.bio}
                  isNew={false}
                />
              );
            }
          })
        )}
        {!hasMore && <p className="text-gray-500">No more posts to load.</p>}
      </div>
    </div>
  );
};

export default Profile;