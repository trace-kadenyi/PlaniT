import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchClients,
  archiveClient,
  restoreClient,
  resetArchiveStates,
} from "../redux/clientsSlice";

export default function Clients() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filterMode, setFilterMode] = useState("active"); // "active" | "archived" | "all"

  const { items: allClients, status, error } = useSelector(
    (state) => state.clients
  );

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetArchiveStates());
    };
  }, [dispatch]);

  const handleArchiveToggle = (clientId, isArchived) => {
    const action = isArchived ? restoreClient : archiveClient;
    dispatch(action(clientId)).then(() => dispatch(fetchClients()));
  };

  const filteredClients = allClients.filter((client) => {
    if (filterMode === "active") return !client.isArchived;
    if (filterMode === "archived") return client.isArchived;
    return true; // all
  });

  return (
    <main className="min-h-screen bg-[#FFF7ED] px-4 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#9B2C62]">Client Directory</h1>
          <button
            onClick={() => navigate("/clients/new")}
            className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-5 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            + Add Client
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilterMode("active")}
            className={`px-3 py-1 rounded font-medium text-sm ${
              filterMode === "active"
                ? "bg-[#9B2C62] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterMode("archived")}
            className={`px-3 py-1 rounded font-medium text-sm ${
              filterMode === "archived"
                ? "bg-[#9B2C62] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Archived
          </button>
          <button
            onClick={() => setFilterMode("all")}
            className={`px-3 py-1 rounded font-medium text-sm ${
              filterMode === "all"
                ? "bg-[#9B2C62] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            All
          </button>
        </div>

        {status === "loading" && (
          <p className="text-[#9B2C62]">Loading clients...</p>
        )}
        {error && <p className="text-red-600">{error}</p>}

        {status === "succeeded" && filteredClients.length === 0 && (
          <p className="text-gray-500">No clients found.</p>
        )}

        {status === "succeeded" && filteredClients.length > 0 && (
          <ul className="grid gap-4">
            {filteredClients.map((client) => (
              <li
                key={client._id}
                className={`p-4 bg-white border rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-md transition ${
                  client.isArchived
                    ? "border-gray-300 opacity-75"
                    : "border-[#F59E0B]"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-[#9B2C62] text-lg">
                      {client.name}
                    </h2>
                    {client.isArchived && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Archived
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {client.contact?.email || "—"} |{" "}
                    {client.contact?.phone || "—"}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => navigate(`/clients/${client._id}`)}
                    className="text-[#9B2C62] hover:underline text-sm font-medium px-3 py-1"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() =>
                      handleArchiveToggle(client._id, client.isArchived)
                    }
                    disabled={client.isArchiving || client.isRestoring}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      client.isArchived
                        ? "bg-[#F3E8FF] text-[#9B2C62] hover:bg-[#E3D5FF]"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {client.isArchiving
                      ? "Archiving..."
                      : client.isRestoring
                      ? "Restoring..."
                      : client.isArchived
                      ? "Restore"
                      : "Archive"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
