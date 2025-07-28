import { FormBudgetSummary } from "../../utils/budgetHelpers";
export default function ExpenseFormFields({
  form,
  onFieldChange,
  expenseStatus,
  expenseError,
  onClose,
  onSubmit,
  budgetStatus,
  mode = "create",
}) {
  // Handle date changes
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    onFieldChange({ target: { name, value: value || undefined } }); // Send undefined if empty
  };

  // Handle payment status change
  const handlePaymentStatusChange = (e) => {
    const { value } = e.target;
    onFieldChange(e); // Update payment status

    // Clear payment date when switching to pending
    if (value === "pending") {
      onFieldChange({ target: { name: "paymentDate", value: undefined } });
    }
    // Clear due date when switching to paid
    else if (value === "paid") {
      onFieldChange({ target: { name: "dueDate", value: undefined } });
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-[#FFF8F2] p-6 rounded-lg shadow-md space-y-4 border border-[#F3EDE9]"
    >
      {/* budget status */}
      {budgetStatus && <FormBudgetSummary budgetStatus={budgetStatus} />}

      <h2 className="text-xl font-bold text-[#9B2C62]">
        {mode === "create" ? "Add Expense" : "Edit Expense"}
      </h2>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Amount ($) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="amount"
          required
          min="0"
          step="0.01"
          value={form.amount || ""}
          onChange={onFieldChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          rows={2}
          maxLength={150}
          value={form.description || ""}
          onChange={onFieldChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
        />
        <p className="text-xs text-right text-gray-500 mt-1">
          {form.description?.length || 0}/150 characters
        </p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          required
          value={form.category || "other"}
          onChange={onFieldChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
        >
          <option value="venue">Venue</option>
          <option value="catering">Catering</option>
          <option value="decorations">Decorations</option>
          <option value="equipment">Equipment</option>
          <option value="staffing">Staffing</option>
          <option value="marketing">Marketing</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Vendor Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Vendor Name
        </label>
        <input
          type="text"
          name="vendorName"
          value={form.vendorName || ""}
          onChange={onFieldChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
        />
      </div>

      {/* Payment Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Payment Status
        </label>
        <select
          name="paymentStatus"
          value={form.paymentStatus || "pending"}
          onChange={handlePaymentStatusChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Payment Date (shown when status is paid) */}
      {form.paymentStatus === "paid" && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="paymentDate"
            required={form.paymentStatus === "paid"}
            value={form.paymentDate || ""}
            onChange={handleDateChange}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
          />
        </div>
      )}

      {/* Due Date (shown when status is pending) */}
      {form.paymentStatus === "pending" && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate || ""}
            onChange={handleDateChange}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
          />
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          name="notes"
          rows={2}
          maxLength={200}
          value={form.notes || ""}
          onChange={onFieldChange}
          className="mt-1 w-full border border-gray-2 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
        />
        <p className="text-xs text-right text-gray-500 mt-1">
          {form.notes?.length || 0}/200 characters
        </p>
      </div>

      {/* Receipt URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Receipt URL
        </label>
        <input
          type="url"
          name="receiptUrl"
          placeholder="https://example.com/receipt.jpg"
          value={form.receiptUrl || ""}
          onChange={onFieldChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62]"
        />
      </div>

      {/* Error Message */}
      {expenseStatus === "failed" && (
        <div className="p-3 bg-red-50 rounded-md">
          <p className="text-red-500 text-sm mt-1">{expenseError}</p>
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
          disabled={expenseStatus === "loading"}
          className="px-4 py-2 rounded-md bg-[#9B2C62] text-white hover:bg-[#801f4f] transition"
        >
          {expenseStatus === "loading"
            ? mode === "create"
              ? "Adding..."
              : "Saving..."
            : mode === "create"
            ? "Add Expense"
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
