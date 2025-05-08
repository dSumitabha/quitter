import React, { useState, useRef } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const LikeButton = ({ postId, initialLikes, onLikeChange }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [animate, setAnimate] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const debounceTimeoutRef = useRef(null);
  const isRequestInProgressRef = useRef(false);
  const latestIntentRef = useRef(null); // true = like, false = unlike
  const confirmedLikeStateRef = useRef(false); // backend-confirmed like status
  const confirmedLikeCountRef = useRef(initialLikes);

  const syncUIFromServerState = (liked, count) => {
    setIsLiked(liked);
    setLikeCount(count);
    confirmedLikeStateRef.current = liked;
    confirmedLikeCountRef.current = count;
    if (onLikeChange) onLikeChange(count);
  };

  const triggerServerUpdate = async (intent) => {
    if (isRequestInProgressRef.current) return;

    isRequestInProgressRef.current = true;
    try {
      const response = await fetch("/api/likeUnlike", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      const data = await response.json();

      if (response.status === 401) {
        setErrorMessage("You need to log in to like posts");
        setTimeout(() => setErrorMessage(""), 3000);
        // Rollback to confirmed state
        syncUIFromServerState(confirmedLikeStateRef.current, confirmedLikeCountRef.current);
      } else {
        const newLikeState = intent;
        const newCount = newLikeState
          ? confirmedLikeCountRef.current + 1
          : confirmedLikeCountRef.current - 1;

        syncUIFromServerState(newLikeState, newCount);
      }
    } catch (err) {
      console.error("Error updating like:", err);
      syncUIFromServerState(confirmedLikeStateRef.current, confirmedLikeCountRef.current);
    } finally {
      isRequestInProgressRef.current = false;

      // Check if user changed intent again during request
      if (latestIntentRef.current !== confirmedLikeStateRef.current) {
        // Restart debounce for the new intent
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = setTimeout(() => {
          triggerServerUpdate(latestIntentRef.current);
        }, 1000);
      }
    }
  };

  const handleClick = () => {
    const newLikeState = !isLiked;
    const newCount = newLikeState ? likeCount + 1 : likeCount - 1;

    // UI feedback instantly
    setIsLiked(newLikeState);
    setLikeCount(newCount);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);

    if (onLikeChange) onLikeChange(newCount);

    // Cancel any pending debounce
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

    // Save intent
    latestIntentRef.current = newLikeState;

    // Set new debounce timer
    debounceTimeoutRef.current = setTimeout(() => {
      triggerServerUpdate(newLikeState);
    }, 1000);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleClick}
        className={`focus:outline-none transition-transform duration-300 ${animate ? "scale-125" : "scale-100"}`}
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
