import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronDown, ChevronRight } from "lucide-react";

import { fetchEvents, deleteEvent } from "../redux/eventsSlice";
import {
  formatDateTime,
  getStatusColor,
} from "../components/taskManagerCollection/utils/formatting";
import { toastWithProgress } from "../globalHooks/useToastWithProgress";
import DeleteConfirmationToast from "../components/taskManagerCollection/utils/deleteConfirmationToast";
import EditDeleteEvent from "../components/shared/EditDeleteEvent";
import { ClientInfo } from "../components/shared/UIFragments";
import { LoadingPage } from "../components/shared/LoadingStates";

export default function Events() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expandedMonths, setExpandedMonths] = useState({});

  const { items: events, status, error } = useSelector((state) => state.events);

  // fetch events
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Sort events by date in ascending order (earliest first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // handle delete event
  const handleDelete = (id) => {
    const duration = 10000; // 10 seconds

    toast(
      (t) => (
        <DeleteConfirmationToast
          t={t}
          duration={duration}
          onConfirm={() => {
            dispatch(deleteEvent(id));
            toast.dismiss(t.id);
            toastWithProgress("Event deleted successfully");
          }}
          onCancel={() => toast.dismiss(t.id)}
        />
      ),
      {
        duration,
        position: "top-center",
      }
    );
  };

  // Group events by month
  const eventsByMonth = sortedEvents.reduce((acc, event) => {
    const eventDate = new Date(event.date);
    const monthYear = eventDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }

    acc[monthYear].push(event);
    return acc;
  }, {});

  // Initialize expanded months - open first month by default
  useEffect(() => {
    if (sortedEvents.length > 0 && Object.keys(expandedMonths).length === 0) {
      const firstMonth = Object.keys(eventsByMonth)[0];
      setExpandedMonths({ [firstMonth]: true });
    }
  }, [sortedEvents, eventsByMonth]);

  const toggleMonth = (monthYear) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [monthYear]: !prev[monthYear],
    }));
  };

  const currentMonthYear = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#9B2C62]">
              Events Manager
            </h1>
            <p className="text-gray-500 mt-1">
              Organize and manage your upcoming events
            </p>
          </div>
          <button
            onClick={() => navigate("/events/new")}
            className="flex items-center gap-2 bg-[#9B2C62] text-white px-4 py-2 rounded-lg shadow hover:bg-[#801f4f] transition transform hover:-translate-y-0.5"
          >
            <span className="text-lg">+</span> Create New Event
          </button>
        </div>

        {/* Status Messages */}
        {status === "loading" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <LoadingPage message="Loading events..." />
          </div>
        )}
        {status === "failed" && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <p className="text-red-500">Error: {error}</p>
          </div>
        )}
        {status === "succeeded" && events.length === 0 && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-600 mb-4">No events found.</p>
            <button
              onClick={() => navigate("/events/new")}
              className="bg-[#9B2C62] text-white px-4 py-2 rounded-lg hover:bg-[#801f4f] transition"
            >
              Create Your First Event
            </button>
          </div>
        )}

        {/* Events List */}
        {status === "succeeded" && events.length > 0 && (
          <div className="space-y-6">
            {Object.entries(eventsByMonth).map(([monthYear, monthEvents]) => (
              <section
                key={monthYear}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Month Header */}
                <button
                  onClick={() => toggleMonth(monthYear)}
                  className={`flex items-center w-full p-4 hover:bg-gray-50 transition ${
                    expandedMonths[monthYear] ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {expandedMonths[monthYear] ? (
                      <ChevronDown className="w-5 h-5 text-[#9B2C62]" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-[#9B2C62]" />
                    )}
                    <h2
                      className={`text-xs font-semibold ${
                        monthYear === currentMonthYear
                          ? "text-[#F59E0B]"
                          : "text-[#9B2C62]"
                      }`}
                    >
                      {monthYear}
                    </h2>
                  </div>
                  <span className="ml-auto bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-sm font-medium">
                    {monthEvents.length} event
                    {monthEvents.length !== 1 ? "s" : ""}
                  </span>
                </button>

                {/* Events Grid */}
                {expandedMonths[monthYear] && (
                  <div className="p-4 pt-2">
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {monthEvents.map((event, index) => (
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
                                  <ClientInfo event={event} Link={Link} />
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
                                <p className="text-xs font-medium">
                                  {formatDateTime(event.date)}
                                </p>
                              </div>

                              <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                                {event.description ||
                                  "No description provided."}
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
                                    {event.location?.city},{" "}
                                    {event.location?.country}
                                  </p>
                                </div>
                                <span
                                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(
                                    event.status
                                  )}`}
                                >
                                  {event.status}
                                </span>
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
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
