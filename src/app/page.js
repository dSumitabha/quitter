"use client";  // Ensure this is a client-side component

import React, { useState, useEffect } from "react";
import Post from "./components/Post";  // Adjust the path to match your structure
import useIntersection from "./utils/IntersectionObserver";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Fetch function triggered by Intersection Observer
  const fetchPosts = async (page) => {
    setLoading(true);
    try {
      // Replace with real API endpoint when ready
      const response = await fetch('/api/posts.json');
      const usersResponse = await fetch("/api/users.json");

      const newPosts = await response.json();
      const usersData = await usersResponse.json();

      setUsers(usersData);
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Set up the intersection observer
  const observerRef = useIntersection(() => {
    setPage((prevPage) => prevPage + 1);  // Trigger next page fetch
  }, loading);

  useEffect(() => {
    fetchPosts(page);  // Fetch posts when the page changes
  }, [page]);

  // Merge posts with user info
  const enrichedPosts = posts.map((post) => {
    const user = users?.find((u) => u.id === post.userId);
    return { ...post, user };
  });

  return (
    <div className="max-w-md mx-auto mt-4">
      {enrichedPosts.map((post) => (
        <Post
          key={post.id}
          username={post.user?.username || "Unknown"}
          content={post.content}
          likes={post.likes}
          createdAt={post.createdAt}
          image={post.user?.image || ""}
        />
      ))}
      {/* Intersection Observer Target */}
      <div ref={observerRef} style={{ height: "10px" }} />
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default Feed;
