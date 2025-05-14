import React, { useState, useRef, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const LikeButton = ({ postId, initialLikes, isInitiallyLiked = false, onLikeChange }) => {
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [animate, setAnimate] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const debounceTimeoutRef = useRef(null);
  const isRequestInProgressRef = useRef(false);
  
  // Initialize confirmed state refs with initial values
  const confirmedLikeStateRef = useRef(isInitiallyLiked);
  const confirmedLikeCountRef = useRef(initialLikes);

  // Set the confirmed state on mount and when initial props change
  useEffect(() => {
    confirmedLikeStateRef.current = isInitiallyLiked;
    confirmedLikeCountRef.current = initialLikes;
  }, [isInitiallyLiked, initialLikes]);

  const syncUIWithConfirmedState = () => {
    setIsLiked(confirmedLikeStateRef.current);
    setLikeCount(confirmedLikeCountRef.current);
    if (onLikeChange) onLikeChange(confirmedLikeCountRef.current);
  };

  const updateConfirmedState = (liked, count) => {
    confirmedLikeStateRef.current = liked;
    confirmedLikeCountRef.current = count;
    syncUIWithConfirmedState();
  };

  const triggerServerUpdate = async (newLikeState) => {
    if (isRequestInProgressRef.current) return;
    
    isRequestInProgressRef.current = true;
    
    try {
      const response = await fetch("/api/likeUnlike", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setErrorMessage("You need to log in to like posts");
          setTimeout(() => setErrorMessage(""), 3000);
        } else {
          setErrorMessage("Failed to update like status");
          setTimeout(() => setErrorMessage(""), 3000);
        }
        
        // Revert UI to confirmed state
        syncUIWithConfirmedState();
      } else {
        // Server request was successful, update the confirmed state
        const newCount = newLikeState
          ? confirmedLikeCountRef.current + 1
          : confirmedLikeCountRef.current - 1;
        
        updateConfirmedState(newLikeState, newCount);
      }
    } catch (err) {
      console.error("Error updating like:", err);
      setErrorMessage("Network error. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
      
      // Revert UI to confirmed state
      syncUIWithConfirmedState();
    } finally {
      isRequestInProgressRef.current = false;
    }
  };

  const handleClick = () => {
    const newLikeState = !isLiked;
    const newCount = newLikeState ? likeCount + 1 : likeCount - 1;

    // Update UI immediately for responsiveness
    setIsLiked(newLikeState);
    setLikeCount(newCount);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);

    // Callback for parent component
    if (onLikeChange) onLikeChange(newCount);

    // Cancel any pending request
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce the server request
    debounceTimeoutRef.current = setTimeout(() => {
      // Only send request if the new state differs from confirmed state
      if (newLikeState !== confirmedLikeStateRef.current) {
        triggerServerUpdate(newLikeState);
      }
    }, 1000);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleClick}
        className={`focus:outline-none transition-transform duration-300 ${animate ? "scale-125" : "scale-100"}`}
        aria-label={isLiked ? "Unlike post" : "Like post"}
      >
        {isLiked ? (
          <AiFillHeart className="text-orange-500 text-2xl" />
        ) : (
          <AiOutlineHeart className="text-gray-500 text-2xl" />
        )}
      </button>
      <span>{likeCount} likes</span>
      {errorMessage && (
        <div className="text-sm text-red-500 mt-1 transition-opacity duration-300 opacity-100">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default LikeButton;