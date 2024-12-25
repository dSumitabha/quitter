import React from "react";
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';

import LikeButton from "./LikeButton";

const Post = ({ username, content, likes, createdAt, image, isNew }) => {

  // Extend dayjs with the plugins
  dayjs.extend(isToday);
  dayjs.extend(isYesterday);

  const formattedDate = (createdAt) => {
    const date = dayjs(createdAt);
    
    if (date.isToday()) {
      return `Today, ${date.format('hh:mm a')}`; // Today, 11:09 am
    } else if (date.isYesterday()) {
      return `Yesterday, ${date.format('hh:mm a')}`; // Yesterday, 10:20 am
    } else {
      return date.format('DD-MM-YY'); // 20-12-24
    }
  };

  const handleLikeChange = (newLikeCount) => {
    console.log(`${username}'s post now has ${newLikeCount} likes.`);
    // Optional: Sync this new like count with the backend if needed
  };

  return (
    <div className="p-4 border-b border-gray-200 my-2 bg-white shadow-sm">
      {/* User Info */}
      <div className="flex items-center mb-2">
        <img
          src={image}
          alt={`${username}'s profile`}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p className="font-semibold text-gray-700 flex items-center">
            {username}
            {isNew && <span className="text-yellow-500 ml-2">✨</span>}
          </p>
          <p className="text-xs text-gray-500">
            {formattedDate(createdAt)}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-800 mb-2">{content}</p>

      {/* Post Actions */}
      <div className="text-sm text-gray-500">
        <LikeButton initialLikes={likes} onLikeChange={handleLikeChange} />
      </div>
    </div>
  );
};

export default Post;