"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";


import Post from "./Post";


const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const POSTS_TO_KEEP = 15;
  const POSTS_TO_REMOVE = 5;

  const fetchPosts = useCallback(async (pageNum) => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/generate`);
      const usersResponse = await fetch("/api/users");
  
      if (!response.ok || !usersResponse.ok) {
        throw new Error('Failed to fetch data');
      }


      const { posts: newPosts, totalPages, currentPage } = await response.json();
      console.log( totalPages, currentPage);
      const usersData = await usersResponse.json();
  
      setPosts(prevPosts => {
        if (prevPosts.length + newPosts.length > POSTS_TO_KEEP + POSTS_TO_REMOVE) {
          return [...prevPosts.slice(POSTS_TO_REMOVE), ...newPosts];
        }
        return [...prevPosts, ...newPosts];
      });
      
      setUsers(usersData);
      setHasMore(currentPage < totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [hasMore]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);

  // Memoize enriched posts
  // Now posts already contain name and post content directly

  const enrichedPosts = useMemo(() => {
    return posts.map((post) => ({
      ...post,
      content: post.post,   // Map post to content if needed
      user: users.find((u) => u.username === post.author) || 
      { username: post.author, image: "/default-avatar.png" }
    }));
  }, [posts]);
  
  console.log(enrichedPosts)

  return (
    <div className="max-w-md mx-auto mt-4">
      {enrichedPosts.map((post, index) => (
        <Post
          key={`${post.name}-${index}`}
          username={post.author}
          content={post.content}
          likes={post.likes}
          createdAt={post.createdAt}
          image={post.user.image}
          bio={post.user.bio}          
          isNew={true}
        />
      ))}
      
      {/* Load More Button */}
      {hasMore && (
        <div className="p-4 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <LoadingSpinner />
                <span className="ml-2">Loading...</span>
              </span>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
      
      {!hasMore && posts.length > 0 && (
        <div className="p-4 text-center text-gray-500">
          No more posts to load
        </div>
      )}

      {error && (
        <div className="p-4 text-center text-red-600">
          {error}
          <button 
            onClick={() => {
              setError(null);
              fetchPosts(page);
            }}
            className="ml-2 underline"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
);

export default Feed;