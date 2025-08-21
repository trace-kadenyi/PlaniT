// No budget UI
export const NoBudget = ({ Link, eventID }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-[#F3EDE9] my-6">
    <div className="flex items-center gap-3 mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-[#9B2C62]"
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
      <h2 className="text-lg font-semibold text-[#9B2C62]">Budget Overview</h2>
    </div>
    <div className="flex flex-col gap-1 bg-[#FFF5EB] p-4 rounded-lg border border-[#F3EDE9]">
      <div className="flex items-start gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-[#6B3B0F]"
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
          <p className="text-[#6B3B0F] font-medium">
            No budget set for this event
          </p>
        </div>
      </div>
      <Link
        to={`/events/${eventID}/edit`}
        className="text-[#9B2C62] hover:text-[#7A2350] text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 self-start mt-1 cursor-default ml-5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span className="border-b px-1 border-dashed border-[#9B2C62] hover:border-[#7A2350] hover:text-[#7A2350] hover:rounded-lg hover:bg-[#BE3455]/10">
          Add budget
        </span>
      </Link>
    </div>
  </div>
);

// Color definitions
const colors = {
  primary: {
    main: "#9B2C62", // Deep mulberry
    light: "#9B2C62/10",
    dark: "#7A2450",
  },
  secondary: {
    main: "#FF9933", // Saffron gold
    light: "#FFB866", // Lighter pumpkin
    dark: "#E07C24", // Darker pumpkin
  },
};
