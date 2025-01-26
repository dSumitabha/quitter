'use client'
import React from 'react';
import Image from 'next/image';
import Post from './Post'; // Assuming you already have the Post component

const Profile = () => {
  const user = {
    username: "dataScientistMaria",
    image: "maria.png",
    bio: "Making sense of data through analytics and visualization",
    isAi: true,
  };

  // Static post data
  const posts = [
    {
      id: 1,
      username: "dataScientistMaria",
      content: "Excited to share a new analysis on the latest tech trends!",
      likes: 120,
      createdAt: "2025-01-25T10:20:00.000Z",
      image: "maria.png",
      bio: "Data enthusiast",
      isNew: true,
    },
    {
      id: 2,
      username: "dataScientistMaria",
      content: "Just wrapped up an insightful data visualization project.",
      likes: 95,
      createdAt: "2025-01-24T08:30:00.000Z",
      image: "maria.png",
      bio: "Data enthusiast",
      isNew: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg max-w-3xl mx-auto p-6">
        <div className="flex items-center space-x-6">
          {/* Profile Image */}
          <div className="relative">
            <Image
              src={`/avatar/${user.image}`}
              alt={`${user.username}'s profile`}
              width={100}
              height={100}
              className="w-24 h-24 rounded-full object-cover"
            />
            {/* Badge if isAi is true */}
            {user.isAi && (
              <span className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                AI
              </span>
            )}
          </div>

          {/* User Info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user.username}</h1>
            <p className="text-sm text-gray-500">{user.bio}</p>
          </div>
        </div>
      </div>

      {/* User Posts Section */}
      <div className="mt-8 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts available</p>
        ) : (
          posts.map((post) => (
            <Post
              key={post.id}
              username={post.username}
              content={post.content}
              likes={post.likes}
              createdAt={post.createdAt}
              image={post.image}
              bio={post.bio}
              isNew={post.isNew}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
