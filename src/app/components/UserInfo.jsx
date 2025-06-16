"use client"

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LuPencilLine } from "react-icons/lu";


export default function UserInfo({ user, isOwner }) {
  const [showMenu, setShowMenu] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success'); // 'success' or 'error'
  const [previewImage, setPreviewImage] = useState(user.image);

  const router = useRouter();

  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    console.log('handlefilechange is going to be active')
    const file = e.target.files?.[0];
    if (!file) return;
  
    // Validate type
    if (!file.type.startsWith("image/")) {
      setMessage("Only image files are allowed.");
      setMessageType("error");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
  
    // Validate size (2MB = 2 * 1024 * 1024)
    if (file.size > 2 * 1024 * 1024) {
      setMessage("Image must be less than 2MB.");
      setMessageType("error");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
  
    const formData = new FormData();
    formData.append("avatar", file);
  
    try {
      const res = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // Optimistically update image preview if path returned
        if (data.image) {
          setPreviewImage(data.image);
          setMessage("Image uploaded successfully.");
          setMessageType("success");
        } else {
          throw new Error("No image returned.");
        }
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err) {
      setMessage(err.message || "Something went wrong.");
      setMessageType("error");
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };
  
  const triggerFileInput = () => {
    console.log('triggerFileInput is going to be active')
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  

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
      const res = await fetch('/api/userDelete', { method: 'DELETE' });
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
      <div className="bg-white dark:bg-slate-950 rounded-lg shadow-lg max-w-md mx-auto p-6 relative">
        {/* Inline toast-style message */}
        {message && (
          <div className={`absolute top-16 left-1/2 transform -translate-x-1/2 mt-[-2.5rem] px-4 py-2 rounded-md text-sm font-medium transition-opacity duration-300 ${ messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <div className="flex items-center space-x-6">
          {/* Profile Image */}
          <div className="relative group cursor-pointer">
            <Image src={`/avatar/${previewImage}`} alt={`${user.username}'s profile`} width={100} height={100} className="rounded-full object-cover" />
            {user.isAi && (
              <span className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                AI
              </span>
            )}
            
            {/* Hover Edit Overlay */}
            {isOwner && (
              <>
                <div className="absolute inset-0 bg-black/60 rounded-full flex-col justify-center items-center text-white hidden group-hover:flex" onClick={triggerFileInput}>
                  <LuPencilLine size={16} className="mb-1" />
                  <span className="text-xs font-medium">Edit</span>
                </div>
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              </>)}
          </div>

          {/* User Info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">{user.username}</h1>
            <p className="text-sm text-gray-700 dark:text-gray-400">{user.bio}</p>
          </div>
        </div>

        {/* Menu Toggle */}
        <span className="absolute top-4 right-4 text-neutral-800 dark:text-neutral-200 cursor-pointer" onClick={() => setShowMenu(!showMenu)}>◦◦◦</span>

        {/* Dropdown Menu */}
        <div className={`absolute top-8 right-4 w-fit bg-neutral-50 dark:bg-neutral-800 shadow-md p-1 text-neutral-800 dark:text-neutral-200 ${ showMenu ? 'block' : 'hidden'}`}>
          <button onClick={handleLogout} className="block w-full text-left px-3 py-1 hover:bg-neutral-200 dark:hover:bg-neutral-700">Logout</button>
          <button onClick={() => setShowDeleteModal(true)} className="block w-full text-left px-3 py-1 hover:bg-neutral-200 dark:hover:bg-neutral-700">Delete Profile</button>
        </div>
      </div>
      {showDeleteModal && isOwner && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-xl sm:rounded-lg w-full sm:max-w-sm p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Delete Profile</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4"> This action cannot be undone. Type <strong className="text-red-600 dark:text-red-400">DELETE</strong> to confirm.</p>
            <input type="text" placeholder="Type DELETE" className="w-full dark:bg-slate-700 border text-slate-950 dark:text-slate-50 border-gray-300 dark:border-gray-500 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500" value={confirmText} onChange={(e) => setConfirmText(e.target.value)}/>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText('');
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button onClick={handleDeleteProfile} disabled={confirmText !== 'DELETE'} className={`px-4 py-2 rounded text-white ${ confirmText === 'DELETE' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300 cursor-not-allowed'}`} > Delete </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
