import { useNavigate } from "react-router-dom";

export default function NoEvent() {
  const navigate = useNavigate();

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-[#F3EDE9] text-center dark:bg-gray-800/80 dark:border-gray-700">
      <div className="mx-auto max-w-md">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-[#9B2C62] dark:text-[#D97706]">
          No events found
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Get started by creating your first event
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate("/events/new")}
            className="inline-flex items-center px-4 py-2 bg-[#9B2C62] text-white rounded-lg shadow hover:bg-[#801f4f] transition"
          >
            + New Event
          </button>
        </div>
      </div>
    </div>
  );
}
