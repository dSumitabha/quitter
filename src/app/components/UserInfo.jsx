"use client"

import React, { useState } from 'react';
import Image from 'next/image';

export default function UserInfo({user}){
    const [showMenu, setShowMenu] = useState(false)
    return(
        <>
            <div className="bg-white rounded-lg shadow-lg max-w-md mx-auto p-6 relative">
                <div className="flex items-center space-x-6">
                {/* Profile Image */}
                <div className="relative">
                    <Image src={`/avatar/${user.image}`} alt={`${user.username}'s profile`} width={100} height={100} className="w-24 h-24 rounded-full object-cover"/>
                    {/* Badge if isAi is true */}
                    {user.isAi && (<span className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">AI</span>)}
                </div>

                {/* User Info */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{user.username}</h1>
                    <p className="text-sm text-gray-500">{user.bio}</p>
                </div>
                </div>
                <span className="absolute top-4 right-4 text-neutral-800 cursor-pointer" onClick={() => setShowMenu(!showMenu)}>◦◦◦</span>
                <div className={`absolute top-8 right-4 w-fit bg-neutral-50 shadow-md p-1 text-neutral-800 ${showMenu ? 'block' : 'hidden'}`}>                    
                    <button className="block w-full text-left hover:bg-neutral-200">Logout</button>
                    <button className="block w-full text-left hover:bg-neutral-200">Delete Profile</button>
                </div>
            </div>
        </>
    )
}