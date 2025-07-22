export default function TaskFormFields({
  form,
  onFieldChange,
  taskStatus,
  taskError,
  onClose,
  onSubmit,
  eventDate,
  mode = "create",
}) {
  // Calculate min/max dates
  const today = new Date().toISOString().split("T")[0];
  const maxDate = eventDate
    ? new Date(eventDate).toISOString().split("T")[0]
    : null;

  // Handle date change with validation
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    // Basic client-side validation
    if (maxDate && selectedDate > maxDate) {
      // You can show a toast or inline error here if needed
      console.warn("Selected date is after event date");
      return;
    }

    onFieldChange(e); // Proceed with normal change
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-[#FFF8F2] p-6 rounded-lg shadow-md space-y-4 border border-[#F3EDE9]"
    >
      <h2 className="text-xl font-bold text-[#9B2C62]">
        {mode === "create" ? "Create Task" : "Edit Task"}
      </h2>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          required
          maxLength={50}
          value={form.title}
          onChange={onFieldChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
        />
        <p className="text-xs text-right text-gray-500 mt-1">
          {form.title.length}/50 characters
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          rows={2}
          maxLength={150}
          value={form.description}
          onChange={onFieldChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
        />
        <p className="text-xs text-right text-gray-500 mt-1">
          {form.description.length}/150 characters
        </p>
      </div>

      {/* Assigned To */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Assigned To
        </label>
        <input
          type="text"
          name="assignedTo"
          value={form.assignedTo}
          onChange={onFieldChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
        />
      </div>

      {/* Deadline */}
      {/* Enhanced Deadline Field */}
      <div className="relative">
        <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
          Deadline <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleDateChange}
          min={today}
          max={maxDate}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
        />
        <div className="absolute right-3 top-12 transform -translate-y-1/2 pointer-events-none">
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
        {maxDate && (
          <p className="text-xs text-gray-500 mt-1">
            Must be before the event date:{" "}
            <span className="font-semibold">
              {new Date(maxDate).toLocaleDateString()}
            </span>{" "}
            and after the current date:{" "}
            <span className="font-semibold">
              {new Date().toLocaleDateString()}
            </span>
          </p>
        )}
      </div>

      {/* Priority & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            name="priority"
            value={form.priority}
            onChange={onFieldChange}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={onFieldChange}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>In Review</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {taskStatus === "failed" && (
        <div className="p-3 bg-red-50 rounded-md">
          <p className="text-red-500 text-sm mt-1">{taskError}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={taskStatus === "loading"}
          className="px-4 py-2 rounded-md bg-[#9B2C62] text-white hover:bg-[#801f4f] transition"
        >
          {taskStatus === "loading"
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
            ? "Create Task"
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
