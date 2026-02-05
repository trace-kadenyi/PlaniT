import React from "react";

import { EventAddBudgetLink } from "../buttons/ExpenseButtons";

// No budget UI
export function NoBudget({ Link, eventID }) {
  return (
    <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 dark:border-gray-900 p-6 rounded-xl shadow-sm border border-[#F3EDE9] my-6">
      <div className="flex items-center gap-3 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-[#9B2C62] dark:text-[#D97706]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-lg font-semibold text-[#9B2C62] dark:text-[#D97706]">
          Budget Overview
        </h2>
      </div>
      <div className="flex flex-col gap-1 bg-[#FFF5EB] p-4 rounded-lg border border-[#F3EDE9] dark:bg-gray-800 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-[#6B3B0F] dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="text-[#6B3B0F] dark:text-gray-400 font-medium">
              No budget set for this event
            </p>
          </div>
        </div>
        <EventAddBudgetLink eventID={eventID} />
      </div>
    </div>
  );
}

// Color definitions
// const colors = {
//   primary: {
//     main: "#9B2C62", // Deep mulberry
//     light: "#9B2C62/10",
//     dark: "#7A2450",
//   },
//   secondary: {
//     main: "#FF9933", // Saffron gold
//     light: "#FFB866", // Lighter pumpkin
//     dark: "#E07C24", // Darker pumpkin
//   },
// };

// Helper function to get user display name
export const getUserDisplayName = (user) => {
  if (!user) return "Unknown User";

  const name =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : "Unknown User";

  if (user.isActive === false) {
    return `${name} (deactivated)`;
  }

  return name;
};

// created and updated on/by Snippet
export const CreatedUpdatedData = ({ item, formatDateTimeShort }) => {
  return (
    <div className="text-[10px] text-gray-400 dark:text-gray-400/60 pt-2">
      {/* created data */}
      <div>
        <span className="font-semibold">Created: </span>
        <span>{formatDateTimeShort(item.createdAt)}</span>{" "}
        {item.createdBy && <span>by {getUserDisplayName(item.createdBy)}</span>}
      </div>
      {/* Conditionally show updated by - only if it exists */}
      {item.updatedBy && item.updatedBy._id && (
        <div>
          <span className="font-semibold">Last Updated: </span>
          <span>
            {formatDateTimeShort(item.updatedAt)} by{" "}
            {getUserDisplayName(item.updatedBy)}
          </span>
        </div>
      )}
    </div>
  );
};
