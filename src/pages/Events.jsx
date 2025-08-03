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
                        <EventCard key={index} event={event} navigate={navigate} handleDelete={handleDelete} />
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
