import { Link } from "react-router-dom";

import EditDeleteEvent from "../../shared/EditDeleteEvent";
import { ClientInfo, EventStatusPill } from "../../shared/UIFragments";
import { formatDateTime } from "../utils/formatting";

export default function EventCard({ event, index, navigate, handleDelete }) {
  return (
    <li
      key={index}
      className="relative rounded-lg bg-gradient-to-br from-[#FFF8F2] to-[#FFF0E5] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-[#F3EDE9] hover:shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-all duration-200 group"
    >
      <div className="p-5">
        <button
          onClick={() => navigate(`/events/${event._id}`)}
          className="block text-left w-full space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="inline-block text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-[#F8D476] to-[#F59E0B] text-[#6B3B0F] font-medium tracking-wide">
              {event.type}
            </p>
            {event.client && (
              <div className="flex items-center gap-2 text-xs bg-white/80 rounded-lg px-3 py-1 shadow-sm border border-[#F3EDE9] transition-colors duration-200 cursor-default">
                <span className="text-xs font-semibold text-gray-500">
                  Client:
                </span>
                <span className="font-medium text-[#6B3B0F] transition-colors duration-200">
                  {event.client.name}
                </span>
              </div>
            )}
          </div>
          <h2
            className="mt-2 text-lg font-semibold text-[#9B2C62] tracking-tight line-clamp-1 hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/events/${event._id}`);
            }}
          >
            {event.name}
          </h2>

          <div className="flex items-center gap-2 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs font-semibold">
              {formatDateTime(event.date)}
            </p>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mt-2">
            {event.description || "No description provided."}
          </p>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-1 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-xs font-medium">
                {event.location?.city}, {event.location?.country}
              </p>
            </div>
            <EventStatusPill status={event.status} />
          </div>
        </button>
      </div>

      {/* delete/edit buttons */}
      <EditDeleteEvent
        navigate={navigate}
        eventID={event._id}
        handleDelete={handleDelete}
      />
    </li>
  );
}
