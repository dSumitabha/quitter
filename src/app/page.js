"use client";

import React, { useState, useEffect } from "react";
import Post from "./components/Post";
import useIntersection from "./utils/IntersectionObserver";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const POSTS_TO_KEEP = 15; // Maximum posts to keep in state
  const POSTS_TO_REMOVE = 5; // Number of old posts to remove when adding new ones

  // Fetch posts with pagination
  const fetchPosts = async (pageNum) => {
    if (!hasMore) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/posts?page=${pageNum}`);
      const usersResponse = await fetch("/api/users");

      if (!response.ok || !usersResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const { posts: newPosts, totalPages, currentPage } = await response.json();
      const usersData = await usersResponse.json();

      setPosts(prevPosts => {
        let updatedPosts = [...prevPosts, ...newPosts];
        
        // If we have more posts than our limit, remove oldest posts
        if (updatedPosts.length > POSTS_TO_KEEP) {
          updatedPosts = updatedPosts.slice(POSTS_TO_REMOVE);
        }
        
        return updatedPosts;
      });

      setUsers(usersData);
      setHasMore(currentPage < totalPages);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // Set up intersection observer
  const observerRef = useIntersection(() => {
    setPage(prevPage => prevPage + 1);
  }, loading);

  // Fetch posts when page changes
  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  // Merge posts with user info
  const enrichedPosts = posts.map((post) => {
    const user = users.find((u) => u.id === post.userId);
    return {
      ...post,
      user: user || { username: "Unknown", image: "/default-avatar.png" }
    };
  });

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-4">
      {enrichedPosts.map((post) => (
        <Post
          key={post.id}
          username={post.user.username}
          content={post.content}
          likes={post.likes}
          createdAt={post.createdAt}
          image={post.user.image}
        />
      ))}
      
      {/* Intersection Observer Target */}
      {hasMore && <div ref={observerRef} className="h-10" />}
      
      {loading && (
        <div className="p-4 text-center text-gray-600">
          Loading more posts...
        </div>
      )}
      
      {!hasMore && posts.length > 0 && (
        <div className="p-4 text-center text-gray-500">
          No more posts to load
        </div>
      )}
    </div>
  );
};

export default Feed;