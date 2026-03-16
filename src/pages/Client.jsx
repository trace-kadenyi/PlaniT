import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { toastWithProgress } from "../globalHooks/useToastWithProgress";
import DeleteConfirmationToast from "../components/taskManagerCollection/utils/deleteConfirmationToast";

import {
  fetchClients,
  fetchClientWithEvents,
  archiveClient,
  restoreClient,
  deleteClient,
} from "../redux/clientsSlice";

import { IsArchivedCli } from "../components/shared/UIFragments";
import { LoadingPage } from "../components/shared/LoadingStates";
import { ErrorState } from "../components/shared/ErrorStates";
import ClientEventsUI from "../components/clients/ClientEventsUI";
import ClientCard from "../components/clients/ClientCard";
import { createClientDeleteHandler } from "../globalHandlers/createClientDeleteHandler";
import {
  AddNewClientEventLink,
  ScheduleEventLink,
} from "../components/buttons/ClientButtons";
import { useToastLock } from "../globalUtils/useToastLock";

export default function Client() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toastLock = useToastLock();

  const [localIsArchived, setLocalIsArchived] = useState(false);

  const {
    clientDetails: { data: client, events, status, error },
    deleteStatus,
    deleteError,
  } = useSelector((state) => state.clients);

  // filter out viewers
  const notAuthorized =
    useSelector((state) => state.auth.user).role === "viewer";

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

  // visible events
  const visibleEvents = notAuthorized
    ? events.filter((e) => !e.isDeleted && !e.isArchived)
    : events;

  // handle archive toggle
  const handleArchiveToggle = async (clientId, isArchived) => {
    setLocalIsArchived(!isArchived);
    const action = isArchived ? restoreClient : archiveClient;

    try {
      await dispatch(action(clientId));
      await dispatch(fetchClients());
    } catch (error) {
      setLocalIsArchived(isArchived);
    }
  };

  // handle delete client
  const handleDelete = createClientDeleteHandler(
    dispatch,
    id,
    navigate,
    deleteClient,
    toast,
    toastWithProgress,
    DeleteConfirmationToast,
    toastLock,
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FEF3E6] to-[#FFF7ED] dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black px-4 sm:px-8 pt-15 pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link
            to="/clients"
            className="inline-flex items-center text-[#9B2C62] hover:text-[#7B1D52] font-medium transition-colors duration-200 dark:text-[#F59E0B] dark:hover:dark:text-[#D97706]"
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

        {/* Delete Error Banner */}
        {deleteStatus === "failed" && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-medium">Delete failed: {deleteError}</p>
          </div>
        )}

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
                  className="text-sm text-red-600 dark:text-red-700 hover:underline font-medium"
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
            <>
              <ClientCard
                client={client}
                id={id}
                Link={Link}
                handleArchiveToggle={handleArchiveToggle}
                localIsArchived={localIsArchived}
                handleDelete={handleDelete}
              />
            </>

            {/* client event history section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#9B2C62] dark:text-[#D97706]">
                  Event History
                </h2>
                <AddNewClientEventLink client={client} />
              </div>

              {/* no events handling */}
              {visibleEvents.length === 0 ? (
                <div className="bg-white dark:bg-gradient-to-b dark:from-[#1a1026] dark:to-black p-8 rounded-xl border-2 border-dashed border-[#F3E8FF] dark:border-[#9B2C62]/30 text-center hover:border-[#9B2C62]/30 transition-colors">
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
                  <h3 className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    No events scheduled
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Get started by scheduling your first event
                  </p>
                  <ScheduleEventLink client={client} />
                </div>
              ) : (
                // events list
                <ul className="space-y-4">
                  {visibleEvents.map((event) => (
                    <ClientEventsUI key={event._id} event={event} Link={Link} />
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
