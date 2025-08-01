import { Link } from "react-router-dom";
import {
  formatLocalDateTimeForDisplay,
  getLocalDateTimeString,
} from "../../utils/dateHelpers";

export default function EventFormFields({
  formData,
  onFieldChange,
  formStatus,
  formError,
  onCancel,
  onSubmit,
  budgetError,
  clients = [],
  clientsLoading = false,
  preSelectedClientId = null,
  mode = "create",
}) {
  const isClientArchived = preSelectedClientId
    ? clients.find((c) => c._id === preSelectedClientId)?.isArchived
    : false;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Client Selection (only show if not pre-selected) */}
      {!preSelectedClientId && (
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
      )}

      {/* Show client name if pre-selected */}
      {preSelectedClientId && (
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
      )}
      {/* Event Name */}
      <div>
        <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
          Event Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onFieldChange}
          maxLength={70}
          disabled={isClientArchived}
          required
          className={`w-full border border-[#E3CBC1] px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#BE3455] ${
            isClientArchived ? "cursor-not-allowed bg-gray-200 opacity-65" : ""
          } `}
        />
        <p className="text-xs text-right text-gray-500 mt-1">
          {formData.name.length}/70 characters
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onFieldChange}
          rows={4}
          maxLength={300}
          className={`w-full border border-[#E3CBC1] px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#BE3455]`}
        />
        <p className="text-xs text-right text-gray-500 mt-1">
          {formData.description.length}/300 characters
        </p>
      </div>

      {/* Date */}
      <div className="relative">
        <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
          Date
        </label>
        <div className="relative">
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={onFieldChange}
            min={getLocalDateTimeString()}
            className={`w-full border border-[#E3CBC1] px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#BE3455] appearance-none`}
          />
          {/* Custom calendar icon */}
          <div className="absolute right-4 top-5 transform -translate-y-1/2 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#9B2C62]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {/* Helper text */}
        <div className="text-xs text-gray-500 mt-1 space-y-1">
          <p>• Select a future date and time</p>
          <p>
            • Current local time:{" "}
            <span className="font-semibold">
              {formatLocalDateTimeForDisplay(new Date())}
            </span>
          </p>
        </div>
      </div>

      {/* Type & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
            Type
          </label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={onFieldChange}
            className={`w-full border border-[#E3CBC1] px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#BE3455]`}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={onFieldChange}
            className={`w-full border border-[#E3CBC1] px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#BE3455]`}
          >
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Location */}
      <fieldset className="border rounded-lg p-4">
        <legend className="text-sm font-semibold text-[#9B2C62]">
          Location
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="location.venue"
            placeholder="Venue"
            value={formData.location?.venue || ""}
            onChange={onFieldChange}
            className={`border px-3 py-2 rounded-lg `}
          />
          <input
            type="text"
            name="location.address"
            placeholder="Address"
            value={formData.location?.address || ""}
            onChange={onFieldChange}
            className={`border px-3 py-2 rounded-lg `}
          />
          <input
            type="text"
            name="location.city"
            placeholder="City"
            value={formData.location?.city || ""}
            onChange={onFieldChange}
            className={`border px-3 py-2 rounded-lg `}
          />
          <input
            type="text"
            name="location.country"
            placeholder="Country"
            value={formData.location?.country || ""}
            onChange={onFieldChange}
            className={`border px-3 py-2 rounded-lg `}
          />
        </div>
      </fieldset>

      {/* Add Budget Section */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        <h2 className="text-lg font-medium text-gray-900">
          Budget Information
        </h2>

        {budgetError && (
          <div className="mb-4 p-3 bg-red-50 font-semibold text-red-600 rounded-md">
            {budgetError}
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="initialBudget"
              className="block text-sm font-medium text-gray-700"
            >
              Initial Budget ($)
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="initialBudget"
                id="initialBudget"
                min="0"
                step="0.01"
                value={formData.initialBudget || ""}
                onChange={onFieldChange}
                className={`block w-full rounded-md border ${
                  budgetError ? "border-red-500" : "border-gray-300"
                } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-md p-4 font-semibold`}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label
              htmlFor="budgetNotes"
              className="block text-sm font-medium text-gray-700"
            >
              Budget Notes (Optional)
            </label>
            <div className="mt-1">
              <textarea
                id="budgetNotes"
                name="budgetNotes"
                rows={3}
                value={formData.budgetNotes || ""}
                onChange={onFieldChange}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2`}
                placeholder="Any notes about the budget..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {formStatus === "failed" && (
        <div className="p-3 bg-red-50 rounded-md">
          <p className="text-sm text-red-600">{formError}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={formStatus === "loading"}
          className="bg-[#F59E0B] hover:bg-[#d97706] text-white font-semibold px-6 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {formStatus === "loading"
            ? "Saving..."
            : mode === "create"
            ? "Add Event"
            : "Save Changes"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-lg transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
