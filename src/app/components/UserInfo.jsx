"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function UserInfo({ user }) {
  const [showMenu, setShowMenu] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success'); // 'success' or 'error'
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/userLogout', {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Logged out successfully');
        setMessageType('success');

        // Redirect after a short delay
        setTimeout(() => {
          setMessage(null);
          router.push('/authentication');
        }, 1500);
      } else {
        setMessage(data.error || 'Logout failed');
        setMessageType('error');
        // Hide the error message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage('Something went wrong.');
      setMessageType('error');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg max-w-md mx-auto p-6 relative">
        {/* Inline toast-style message */}
        {message && (
          <div className={`absolute top-16 left-1/2 transform -translate-x-1/2 mt-[-2.5rem] px-4 py-2 rounded-md text-sm font-medium transition-opacity duration-300 ${ messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <div className="flex items-center space-x-6">
          {/* Profile Image */}
          <div className="relative">
            <Image src={`/avatar/${user.image}`} alt={`${user.username}'s profile`} width={100} height={100} className="w-24 h-24 rounded-full object-cover" />
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

        {/* Menu Toggle */}
        <span className="absolute top-4 right-4 text-neutral-800 cursor-pointer" onClick={() => setShowMenu(!showMenu)}>◦◦◦</span>

        {/* Dropdown Menu */}
        <div className={`absolute top-8 right-4 w-fit bg-neutral-50 shadow-md p-1 text-neutral-800 ${ showMenu ? 'block' : 'hidden'}`}>
          <button onClick={handleLogout} className="block w-full text-left px-3 py-1 hover:bg-neutral-200">Logout</button>
          <button className="block w-full text-left px-3 py-1 hover:bg-neutral-200">Delete Profile</button>
        </div>
      </div>
    </>
  );
}
