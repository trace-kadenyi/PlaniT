import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchClientWithEvents, deleteClient, archiveClient, restoreClient } from "../redux/clientsSlice";

export default function Client() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    clientDetails: { data: client, events, status, error },
  } = useSelector((state) => state.clients);

  // fetch client
  useEffect(() => {
    dispatch(fetchClientWithEvents(id));
  }, [dispatch, id]);

  // handle delete
  const handleClientDelete = () => {
    dispatch(deleteClient(id));
    navigate("/clients");
  };

  // handle archive toggle
  const handleArchiveToggle = () => {
    if(client.isArchived) {
      dispatch(restoreClient(client._id))
    } else {
      dispatch(archiveClient(client._id))
    }
  }

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

        {status === "loading" && (
          <div className="text-center py-12">
            <p className="text-[#9B2C62] animate-pulse text-lg">
              Loading client details...
            </p>
          </div>
        )}
        {status === "failed" && (
          <div className="bg-[#FEE2E2] p-4 rounded-lg border border-red-200 mb-6">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {status === "succeeded" && client && (
          <>
           {/* Archive Warning Banner */}
            {client.isArchived && (
              <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                <p className="text-yellow-700 flex items-center gap-2">
                  <svg 
                    className="w-5 h-5" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  This client is archived. Events remain visible but client cannot be assigned to new events.
                </p>
              </div>
            )}
            <section className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-[#9B2C62]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h1 className="text-3xl font-bold text-[#9B2C62] mb-2 md:mb-0">
                  {client.name}
                </h1>
                <div className="flex space-x-3">
                  <Link
                    to={`/clients/${id}/edit`}
                    className="bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#D97706] px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200"
                  >
                    Edit Client
                  </Link>
                  <button
                    onClick={handleClientDelete}
                    className="bg-[#9B2C62]/10 hover:bg-[#9B2C62]/20 text-[#9B2C62] px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200"
                  >
                    Delete Client
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
                  + Add New Event for {client.name}
                </Link>
              </div>

              {events.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-dashed border-[#F3E8FF] text-center">
                  <p className="text-gray-500 mb-4">
                    No events scheduled for this client yet
                  </p>
                  <button className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-4 py-2 rounded-lg font-medium text-sm shadow-md transition-all duration-200">
                    Schedule First Event
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {events.map((event) => (
                    <li
                      key={event._id}
                      className="bg-white p-5 rounded-xl border border-[#F3E8FF] hover:border-[#F59E0B] shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="font-bold text-[#9B2C62] text-lg mb-1">
                            {event.name}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                            <span className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-[#F59E0B] mr-2"></span>
                              Type: {event.type}
                            </span>
                            <span className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-[#9B2C62] mr-2"></span>
                              Status: {event.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 md:mt-0">
                          <span className="inline-block bg-[#F3E8FF] text-[#9B2C62] px-3 py-1 rounded-full text-xs font-medium">
                            {new Date(event.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
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
