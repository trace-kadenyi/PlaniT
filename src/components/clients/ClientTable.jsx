import {
  FiUser,
  FiMail,
  FiPhone,
  FiArchive,
  FiRefreshCw,
} from "react-icons/fi";
export default function ClientTable({
  currentClients,
  navigate,
  handleArchiveToggle,
}) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-[#9B2C62]">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
          >
            Client
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
          >
            Contact
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
          >
            Status
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {currentClients.map((client) => (
          <tr
            key={client._id}
            onClick={() => navigate(`/clients/${client._id}`)}
            className={client.isArchived ? "bg-gray-50" : "hover:bg-[#FFF7ED]"}
          >
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#F59E0B] flex items-center justify-center text-white">
                  <FiUser />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-[#9B2C62]">
                    {client.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {client.company || "Individual"}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900 flex items-center gap-2">
                <FiMail className="text-[#F59E0B]" />
                {client.contact?.email || "—"}
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                <FiPhone className="text-[#F59E0B]" />
                {client.contact?.phone || "—"}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  client.isArchived
                    ? "bg-amber-100 text-amber-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {client.isArchived ? "🗃️ Archived" : "✅ Active"}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end items-center gap-2">
                <button
                  onClick={() => navigate(`/clients/${client._id}`)}
                  className="text-[#9B2C62] hover:text-[#7A1F4D] flex items-center gap-1 px-3 py-1 rounded transition-colors hover:bg-[#9B2C62] hover:text-white"
                >
                  View Details
                </button>
                <button
                  onClick={() =>
                    handleArchiveToggle(client._id, client.isArchived)
                  }
                  disabled={client.isArchiving || client.isRestoring}
                  className={`flex items-center gap-1 px-3 py-1 rounded transition-colors ${
                    client.isArchived
                      ? "bg-[#FFBF00] hover:bg-[#E6AC00] text-[#571838]"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } ${
                    client.isArchiving || client.isRestoring
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {client.isArchiving ? (
                    <>
                      <FiRefreshCw className="animate-spin" /> Archiving...
                    </>
                  ) : client.isRestoring ? (
                    <>
                      <FiRefreshCw className="animate-spin" /> Restoring...
                    </>
                  ) : client.isArchived ? (
                    <>
                      <FiRefreshCw /> Restore
                    </>
                  ) : (
                    <>
                      <FiArchive /> Archive
                    </>
                  )}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
