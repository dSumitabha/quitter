"use client";

import React, { useState, useEffect } from "react";
import { BsRobot } from "react-icons/bs";
import { RiShuffleLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [selected, setSelected] = useState("mixed"); // 'ai', 'mixed', 'human'

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) setIsVisible(false);
      else setIsVisible(true);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const options = [
    { id: "ai", label: "AI", icon: <BsRobot /> },
    { id: "mixed", label: "Mixed", icon: <RiShuffleLine /> },
    { id: "human", label: "Human", icon: <FaUser /> },
  ];

  return (
    <div className={`bg-white dark:bg-slate-950 shadow-md h-16 max-w-md w-full fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-transform duration-300 ease-in-out ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="h-full flex items-center justify-center px-4">
        <div className="flex bg-gray-100 dark:bg-slate-800 rounded-full p-1 gap-1">
          {options.map((opt) => (
            <button key={opt.id} onClick={() => setSelected(opt.id)} className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-medium transition-all duration-200 ${selected === opt.id ? "bg-white dark:bg-slate-950 shadow text-black dark:text-slate-100" : "text-gray-500 dark:text-slate-50 hover:text-black hover:dark:text-blue-500"}`}>
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
