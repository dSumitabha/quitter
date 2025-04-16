import React, { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const LikeButton = ({ postId, initialLikes, onLikeChange }) => {
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleLike = async () => {
    const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
    setLikeCount(newLikeCount);
    setIsLiked(!isLiked);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);

    if (onLikeChange) {
      onLikeChange(newLikeCount);
    }

    try {
      const response = await fetch('/api/likeUnlike', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });

      const data = await response.json();

      if (response.status === 401) {
        setErrorMessage("You need to log in to like posts");
        setTimeout(() => setErrorMessage(""), 3000); 
      } else {
        console.log(data.message); 
      }
    } catch (error) {
      console.error("Error while liking/unliking post:", error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleLike}
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
