"use client";

export default function Card({ children, className = "" }) {
  return (
    <div
      className={`
        bg-white 
        dark:bg-[#0F0F12] 
        border 
        border-gray-200 
        dark:border-gray-800 
        rounded-xl 
        shadow-sm 
        p-4 
        ${className}
      `}
    >
      {children}
    </div>
  );
}
