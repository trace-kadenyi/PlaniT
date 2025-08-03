import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";

import {
  fetchClients,
  fetchClientWithEvents,
  archiveClient,
  restoreClient,
} from "../redux/clientsSlice";
import {
  StatusPill,
  DatePill,
  IsArchivedCli,
} from "../components/shared/UIFragments";
import { LoadingPage } from "../components/shared/LoadingStates";
import { ErrorState } from "../components/shared/ErrorStates";

export default function Client() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [localIsArchived, setLocalIsArchived] = useState(false);

  const {
    clientDetails: { data: client, events, status, error },
  } = useSelector((state) => state.clients);

  // fetch client
  useEffect(() => {
    dispatch(fetchClientWithEvents(id));
  }, [dispatch, id]);

  // Sync local state with Redux state
  useEffect(() => {
    if (client) {
      setLocalIsArchived(client.isArchived);
    }
  }, [client]);
  // handle archive toggle
  const handleArchiveToggle = async (clientId, isArchived) => {
    setLocalIsArchived(!isArchived);
    const action = isArchived ? restoreClient : archiveClient;

    try {
      await dispatch(action(clientId)); // Updates Redux
      await dispatch(fetchClients());
    } catch (error) {
      setLocalIsArchived(isArchived);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FEF3E6] to-[#FFF7ED] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link
            to="/clients"
            className="inline-flex items-center text-[#9B2C62] hover:text-[#7B1D52] font-medium transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Clients
          </Link>
        </div>

        {/* loading */}
        {status === "loading" && (
          <LoadingPage message="Loading client details..." />
        )}

        {/* failed */}
        {status === "failed" && (
          <div className="mb-6">
            <ErrorState
              message={error || "Failed to load client details."}
              action={
                <button
                  onClick={() => dispatch(fetchClientWithEvents(id))}
                  className="text-sm text-red-600 hover:underline font-medium"
                >
                  Retry
                </button>
              }
            />
          </div>
        )}

        {status === "succeeded" && client && (
          <>
            {/* Archive Warning Banner */}
            {localIsArchived && <IsArchivedCli />}
            {/* client card */}
            <section className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-[#9B2C62]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h1 className="text-3xl font-bold text-[#9B2C62] mb-2 md:mb-0">
                  {client.name}
                </h1>
                <div className="flex space-x-3">
                  {client && (
                    <Link
                      to={`/clients/${id}/edit`}
                      className="bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#D97706] px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200"
                    >
                      Edit Client
                    </Link>
                  )}

                  <button
                    onClick={() => handleArchiveToggle(id, localIsArchived)}
                    disabled={client?.isArchiving || client?.isRestoring}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      localIsArchived
                        ? "bg-[#FFBF00] hover:bg-[#E6AC00] text-[#571838]"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {client?.isArchiving
                      ? "Archiving..."
                      : client?.isRestoring
                      ? "Restoring..."
                      : localIsArchived
                      ? "Restore"
                      : "Archive"}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-[#F59E0B] mr-2 mt-1">📧</span>
                  <p className="text-gray-700">
                    {client.contact?.email || (
                      <span className="text-gray-400">No email provided</span>
                    )}
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="text-[#F59E0B] mr-2 mt-1">📞</span>
                  <p className="text-gray-700">
                    {client.contact?.phone || (
                      <span className="text-gray-400">No phone provided</span>
                    )}
                  </p>
                </div>

                {client.preferences && (
                  <div className="mt-4 pt-4 border-t border-[#F3E8FF]">
                    <h3 className="font-semibold text-[#9B2C62] mb-1">
                      Preferences
                    </h3>
                    <p className="text-gray-700">{client.preferences}</p>
                  </div>
                )}

                {client.notes && (
                  <div className="mt-4 pt-4 border-t border-[#F3E8FF]">
                    <h3 className="font-semibold text-[#9B2C62] mb-1">Notes</h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {client.notes}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#9B2C62]">
                  Event History
                </h2>
                <Link
                  to={`/events/new?client=${client._id}`}
                  className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-4 py-2 rounded-lg"
                >
                  + Add New Event
                </Link>
              </div>

              {/* no events handling */}
              {events.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border-2 border-dashed border-[#F3E8FF] text-center hover:border-[#9B2C62]/30 transition-colors">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-700">
                    No events scheduled
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 mb-4">
                    Get started by scheduling your first event
                  </p>
                  <Link
                    to={`/events/new?client=${client._id}`}
                    className="inline-flex items-center bg-[#9B2C62] hover:bg-[#7B1D52] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                    Schedule Event
                  </Link>
                </div>
              ) : (
                // events list
                <ul className="space-y-4">
                  {events.map((event) => (
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
                              <StatusPill status={event.status} />
                            </div>
                          </div>
                        </div>
                        {/* handle date */}
                        <div className="mt-3 md:mt-0 flex flex-col text-xs gap-3 sm:gap-1">
                          <span className="flex items-center gap-3">
                            {" "}
                            <span className="font-semibold text-gray-500">
                              {" "}
                              Event date:{" "}
                            </span>
                            <DatePill date={event.date} status={event.status} />
                          </span>

                          <span className="flex items-center gap-3">
                            {" "}
                            <span className="font-semibold text-gray-500">
                              {" "}
                              Created on:{" "}
                            </span>
                            <DatePill
                              date={event.createdAt}
                              status={event.status}
                            />
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
