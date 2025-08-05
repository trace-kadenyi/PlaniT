import { Mail } from "lucide-react";

export default function ClientCard({
  client,
  id,
  Link,
  handleArchiveToggle,
  localIsArchived,
}) {
  return ( 
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

      {/* email and phone number */}
      <div className="space-y-3">
        <div className="flex items-center items-center">
          <span>
            <Mail className="w-5 h-5 font-bold mr-2 text-[#9B2C62]" />
          </span>
          <p className="text-gray-700 break-all">
            {client.contact?.email || (
              <span className="text-gray-400">No email provided</span>
            )}
          </p>
        </div>
        <div className="flex items-center">
          <span className="text-[#F59E0B] mr-2 mt-1">📞</span>
          <p className="text-gray-700">
            {client.contact?.phone || (
              <span className="text-gray-400">No phone provided</span>
            )}
          </p>
        </div>

        {/* company */}
        <div className="mt-4 pt-4 border-t border-[#F3E8FF]">
          <h3 className="font-semibold text-[#9B2C62] mb-1">Company</h3>
          <p className="text-gray-700">{client.company || "Individual"}</p>
        </div>

        {/* preferences */}
        {client.preferences && (
          <div className="mt-4 pt-4 border-t border-[#F3E8FF]">
            <h3 className="font-semibold text-[#9B2C62] mb-1">Preferences</h3>
            <p className="text-gray-700">{client.preferences}</p>
          </div>
        )}

        {/* notes */}
        {client.notes && (
          <div className="mt-4 pt-4 border-t border-[#F3E8FF]">
            <h3 className="font-semibold text-[#9B2C62] mb-1">Notes</h3>
            <p className="text-gray-700 whitespace-pre-line">{client.notes}</p>
          </div>
        )}
      </div>
    </section>
  );
}
