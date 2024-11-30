import { useState, useEffect } from "react";

const usePostsFetcher = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const POSTS_TO_KEEP = 15; // Maximum posts to keep in state
  const POSTS_TO_REMOVE = 5; // Number of old posts to remove when adding new ones

  const fetchPosts = async (pageNum) => {
    if (!hasMore) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/posts?page=${pageNum}`);
      const usersResponse = await fetch("/api/users");

      if (!response.ok || !usersResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const { posts: newPosts, totalPages, currentPage } = await response.json();
      const usersData = await usersResponse.json();

      setPosts((prevPosts) => {
        let updatedPosts = [...prevPosts, ...newPosts];
        
        // Remove oldest posts if we've exceeded the limit
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

  // Trigger the fetch when the page number changes
  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  return {posts,users,loading,hasMore,error,setPage,};
};

export default usePostsFetcher;
