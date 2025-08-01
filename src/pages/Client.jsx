import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchClientWithEvents } from "../redux/clientsSlice";

export default function Client() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    clientDetails: { data: client, events, status, error },
  } = useSelector((state) => state.clients);

  useEffect(() => {
    dispatch(fetchClientWithEvents(id));
  }, [dispatch, id]);

  return (
    <main className="min-h-screen bg-white px-4 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link to="/clients" className="text-sm text-blue-600 hover:underline">
            ← Back to Clients
          </Link>
        </div>

        {status === "loading" && <p>Loading client details...</p>}
        {status === "failed" && <p className="text-red-600">{error}</p>}
        {status === "succeeded" && client && (
          <>
            <h1 className="text-2xl font-bold text-[#9B2C62] mb-2">{client.name}</h1>
            <p className="text-gray-700 mb-1">
              📧 {client.contact?.email || "—"} | 📞 {client.contact?.phone || "—"}
            </p>
            {client.preferences && (
              <p className="text-sm text-gray-500 mb-1">Preferences: {client.preferences}</p>
            )}
            {client.notes && (
              <p className="text-sm text-gray-500 mb-4">Notes: {client.notes}</p>
            )}

            <hr className="my-6 border-gray-300" />

            <h2 className="text-xl font-semibold text-[#065F46] mb-3">Event History</h2>
            {events.length === 0 ? (
              <p className="text-gray-500">No events for this client yet.</p>
            ) : (
              <ul className="space-y-3">
                {events.map((event) => (
                  <li
                    key={event._id}
                    className="bg-[#F9FAFB] p-4 rounded-lg border shadow-sm"
                  >
                    <div className="font-medium text-[#374151]">{event.name}</div>
                    <div className="text-sm text-gray-600">
                      Type: {event.type} | Status: {event.status}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </main>
  );
}
