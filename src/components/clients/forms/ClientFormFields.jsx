export default function ClientFormFields({
  formData,
  onFieldChange,
  onSubmit,
  formStatus,
  formError,
  onCancel,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
          Client Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onFieldChange}
          required
          className="w-full border border-[#E3CBC1] px-4 py-2 rounded-lg"
        />
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
            Email
          </label>
          <input
            type="email"
            name="contact.email"
            value={formData.contact.email}
            onChange={onFieldChange}
            className="w-full border border-[#E3CBC1] px-4 py-2 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="contact.phone"
            value={formData.contact.phone}
            onChange={onFieldChange}
            className="w-full border border-[#E3CBC1] px-4 py-2 rounded-lg"
          />
        </div>
      </div>

      {/* Company */}
      <div>
        <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
          Company
        </label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={onFieldChange}
          className="w-full border border-[#E3CBC1] px-4 py-2 rounded-lg"
        />
      </div>

      {/* Preferences */}
      <div>
        <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
          Preferences
        </label>
        <input
          type="text"
          name="preferences"
          value={formData.preferences}
          onChange={onFieldChange}
          className="w-full border border-[#E3CBC1] px-4 py-2 rounded-lg"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={onFieldChange}
          rows={4}
          className="w-full border border-[#E3CBC1] px-4 py-2 rounded-lg"
        />
      </div>

      {/* Error Message */}
      {formStatus === "failed" && (
        <div className="p-3 bg-red-50 rounded-md text-red-600">{formError}</div>
      )}

      {/* Submit Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={formStatus === "loading"}
          className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold px-6 py-2 rounded-lg"
        >
          {formStatus === "loading" ? "Saving..." : "Save Client"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-lg"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
