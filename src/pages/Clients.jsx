import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchClients } from "../redux/clientsSlice";

export default function Clients() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    items: clients,
    status,
    error,
  } = useSelector((state) => state.clients);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-white px-4 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#9B2C62]">Clients</h1>
          <button
            onClick={() => navigate("/clients/new")}
            className="bg-[#10B981] hover:bg-[#059669] text-white px-5 py-2 rounded-lg font-medium"
          >
            + Add Client
          </button>
        </div>

        {status === "loading" && <p>Loading clients...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {status === "succeeded" && clients.length === 0 && (
          <p className="text-gray-500">No clients found.</p>
        )}

        {status === "succeeded" && clients.length > 0 && (
          <ul className="grid gap-4">
            {clients.map((client) => (
              <li
                key={client._id}
                className="p-4 bg-[#F9FAFB] rounded-lg border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between"
              >
                <div>
                  <h2 className="font-semibold text-[#374151]">
                    {client.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {client.contact?.email || "—"} |{" "}
                    {client.contact?.phone || "—"}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/clients/${client._id}`)}
                  className="mt-2 sm:mt-0 text-blue-600 hover:underline text-sm"
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
