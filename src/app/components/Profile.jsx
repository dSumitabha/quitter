'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';

import Post from './Post';
import UserInfo from './UserInfo';
import PostSkeleton from './PostSkeleton';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(10);
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
    if (!hasMore) {
      console.log('at the end, will return')
      return
    };

    try {
      const response = await fetch(`/api/profile?skip=${skip}&limit=10`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch more posts');
      }

      const data = await response.json();

      if (data.totalPosts <= (skip + 10)) {
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
    return (
      <div className="max-w-md mx-auto pt-6">
        {[...Array(5)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="max-w-md mx-auto min-h-screen flex justify-center items-center ">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <UserInfo user={user} isOwner={true} />

      {/* User Posts Section */}
      <div className="my-2 max-w-md mx-auto">
        <h2 className="bg-white dark:bg-slate-800 py-4 text-center my-2 rounded-t-lg text-xl font-semibold text-neutral-800 dark:text-neutral-200">Posts</h2>
        {posts.length === 0 ? (
          <p className="bg-white dark:bg-slate-800 py-4 text-center my-2 rounded-t-lg text-neutral-500 dark:text-neutral-300">No posts available</p>
        ) : (
          posts.map((post, index) => {
            if (posts.length === index + 1) {
              // Attach the ref to the last post
              return (
                <div ref={lastPostRef} key={post._id}>
                  <Post
                    postId={post._id}
                    username={post.username}
                    content={post.content}
                    likes={post.likes}
                    createdAt={post.createdAt}
                    image={user.image}
                    bio={post.bio}
                    isNew={post.isNew}
                    isLiked={post.isLiked}
                  />
                </div>
              );
            } else {
              return (
                <Post
                  key={post._id}
                  postId={post._id}
                  username={user.username}
                  content={post.content}
                  likes={post.likes}
                  createdAt={post.createdAt}
                  image={user.image}
                  bio={user.bio}
                  isNew={false}
                  isLiked={post.isLiked}
                />
              );
            }
          })
        )}
        {!hasMore && <p className="text-gray-500 mt-8 mb-16 py-4 border-b-4 border-red-600 text-center">No more posts to load.</p>}
      </div>
    </div>
  );
};

export default Profile;