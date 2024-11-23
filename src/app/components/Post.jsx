import React from "react";
import LikeButton from "./LikeButton";

const Post = ({ username, content, likes, createdAt, image }) => {
  const handleLikeChange = (newLikeCount) => {
    console.log(`${username}'s post now has ${newLikeCount} likes.`);
    // Optional: Sync this new like count with the backend if needed
  };
  return (
    <div className="p-4 border-b border-gray-200 my-2 bg-white shadow-sm">
      {/* User Info */}
      <div className="flex items-center mb-2">
        <img src={image} alt={`${username}'s profile`} className="w-10 h-10 rounded-full mr-3" />
        <div>
          <p className="font-semibold text-gray-700">{username}</p>
          <p className="text-xs text-gray-500">{new Date(createdAt).toDateString()}</p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-800 mb-2">{content}</p>

      {/* Post Actions */}
      <div className="text-sm text-gray-500 ">
        <LikeButton initialLikes={likes} onLikeChange={handleLikeChange} />
      </div>
    </div>
  );
};

export default Post;
