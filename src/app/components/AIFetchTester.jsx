"use client";

import React, { useState, useEffect } from "react";
import Post from './Post';

const AIFetchTester = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAIPosts = async () => {
    setLoading(true);
    setError(null);
  
    try {
      console.log("Sending request to /api/generate (no topics needed)");
  
      // Send the POST request to /api/generate without topics in the body
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // No need to send topics anymore
        body: JSON.stringify({}),
      });
  
      console.log("Response status:", response.status);
  
      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}: ${await response.text()}`);
      }
  
      const data = await response.json();
      console.log("Received data:", data.posts);
  
      // Assuming the data contains the posts you want to display
      setPosts(data.posts); // Adjust based on the actual response structure
      console.log(posts);
      
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <button
        onClick={fetchAIPosts}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Fetching..." : "Fetch AI Posts"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {posts.length > 0 ? (
        posts.map((post, index) => (
          <Post
            key={index}
            username={post.author || "Unknown Author"} // Map 'author' to 'username'
            content={post.post || "No content available"} // Map 'post' to 'content'
            likes={0} // Default value for likes
            createdAt={new Date().toISOString()} // Placeholder for createdAt
            image="https://via.placeholder.com/150" // Placeholder image URL
            isNew={false} // Default value for isNew
          />
        ))
      ) : (
        !loading && <p className="text-gray-500 mt-4">No posts fetched yet.</p>
      )}
    </div>
  );
};

export default AIFetchTester;
