import React from "react";
import Link from 'next/link';
import { AiOutlineHome, AiOutlinePlus, AiOutlineUser } from "react-icons/ai";

const NavBar = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-950 shadow-lg border-t border-gray-200 dark:border-gray-800 z-50">
      <ul className="flex justify-around items-center py-3">
        {/* Home */}
        <li className="text-center">
          <Link href="/" className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-blue-500">
            <AiOutlineHome className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
        </li>

        {/* Create Post */}
        <li className="text-center">
          <a href="/create-post" className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-blue-500">
            <AiOutlinePlus className="w-6 h-6" />
            <span className="text-xs mt-1">Post</span>
          </a>
        </li>

        {/* Profile */}
        <li className="text-center">
          <Link href="/profile" className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-blue-500">
            <AiOutlineUser className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
