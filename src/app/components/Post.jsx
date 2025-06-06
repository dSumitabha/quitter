import {React, useState} from "react";
import Image from 'next/image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import Link from 'next/link';

import LikeButton from "./LikeButton";

const Post = ({ postId, username, content, likes, createdAt, image, bio, isNew, isLiked=false }) => {

  // Extend dayjs with the plugins
  dayjs.extend(isToday);
  dayjs.extend(isYesterday);
  dayjs.extend(relativeTime);

  const formattedDate = (createdAt) => {
    const date = dayjs(createdAt);
    
    if (date.isToday()) {
      return `Today, ${date.format('hh:mm a')}`; 
    } else if (date.isYesterday()) {
      return `Yesterday, ${date.format('hh:mm a')}`; 
    } else {
      return date.fromNow(); 
    }
  };
  const sampleDate = '2025-01-01T16:50:23.695Z'
  //console.log(formattedDate(sampleDate))

  const handleLikeChange = (newLikeCount) => {
    console.log(`${username}'s post now has ${newLikeCount} likes.`);
  };
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="p-4 border-b border-gray-200 dark:border-slate-800 my-2 bg-white dark:bg-slate-950 shadow-sm">
        <div className="flex items-center mb-2">
            <Image src={`/avatar/${image}`} alt={`${username}'s profile`} width={40} height={40} className="w-10 h-10 rounded-full mr-3" />
            <div>
                <Link href={`${username}`} className="font-semibold text-gray-700 dark:text-slate-400 hover:text-blue-600 flex items-center" title={bio}>
                    {username}
                    {isNew && <span className="text-yellow-500 ml-2" title={'ai generated'}>✨</span>}
                </Link>
                <div className="relative inline-block text-xs text-gray-500 dark:text-slate-500" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} >
                    <p className="text-xs text-gray-500" > {formattedDate(createdAt)} </p>
                    {isHovered && (
                        <div className="absolute top-6 left-3/4  transform -translate-x-1/2 mb-2 z-10">
                            <div className="bg-slate-800 text-white text-xs rounded-md px-3 py-1 shadow-lg relative w-max">
                                {dayjs(createdAt).format('DD-MM-YYYY · hh:mm A')}
                                <div className="absolute -top-1 left-1/3 transform -translate-x-1/2 w-2 h-2 bg-gray-800  rotate-45"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <p className="text-slate-800 dark:text-slate-300 mb-2">{content}</p>
        {/* <small className="text-xs">{postId}</small> */}
        <div className="text-sm text-gray-500 dark:text-slate-50">
            <LikeButton postId={postId} initialLikes={likes} isInitiallyLiked={isLiked} onLikeChange={handleLikeChange} />
        </div>
    </div>
  );
};

export default Post;