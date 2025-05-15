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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDeleteProfile = async () => {
    if (confirmText !== 'DELETE') return;

    try {
      const res = await fetch('/api/deleteUser', { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        setMessage('Profile deleted successfully');
        setMessageType('success');
        setTimeout(() => router.push('/goodbye'), 1500);
      } else {
        setMessage(data.error || 'Failed to delete profile');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Something went wrong.');
      setMessageType('error');
    } finally {
      setShowDeleteModal(false);
      setConfirmText('');
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
          <button onClick={() => setShowDeleteModal(true)} className="block w-full text-left px-3 py-1 hover:bg-neutral-200">Delete Profile</button>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-xl sm:rounded-lg w-full sm:max-w-sm p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-red-600 mb-2">Delete Profile</h2>
            <p className="text-sm text-gray-700 mb-4">
              This action cannot be undone. Type <strong className="text-red-500">DELETE</strong> to confirm.
            </p>
            <input
              type="text"
              placeholder="Type DELETE"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText('');
                }}
                className="px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProfile}
                disabled={confirmText !== 'DELETE'}
                className={`px-4 py-2 rounded text-white ${
                  confirmText === 'DELETE' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300 cursor-not-allowed'
                }`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
