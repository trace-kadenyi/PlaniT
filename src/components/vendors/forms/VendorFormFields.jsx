export default function VendorFormFields({
  formData,
  onFieldChange,
  onSubmit,
  formStatus,
  formError,
  onCancel,
}) {
  const serviceOptions = [
    "venue",
    "catering",
    "decorations",
    "equipment",
    "staffing",
    "marketing",
    "other",
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
          Vendor Name <span className="text-red-500">*</span>
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

      {/* Service Type */}
      <div>
        <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
          Service Type <span className="text-red-500">*</span>
        </label>
        <select
          name="services"
          value={formData.services}
          onChange={onFieldChange}
          required
          className="w-full border border-[#E3CBC1] px-4 py-2 rounded-lg"
        >
          <option value="">Select a service type</option>
          {serviceOptions.map((service) => (
            <option key={service} value={service}>
              {service.charAt(0).toUpperCase() + service.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Contact Info */}
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

      {/* Website */}
      <div>
        <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
          Website
        </label>
        <input
          type="url"
          name="contact.website"
          value={formData.contact.website}
          onChange={onFieldChange}
          className="w-full border border-[#E3CBC1] px-4 py-2 rounded-lg"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
          Address
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
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
          maxLength={200}
          className="w-full border border-[#E3CBC1] px-4 py-2 rounded-lg"
        />
        <p className="text-xs text-gray-500">
          {formData.notes.length}/200 characters
        </p>
      </div>

      {/* Archive Toggle (for edit form) */}
      {formData.isArchived !== undefined && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isArchived"
            name="isArchived"
            checked={formData.isArchived}
            onChange={(e) =>
              onFieldChange({
                target: {
                  name: "isArchived",
                  value: e.target.checked,
                },
              })
            }
            className="mr-2"
          />
          <label htmlFor="isArchived" className="text-sm text-[#9B2C62]">
            Archived Vendor
          </label>
        </div>
      )}

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
          {formStatus === "loading" ? "Saving..." : "Save Vendor"}
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
