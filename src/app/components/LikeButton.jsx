import React, { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const LikeButton = ({ initialLikes, onLikeChange }) => {
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [animate, setAnimate] = useState(false);

  const handleLike = () => {
    const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
    setLikeCount(newLikeCount);
    setIsLiked(!isLiked);
    //Triger animation
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);

    // Notify parent about the like change
    if (onLikeChange) {
      onLikeChange(newLikeCount);
    }
  };

  return (
    <div className="flex items-center space-x-2">
       <button onClick={handleLike} className={`focus:outline-none transition-transform duration-300 ${animate ? "scale-125" : "scale-100"}`}>
        {isLiked ? (
          <AiFillHeart className="text-orange-500 text-2xl" />
        ) : (
          <AiOutlineHeart className="text-gray-500 text-2xl" />
        )}
      </button>
      <span>{likeCount} likes</span>
    </div>
  );
};

export default LikeButton;
