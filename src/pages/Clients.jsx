import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchClients } from "../redux/clientsSlice";

export default function Clients() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: clients, status, error } = useSelector((state) => state.clients);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

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

        {status === "loading" && <p className="text-[#9B2C62]">Loading clients...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {status === "succeeded" && clients.length === 0 && (
          <p className="text-gray-500">No clients found.</p>
        )}

        {status === "succeeded" && clients.length > 0 && (
          <ul className="grid gap-4">
            {clients.map((client) => (
              <li
                key={client._id}
                className="p-4 bg-white border border-[#F59E0B] rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-md transition"
              >
                <div>
                  <h2 className="font-semibold text-[#9B2C62] text-lg">{client.name}</h2>
                  <p className="text-sm text-gray-600">
                    {client.contact?.email || "—"} | {client.contact?.phone || "—"}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/clients/${client._id}`)}
                  className="mt-2 sm:mt-0 text-[#9B2C62] hover:underline text-sm font-medium"
                >
                  View Details →
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
