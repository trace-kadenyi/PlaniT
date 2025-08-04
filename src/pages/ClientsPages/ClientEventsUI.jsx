import { EventStatusPill, DatePill } from "../../components/shared/UIFragments";
export default function ClientEventsUI({ event, Link }) {
  return (
    <li
      key={event._id}
      className="bg-white p-5 rounded-xl border border-[#F3E8FF] hover:border-[#F59E0B] shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex-1 min-w-0">
          {" "}
          {/* Prevents text overflow */}
          <Link
            to={`/events/${event._id}`}
            className="font-bold text-[#9B2C62] text-lg mb-1 truncate hover:underline hover:italic hover:text-[#7B1D52] transition-colors"
          >
            {event.name}
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-sm mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] flex-shrink-0" />
              <span className="bg-[#F59E0B]/10 text-[#B45309] px-2 py-1 rounded-full text-xs">
                {event.type}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#9B2C62] flex-shrink-0" />
              <EventStatusPill status={event.status} />
            </div>
          </div>
        </div>
        {/* handle date */}
        <div className="mt-3 md:mt-0 flex flex-col text-xs gap-3 sm:gap-1">
          <span className="flex items-center gap-3">
            {" "}
            <span className="font-semibold text-gray-500"> Event date: </span>
            <DatePill date={event.date} status={event.status} />
          </span>

          <span className="flex items-center gap-3">
            {" "}
            <span className="font-semibold text-gray-500"> Created on: </span>
            <DatePill date={event.createdAt} status={event.status} />
          </span>
        </div>
      </div>
    </li>
  );
}
