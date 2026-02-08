import React from "react";

export default function NoUsers({ message, submessage, cta }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-[#F3EDE9] text-center dark:bg-gray-800/80 dark:border-gray-700">
      <div className="mx-auto max-w-md flex flex-col items-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-[#9B2C62] dark:text-[#D97706]">
          {message}
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
          {submessage}
        </p>
        <div className="mt-6">{cta}</div>
      </div>
    </div>
  );
}
