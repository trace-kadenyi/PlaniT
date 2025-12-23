import { AddClientFormBtn } from "../../buttons/ClientButtons";

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
        <label className="block text-sm font-semibold text-[#9B2C62] dark:text-[#D97706] mb-1">
          Client Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onFieldChange}
          required
          className="w-full border border-[#E3CBC1] dark:border-[#D97706]/40 dark:focus:outline-none dark:text-gray-300 px-4 py-2 rounded-lg"
        />
      </div>

      {/* Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#9B2C62] dark:text-[#D97706] mb-1">
            Email
          </label>
          <input
            type="email"
            name="contact.email"
            value={formData.contact.email}
            onChange={onFieldChange}
            className="w-full border border-[#E3CBC1] dark:border-[#D97706]/40 dark:focus:outline-none dark:text-gray-300 px-4 py-2 rounded-lg"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-[#9B2C62] dark:text-[#D97706] mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="contact.phone"
            value={formData.contact.phone}
            onChange={onFieldChange}
            className="w-full border border-[#E3CBC1] dark:border-[#D97706]/40 dark:focus:outline-none dark:text-gray-300 px-4 py-2 rounded-lg"
          />
        </div>
      </div>

      {/* Company */}
      <div>
        <label className="block text-sm font-semibold text-[#9B2C62] dark:text-[#D97706] mb-1">
          Company
        </label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={onFieldChange}
          className="w-full border border-[#E3CBC1] dark:border-[#D97706]/40 dark:focus:outline-none dark:text-gray-300 px-4 py-2 rounded-lg"
        />
      </div>

      {/* Preferences */}
      <div>
        <label className="block text-sm font-semibold text-[#9B2C62] dark:text-[#D97706] mb-1">
          Preferences
        </label>
        <input
          type="text"
          name="preferences"
          value={formData.preferences}
          onChange={onFieldChange}
          maxLength={150}
          className="w-full border border-[#E3CBC1] dark:border-[#D97706]/40 dark:focus:outline-none dark:text-gray-300 px-4 py-2 rounded-lg"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formData.preferences.length}/150 characters
        </p>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-semibold text-[#9B2C62] dark:text-[#D97706] mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={onFieldChange}
          maxLength={200}
          rows={4}
          className="w-full border border-[#E3CBC1] dark:border-[#D97706]/40 dark:focus:outline-none dark:text-gray-300 px-4 py-2 rounded-lg"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formData.notes.length}/200 characters
        </p>
      </div>

      {/* Error Message */}
      {formStatus === "failed" && (
        <div className="p-3 bg-red-50 dark:bg-red-200 rounded-md text-red-600">
          {formError}
        </div>
      )}

      {/* Submit Buttons */}
      <AddClientFormBtn formStatus={formStatus} onCancel={onCancel} />
    </form>
  );
}
