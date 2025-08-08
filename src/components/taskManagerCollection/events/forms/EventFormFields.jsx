import { Lock } from "lucide-react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

import {
  formatLocalDateTimeForDisplay,
  getLocalDateTimeString,
} from "../../utils/dateHelpers";
import { NotPreselected, PreselectedClients } from "./eventFormHelpers";

export default function EventFormFields({
  formData,
  onFieldChange,
  formStatus,
  formError,
  onCancel,
  onSubmit,
  budgetError,
  clients = [],
  vendors = [],
  clientsLoading = false,
  vendorsLoading = false,
  preSelectedClientId = null,
  mode = "create",
}) {
  // archived clients
  const isClientArchived = preSelectedClientId
    ? clients.find((c) => c._id === preSelectedClientId)?.isArchived
    : false;

  // archived vendors
  const getVendorStatus = (vendorId) => {
    const vendor = vendors.find((v) => v._id === vendorId);
    return vendor?.isArchived ? "archived" : "active";
  };

  // Style classes for consistency
  const disabledClasses =
    "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed";
  const enabledClasses = "border-[#E3CBC1] focus:ring-[#BE3455]";
  const fieldClasses = `w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-1`;

  // Only disable fields in create mode for archived clients
  const shouldDisable = mode === "create" && isClientArchived;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Client Selection (only show if not pre-selected) */}
      {!preSelectedClientId && (
        <NotPreselected
          formData={formData}
          onFieldChange={onFieldChange}
          clients={clients}
          clientsLoading={clientsLoading}
        />
      )}

      {/* Show client name if pre-selected */}
      {preSelectedClientId && (
        <PreselectedClients
          clients={clients}
          onFieldChange={onFieldChange}
          preSelectedClientId={preSelectedClientId}
        />
      )}

      {/* Vendor Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#6B2D5C] mb-1.5">
          Select Vendors
        </label>

        {/* loading state */}
        {vendorsLoading ? (
          <div className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#F9F3F0] to-[#F5E9E4] border border-[#E3CBC1] animate-pulse">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-[#E3CBC1] rounded-full animate-pulse"></div>
              <span className="text-[#9B2C62]/70">Loading vendors...</span>
            </div>
          </div>
        ) : (
          // search vendor
          <div className="relative">
            <Autocomplete
              options={vendors.filter((v) =>
                mode === "create" ? !v.isArchived : true
              )}
              getOptionLabel={(vendor) => vendor.name}
              value={
                vendorsLoading
                  ? []
                  : vendors.filter((v) =>
                      formData.vendors?.some((vendorId) => vendorId === v._id)
                    )
              }
              onChange={(_, newValue) => {
                onFieldChange({
                  target: {
                    name: "vendors",
                    value: newValue.map((v) => v._id),
                  },
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Search vendors..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0.5rem",
                      padding: "8px",
                      backgroundColor: "white",
                      borderColor: "#E3CBC1",
                      "&:hover": {
                        borderColor: "#D4A798",
                      },
                      "&.Mui-focused": {
                        borderColor: "#BE3455",
                        boxShadow: "0 0 0 2px rgba(190, 52, 85, 0.2)",
                      },
                    },
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option._id}
                    label={
                      <span className="flex items-center">
                        {option.name}
                        {option.isArchived && (
                          <span className="ml-1 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                            Archived
                          </span>
                        )}
                      </span>
                    }
                    onDelete={
                      option.isArchived
                        ? undefined
                        : () => {
                            const newVendors = [...formData.vendors].filter(
                              (id) => id !== option._id
                            );
                            onFieldChange({
                              target: {
                                name: "vendors",
                                value: newVendors,
                              },
                            });
                          }
                    }
                    sx={{
                      backgroundColor: option.isArchived
                        ? "#F3F4F6"
                        : "#F3E8FF",
                      color: option.isArchived ? "#6B7280" : "#6B2D5C",
                      marginRight: "4px",
                      "& .MuiChip-deleteIcon": {
                        color: option.isArchived ? "#9CA3AF" : "#9B2C62",
                        "&:hover": {
                          color: option.isArchived ? "#9CA3AF" : "#BE3455",
                        },
                      },
                    }}
                  />
                ))
              }
            />
            {formData.vendors?.some((vendorId) => {
              const vendor = vendors.find((v) => v._id === vendorId);
              return vendor?.isArchived;
            }) && (
              <p className="mt-2 text-sm text-yellow-600">
                Note: This event contains archived vendors. Archived vendors
                cannot be added to new events.
                {mode === "edit" && (
                  <span className="block mt-1 text-xs">
                    You can keep them for this event but consider replacing them
                    with active vendors.
                  </span>
                )}
              </p>
            )}
          </div>
        )}
      </div>

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
          disabled={shouldDisable}
          required
          className={`${fieldClasses} ${
            shouldDisable ? disabledClasses : enabledClasses
          }`}
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500">
            {shouldDisable && (
              <span className="flex items-center">
                <Lock className="w-3 h-3 mr-1" />
                Field locked
              </span>
            )}
          </p>
          <p className="text-xs text-gray-500">
            {formData.name.length}/70 characters
          </p>
        </div>
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
          disabled={shouldDisable}
          className={`${fieldClasses} ${
            shouldDisable ? disabledClasses : enabledClasses
          }`}
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
            disabled={shouldDisable}
            className={`${fieldClasses} ${
              shouldDisable ? disabledClasses : enabledClasses
            } appearance-none`}
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
            disabled={shouldDisable}
            className={`${fieldClasses} ${
              shouldDisable ? disabledClasses : enabledClasses
            }`}
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
            disabled={shouldDisable}
            className={`${fieldClasses} ${
              shouldDisable ? disabledClasses : enabledClasses
            }`}
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
          {["venue", "address", "city", "country"].map((field) => (
            <input
              key={field}
              type="text"
              name={`location.${field}`}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData.location?.[field] || ""}
              onChange={onFieldChange}
              disabled={shouldDisable}
              className={`${fieldClasses} ${
                shouldDisable ? disabledClasses : enabledClasses
              }`}
            />
          ))}
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
                disabled={shouldDisable}
                className={`block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-md p-4 font-semibold ${
                  budgetError
                    ? "border-red-500"
                    : shouldDisable
                    ? disabledClasses
                    : "border-gray-300"
                }`}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* budget notes */}
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
                disabled={shouldDisable}
                className={`block w-full rounded-md  shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 ${
                  shouldDisable ? disabledClasses : "border-gray-300"
                }`}
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
          disabled={formStatus === "loading" || shouldDisable}
          className={`bg-[#F59E0B] text-white font-semibold px-6 py-2 rounded-lg transition-all ${
            shouldDisable
              ? "bg-gray-300 cursor-not-allowed"
              : "hover:bg-[#d97706]"
          } ${formStatus === "loading" ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {shouldDisable ? (
            <span className="flex items-center justify-center gap-1">
              <Lock className="w-4 h-4" />
              Form Disabled
            </span>
          ) : formStatus === "loading" ? (
            "Saving..."
          ) : mode === "create" ? (
            "Add Event"
          ) : (
            "Save Changes"
          )}
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
