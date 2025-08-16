import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronDown, ChevronRight } from "lucide-react";

import { fetchEvents, deleteEvent } from "../redux/eventsSlice";

import { toastWithProgress } from "../globalHooks/useToastWithProgress";
import DeleteConfirmationToast from "../components/taskManagerCollection/utils/deleteConfirmationToast";
import { LoadingPage } from "../components/shared/LoadingStates";
import EventCard from "../components/taskManagerCollection/events/EventCard";

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
    <main className="min-h-screen bg-gradient-to-b from-[#FFF8F2] to-white p-3 sm:p-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section with Decorative Elements */}
        <div className="relative mb-10">
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#F59E0B]/10 rounded-full blur-lg"></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#9B2C62]/10 rounded-full blur-lg"></div>

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#9B2C62] text-start mt-4 sm:mt-0">
                Events Manager
              </h1>
              <p className="text-gray-600 mt-2 max-w-lg">
                Organize and track all your upcoming events in one place
              </p>
            </div>
            <button
              onClick={() => navigate("/events/new")}
              className="flex items-center gap-2 bg-[#9B2C62] text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-[#801f4f] transition-all transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            >
              <span className="text-lg">+</span> Create New Event
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {status === "loading" && (
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-[#F3EDE9]">
            <LoadingPage message="Loading events..." />
          </div>
        )}

        {status === "failed" && (
          <div className="bg-red-50/80 backdrop-blur-sm p-6 rounded-xl border border-red-100 shadow-sm">
            <p className="text-red-600 font-medium">Error loading events:</p>
            <p className="text-red-500 mt-1">{error}</p>
          </div>
        )}

        {status === "succeeded" && events.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-[#F3EDE9] text-center">
            <div className="mx-auto max-w-md">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <h3 className="mt-4 text-lg font-medium text-[#9B2C62]">
                No events found
              </h3>
              <p className="mt-2 text-gray-600">
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
        )}
        {/* Events List */}
        {status === "succeeded" && events.length > 0 && (
          <div className="space-y-6">
            {Object.entries(eventsByMonth).map(([monthYear, monthEvents]) => (
              <section
                key={monthYear}
                className="bg-gradient-to-br from-[#FFF8F2]/30 to-white/70 rounded-xl shadow-sm border border-[#F3EDE9]/50 overflow-hidden"
              >
                {/* Month Header */}
                <button
                  onClick={() => toggleMonth(monthYear)}
                  className={`flex items-center w-full p-4 hover:bg-[#FFF8F2] transition border-l-4 ${
                    expandedMonths[monthYear]
                      ? " border-l-[#F59E0B] bg-gradient-to-br from-[#FFF8F2] to-[#FFF0E5]"
                      : "border-l-[#9B2C62]"
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
                  <span className="ml-auto bg-gray-100 text-[#9B2C62] px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    {monthEvents.length} event
                    {monthEvents.length !== 1 ? "s" : ""}
                  </span>
                </button>

                {/* Events Grid */}
                {expandedMonths[monthYear] && (
                  <div className="p-4 pt-2">
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {monthEvents.map((event, index) => (
                        <EventCard
                          key={index}
                          event={event}
                          navigate={navigate}
                          handleDelete={handleDelete}
                        />
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
