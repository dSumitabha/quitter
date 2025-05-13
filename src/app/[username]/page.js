'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation'; // If username is in URL
import Post from '../components/Post';
import UserInfo from '../components/UserInfo';

const User = () => {
  const { username } = useParams(); // Get from dynamic route like /user/[username]
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // Fetch initial user profile and posts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/${username}?skip=0&limit=10`, {
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch user data');

        const data = await response.json();
        setUser(data.user);
        setPosts(data.posts);
        setHasMore(data.totalPosts > 10);
        setSkip(10);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchUserData();
  }, [username]);

  // Fetch more posts
  const fetchMorePosts = useCallback(async () => {
    if (!hasMore || !username) return;

    try {
      const response = await fetch(`/api/user/${username}?skip=${skip}&limit=10`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch more posts');

      const data = await response.json();

      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
      setSkip((prevSkip) => prevSkip + 10);
      if (data.totalPosts <= skip + 10) setHasMore(false);
    } catch (err) {
      setError(err.message);
    }
  }, [username, skip, hasMore]);

  // Observer for infinite scroll
  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMorePosts();
        }
      });

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

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="my-2 max-w-md mx-auto">
      {user && <UserInfo user={user} />}
      <h2 className="bg-white py-4 text-center my-2 rounded-t-lg text-xl font-semibold text-neutral-800">Posts</h2>
      {posts.length === 0 ? (
        <p className="bg-white py-4 text-center my-2 rounded-t-lg text-neutral-500">No posts available</p>
      ) : (
        posts.map((post, index) => {
          const isLast = posts.length === index + 1;
          const PostComponent = (
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
          return isLast ? <div key={`last-${post._id}`} ref={lastPostRef}>{PostComponent}</div> : PostComponent;
        })
      )}
      {!hasMore && posts.length > 0 && (
        <p className="text-gray-500 mt-8 mb-16 py-4 border-b-4 border-red-600 text-center">
          No more posts to load.
        </p>
      )}
    </div>
  );
};

export default User;