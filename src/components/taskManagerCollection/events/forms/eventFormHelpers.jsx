import { Link } from "react-router-dom";

// for clients not preselected
export const NotPreselected = ({
  formData,
  onFieldChange,
  clients,
  clientsLoading,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
        Select Client
      </label>

      {clientsLoading ? (
        <div className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#F9F3F0] to-[#F5E9E4] border border-[#E3CBC1] animate-pulse">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-[#E3CBC1] rounded-full animate-pulse"></div>
            <span className="text-[#9B2C62]/70">Loading clients...</span>
          </div>
        </div>
      ) : (
        <div className="relative">
          <select
            name="client"
            value={formData.client}
            onChange={onFieldChange}
            className="w-full px-4 py-3 pr-10 rounded-lg border border-[#E3CBC1] bg-white text-[#6B2D5C] focus:outline-none focus:ring-2 focus:ring-[#BE3455]/50 focus:border-[#BE3455] transition-all duration-200 appearance-none shadow-sm hover:border-[#D4A798]"
          >
            <option value="" disabled className="text-gray-400">
              -- Select a client --
            </option>
            {clients
              .filter((client) => !client.isArchived)
              .map((client) => (
                <option
                  key={client._id}
                  value={client._id}
                  className="text-[#6B2D5C] hover:bg-[#F9F3F0]"
                >
                  {client.name}
                </option>
              ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-5 w-5 text-[#9B2C62]/70"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

// preselected clients
export const PreselectedClients = ({
  clients,
  preSelectedClientId,
  onFieldChange,
}) => {
  return (
    <div className="p-3 bg-[#F3E8FF] rounded-lg border border-[#E3CBC1]">
      <div className="flex items-center gap-2 mb-1">
        <p className="text-sm text-gray-600">Client:</p>
        {clients.find((c) => c._id === preSelectedClientId)?.isArchived && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
            Archived
          </span>
        )}
      </div>
      <p className="font-semibold text-[#9B2C62]">
        {clients.length > 0
          ? clients.find((c) => c._id === preSelectedClientId)?.name
          : "Loading client..."}
      </p>
      <input
        type="hidden"
        name="client"
        value={preSelectedClientId}
        onChange={onFieldChange}
      />
      {clients.find((c) => c._id === preSelectedClientId)?.isArchived && (
        <p className="mt-2 text-xs text-yellow-600">
          Note: Archived clients cannot be assigned to new events.{" "}
          <Link
            to={`/clients/${preSelectedClientId}`}
            className="text-[#9B2C62] font-semibold underline"
          >
            Restore this client
          </Link>{" "}
          if they have an upcoming event.
        </p>
      )}
    </div>
  );
};
