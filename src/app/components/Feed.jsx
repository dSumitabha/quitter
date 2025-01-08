"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import useIntersection from "../utils/IntersectionObserver";

import Post from "./Post";


const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const POSTS_TO_KEEP = 20;
  const POSTS_TO_REMOVE = 10;

  const fetchPosts = useCallback(async (pageNum) => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/generate`);

      const { posts: newPosts, totalPages, currentPage, topics: topicsData } = await response.json();

      setPosts(prevPosts => {
        if (prevPosts.length + newPosts.length > POSTS_TO_KEEP + POSTS_TO_REMOVE) {
          return [...prevPosts.slice(POSTS_TO_REMOVE), ...newPosts];
        }
        return [...prevPosts, ...newPosts];
      });
      
      setTopics(topicsData);
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
      image: topics.find((t) => t.id === post.userId)?.image || "default-avatar.png",
      bio: topics.find((t) => t.id === post.userId)?.bio || ""

    }));
  }, [posts, topics]);

  const observerRef = useIntersection(() => handleLoadMore(), loading);

  
  //console.log(enrichedPosts)

  return (
    <div className="max-w-md mx-auto mt-4">
      {enrichedPosts.map((post, index) => (
        <Post
          key={`${post.name}-${index}`}
          username={post.username}
          content={post.post}
          likes={post.likes}
          createdAt={post.createdAt}
          image={post.image}
          bio={post.bio}          
          isNew={true}
        />
      ))}

        {/* Intersection Observer Target */}
      {hasMore && (
        <div ref={observerRef} className="w-full h-16 flex justify-center items-center text-gray-500">
          {loading ? "Loading more posts..." : "Scroll down to load more"}
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


export default Feed;