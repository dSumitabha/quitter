"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import useIntersection from "../utils/IntersectionObserver";
import Header from "./Header";
import Post from "./Post";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  
  const [feedType, setFeedType] = useState(2);

  const fetchPosts = useCallback(async (pageNum, currentFeedType) => {
    // Use current state values directly, don't depend on them
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let response;
      if (currentFeedType === 1) {
        response = await fetch(`/api/generate`);
      } else {
        response = await fetch(`/api/posts?page=${pageNum}`);
      }

      const { posts: newPosts, totalPages, currentPage, topics: topicsData } = await response.json();

      setPosts(prevPosts => {
        // For AI mode, we might want to prevent duplicates
        if (currentFeedType === 1) {
          // Create a Set of existing post IDs to check for duplicates
          const existingIds = new Set(prevPosts.map(post => post._id));
          const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post._id));
          return [...prevPosts, ...uniqueNewPosts];
        }
        return [...prevPosts, ...newPosts];
      });
      
      setTopics(topicsData);
      
      if (currentFeedType === 1) {
        setHasMore(true);
      } else {
        setHasMore(currentPage < totalPages);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array - function won't recreate

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return;
    
    if (feedType === 1) {
      // For AI mode, directly fetch without page increment
      fetchPosts(1, feedType);
    } else {
      setPage(prevPage => prevPage + 1);
    }
  }, [feedType, loading, hasMore, fetchPosts]);

  // Initial load and feed type changes
  useEffect(() => {
    if (feedType !== 1) {
      fetchPosts(page, feedType);
    }
  }, [page, fetchPosts]);

  // Handle feed type changes
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    
    // For AI mode, fetch immediately after reset
    if (feedType === 1) {
      fetchPosts(1, feedType);
    }
  }, [feedType, fetchPosts]);

  // Memoize enriched posts
  const enrichedPosts = useMemo(() => {
    return posts.map((post) => ({
      ...post,
      username: topics.find((t) => t._id === post.userId)?.username || "",
      image: topics.find((t) => t._id === post.userId)?.image || "default-avatar.png",
      bio: topics.find((t) => t._id === post.userId)?.bio || ""
    }));
  }, [posts, topics]);

  const observerRef = useIntersection(handleLoadMore, loading);

  return (
    <>
      <Header selected={feedType} setSelected={setFeedType}/>
      <div className="max-w-md mx-auto pt-16">
        {enrichedPosts.map((post, index) => (
          <Post
            key={`${post._id}-${index}`} // Better key to handle potential duplicates
            postId={post._id}
            username={post.username}
            content={post.content}
            likes={post.likes}
            createdAt={post.createdAt}
            image={post.image}
            bio={post.bio}          
            isNew={feedType === 1}
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
                if (feedType === 1) {
                  fetchPosts(1, feedType);
                } else {
                  fetchPosts(page, feedType);
                }
              }}
              className="ml-2 underline"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Feed;