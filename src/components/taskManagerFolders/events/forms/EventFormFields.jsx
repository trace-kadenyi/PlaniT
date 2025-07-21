export default function EventFormFields({
  formData,
  onFieldChange,
  formStatus,
  formError,
  onCancel,
  onSubmit,
  mode = "create",
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
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
          required
          className="w-full border border-[#E3CBC1] px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#BE3455]"
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
          className="w-full border border-[#E3CBC1] px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#BE3455]"
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
            min={new Date().toISOString().slice(0, 16)}
            className="w-full border border-[#E3CBC1] px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#BE3455] appearance-none"
          />
          {/* Custom calendar icon */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-[#9B2C62]" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        {/* Helper text */}
        <p className="text-xs text-gray-500 mt-1">
          Select date and time
        </p>
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
            className="w-full border border-[#E3CBC1] px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#BE3455]"
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
            className="w-full border border-[#E3CBC1] px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#BE3455]"
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
            className="border px-3 py-2 rounded-lg"
          />
          <input
            type="text"
            name="location.address"
            placeholder="Address"
            value={formData.location?.address || ""}
            onChange={onFieldChange}
            className="border px-3 py-2 rounded-lg"
          />
          <input
            type="text"
            name="location.city"
            placeholder="City"
            value={formData.location?.city || ""}
            onChange={onFieldChange}
            className="border px-3 py-2 rounded-lg"
          />
          <input
            type="text"
            name="location.country"
            placeholder="Country"
            value={formData.location?.country || ""}
            onChange={onFieldChange}
            className="border px-3 py-2 rounded-lg"
          />
        </div>
      </fieldset>

      {/* Error Message */}
      {formStatus === "failed" && (
        <div className="p-3 bg-red-50 rounded-md">
          <p className="text-sm text-red-600">Error: {formError}</p>
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
