import { Link } from "react-router-dom";

// for clients not preselected
export const NotPreselected = ({
  formData,
  onFieldChange,
  clients,
  clientsLoading,
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
        Client
      </label>
      {clientsLoading ? (
        <div className="w-full border border-[#E3CBC1] px-4 py-2 rounded-lg bg-gray-100 animate-pulse">
          Loading clients...
        </div>
      ) : (
        <select
          name="client"
          value={formData.client}
          onChange={onFieldChange}
          required
          className="w-full border border-[#E3CBC1] px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#BE3455]"
        >
          <option value="">-- Select a client --</option>
          {clients
            .filter((client) => !client.isArchived)
            .map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
        </select>
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
