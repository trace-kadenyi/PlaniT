import { useState } from "react";
import { useSelector } from "react-redux";

import { FormBudgetSummary } from "../../utils/budgetHelpers";
import { handleFileUpload, handleRemoveReceipt } from "../expenseHelpers";
import AutocompleteWithChips from "../../../shared/AutocompleteWithChips";
import { CustomCalendar } from "../../../ui/Calendar";
import { AddExpenseFormBtn } from "../../../buttons/ExpenseButtons";

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
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { items: vendors, status: vendorsStatus } = useSelector(
    (state) => state.vendors,
  );

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
      className="expense_form bg-[#FFF8F2] p-6 rounded-lg shadow-md space-y-4 border border-[#F3EDE9] dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 dark:border-gray-900"
    >
      {/* budget status */}
      {budgetStatus && <FormBudgetSummary budgetStatus={budgetStatus} />}
      <h2 className="text-xl font-bold text-[#9B2C62] dark:text-[#F59E0B]">
        {mode === "create" ? "Add Expense" : "Edit Expense"}
      </h2>
      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Amount ($){" "}
          <span className="text-red-500  dark:text-[#D97706]">*</span>
        </label>
        <input
          type="number"
          name="amount"
          required
          min="0"
          step="0.01"
          value={form.amount || ""}
          onChange={onFieldChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62] dark:border-gray-500 dark:focus:ring-[#D97706] dark:focus:border-none dark:text-gray-300"
        />
      </div>
      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description{" "}
          <span className="text-red-500 dark:text-[#D97706]">*</span>
        </label>
        <textarea
          name="description"
          rows={2}
          maxLength={150}
          value={form.description || ""}
          onChange={onFieldChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62] dark:border-gray-500 dark:focus:ring-[#D97706] dark:focus:border-none dark:text-gray-300"
        />
        <p className="text-xs text-right text-gray-500 dark:text-gray-400 mt-1">
          {form.description?.length || 0}/150 characters
        </p>
      </div>
      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category <span className="text-red-500 dark:text-[#D97706]">*</span>
        </label>
        <select
          name="category"
          required
          value={form.category || "other"}
          onChange={onFieldChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62] dark:border-gray-500 dark:focus:ring-[#D97706] dark:focus:border-none dark:text-gray-300 dark:bg-gray-900"
        >
          <option value="venue">Venue</option>
          <option value="catering">Catering</option>
          <option value="decorations">Decorations</option>
          <option value="equipment">Equipment</option>
          <option value="staffing">Staffing</option>
          <option value="entertainment">Entertainment</option>
          <option value="transportation">Transportation</option>
          <option value="marketing">Marketing</option>
          <option value="photography/videography">
            Photography/Videography
          </option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Vendor Selection */}
      <div>
        <AutocompleteWithChips
          label="Select Vendor"
          options={vendors}
          selectedValues={form.vendor ? [form.vendor] : []}
          onChange={(newVendorIds) => {
            onFieldChange({
              target: {
                name: "vendor",
                value: newVendorIds[0] || null,
              },
            });
          }}
          loading={vendorsStatus === "loading"}
          filterFn={(vendor) =>
            !vendor.isArchived &&
            (form.category === "other" ||
              vendor.services.includes(form.category))
          }
          getOptionLabel={(vendor) => `${vendor.name} (${vendor.services})`}
          singleSelect
        />
      </div>

      {/* Payment Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Payment Status
        </label>
        <select
          name="paymentStatus"
          value={form.paymentStatus || "pending"}
          onChange={handlePaymentStatusChange}
          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62] dark:border-gray-500 dark:focus:ring-[#D97706] dark:focus:border-none dark:text-gray-300 dark:bg-gray-900"
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </div>
      {/* Payment Date (shown when status is paid) */}
      {form.paymentStatus === "paid" && (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Payment Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="paymentDate"
            // required={form.paymentStatus === "paid"}
            value={form.paymentDate || ""}
            onChange={handleDateChange}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62] dark:border-gray-500 dark:focus:ring-[#D97706] dark:focus:border-none dark:text-gray-300"
          />
          <div className="absolute right-3 top-11 transform -translate-y-1/2 pointer-events-none">
            <CustomCalendar />
          </div>
        </div>
      )}
      {/* Due Date (shown when status is pending) */}
      {form.paymentStatus === "pending" && (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate || ""}
            onChange={handleDateChange}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62] dark:border-gray-500 dark:focus:ring-[#D97706] dark:focus:border-none dark:text-gray-300"
          />
          <div className="absolute right-3 top-11 transform -translate-y-1/2 pointer-events-none">
            <CustomCalendar />
          </div>
        </div>
      )}
      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Notes
        </label>
        <textarea
          name="notes"
          rows={2}
          maxLength={200}
          value={form.notes || ""}
          onChange={onFieldChange}
          className="mt-1 w-full border border-gray-2 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9B2C62] dark:border-gray-500 dark:focus:ring-[#D97706] dark:focus:border-none dark:text-gray-300"
        />
        <p className="text-xs text-right text-gray-500 dark:text-gray-400 mt-1">
          {form.notes?.length || 0}/200 characters
        </p>
      </div>
      {/* Receipt URL */}
      {form.paymentStatus === "paid" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Receipt Upload{" "}
            {form.receiptUrl && (
              <span className="inline-block ml-1 text-[#9B2C62] font-bold">
                ✓
              </span>
            )}
          </label>
          <div className="mt-1 gap-2">
            <label className="cursor-pointer">
              <span className="sr-only">Choose receipt file</span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                onChange={async (e) => {
                  await handleFileUpload(e, {
                    setUploading,
                    setUploadProgress,
                    onFieldChange,
                  });
                }}
                disabled={uploading}
                className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-[#9B2C62] file:text-white
          hover:file:bg-[#801f4f]"
              />
            </label>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic">
              Accepted formats: jpg, png, webp, pdf (max 2mb)
            </p>
            {uploading && (
              <div className="mt-2 space-y-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#9B2C62] h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 text-right">
                  {uploadProgress}% uploaded
                </p>
              </div>
            )}
          </div>
          {form.receiptUrl && (
            <div className="mt-2 flex items-center">
              <a
                href={form.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#9B2C62] hover:underline"
              >
                View Receipt
              </a>
              <button
                type="button"
                onClick={async (e) => {
                  await handleRemoveReceipt({
                    form,
                    onFieldChange,
                  });
                }}
                className="ml-2 text-xs font-semibold text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}
      {/* Error Message */}
      {expenseStatus === "failed" && (
        <div className="p-3 bg-red-50 dark:bg-red-200 rounded-md">
          <p className="text-red-500 dark:text-red-700 text-sm mt-1">
            {expenseError}
          </p>
        </div>
      )}

      {/* Buttons */}
      <AddExpenseFormBtn
        onClose={onClose}
        expenseStatus={expenseStatus}
        mode={mode}
      />
    </form>
  );
}
