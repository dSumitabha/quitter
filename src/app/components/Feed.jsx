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
  const POSTS_TO_KEEP = 20;
  const POSTS_TO_REMOVE = 10;

  const [feedType, setFeedType] = useState(2);

  const fetchPosts = useCallback(async (pageNum, currentFeedType) => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    try {

      let response;
      if (currentFeedType === 1) {
        response = await fetch(`/api/generate`);
      } else {
        response = await fetch(`/api/posts?page=${pageNum}`);
      }

      const { posts: newPosts, totalPages, currentPage, topics: topicsData } = await response.json();

      setPosts(prevPosts => {
        
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
    if (!loading && hasMore && feedType !== 1) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPosts(page, feedType);
  }, [page, feedType, fetchPosts]);

  useEffect(() => {
    setPosts([]);
    setPage(1);
  }, [feedType])

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

  
  console.log(enrichedPosts)

  return (
    <>
      <Header selected={feedType} setSelected={setFeedType}/>
      <div className="max-w-md mx-auto pt-16 ">
        {/* <p>{feedType } is selected now.</p> */}
        {enrichedPosts.map((post, index) => (
          <Post
            key={post._id}
            postId={post._id}
            username={post.username}
            content={post.content}
            likes={post.likes}
            createdAt={post.createdAt}
            image={post.image}
            bio={post.bio}          
            isNew={feedType ? true : false}
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
    </>
  );
};


export default Feed;