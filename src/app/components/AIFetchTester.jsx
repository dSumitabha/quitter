"use client";

import React, { useState } from "react";

const AIFetchTester = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAIPosts = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const topics = ["Technology", "Health", "Sports", "Science", "Travel"];
      console.log("Sending request to /api/generate with topics:", topics);
  
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topics }),
      });
  
      console.log("Response status:", response.status);
  
      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}: ${await response.text()}`);
      }
  
      const data = await response.json();
      console.log("Received data:", data);
      setPosts(data);
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

      <ul className="mt-4">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <li key={index} className="mb-2 p-2 border-b">
              {post.content}
            </li>
          ))
        ) : (
          !loading && <p className="text-gray-500 mt-4">No posts fetched yet.</p>
        )}
      </ul>
    </div>
  );
};

export default AIFetchTester;
