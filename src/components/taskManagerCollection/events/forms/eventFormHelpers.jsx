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


