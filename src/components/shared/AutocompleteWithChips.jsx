import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

export default function AutocompleteWithChips({
  label,
  options,
  selectedValues = [],
  onChange,
  loading = false,
  loadingText = "Loading...",
  placeholder = "Search...",
  noOptionsText = "No options available",
  disabled = false,
  filterFn = (option) => true,
  getOptionLabel = (option) => {
    if (!option) return "";
    const name = option.name || "No name";
    const services = option.services || "No service";
    return `${name} (${services})`;
  },
  groupBy,
  renderOption,
  singleSelect = false,
}) {
  // Get the actual selected option objects
  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option._id)
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-[#9B2C62] mb-1">
          {label}
        </label>
      )}

      {loading ? (
        <div className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#F9F3F0] to-[#F5E9E4] border border-[#E3CBC1] animate-pulse">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-[#E3CBC1] rounded-full animate-pulse"></div>
            <span className="text-[#9B2C62]/70">{loadingText}</span>
          </div>
        </div>
      ) : (
        <div className="relative">
          <Autocomplete
            multiple={!singleSelect}
            options={options.filter(
              (option) =>
                filterFn(option) && !selectedValues.includes(option._id)
            )}
            getOptionLabel={getOptionLabel}
            groupBy={groupBy}
            renderOption={renderOption}
            value={singleSelect ? selectedOptions[0] || null : selectedOptions}
            onChange={(_, newValue) => {
              if (singleSelect) {
                onChange(newValue ? [newValue._id] : []);
              } else {
                onChange(newValue.map((v) => v._id));
              }
            }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            disabled={disabled}
            noOptionsText={noOptionsText}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={
                  options.filter(filterFn).length === 0
                    ? noOptionsText
                    : placeholder
                }
                sx={{
                  "&.event-form .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                  },
                
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0.5rem",
                    padding: "8px",
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
              value.map((option, index) => {
                const isArchived = option.isArchived;
                const { key, ...tagProps } = getTagProps({ index });

                return (
                  <Chip
                    key={key}
                    {...tagProps}
                    label={
                      <span className="flex items-center">
                        {getOptionLabel(option)}
                        {isArchived && (
                          <span className="ml-1 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                            Archived
                          </span>
                        )}
                      </span>
                    }
                    onDelete={isArchived ? undefined : tagProps.onDelete}
                    sx={{
                      backgroundColor: isArchived ? "#F3F4F6" : "#F3E8FF",
                      color: isArchived ? "#6B7280" : "#6B2D5C",
                      marginRight: "4px",
                      "& .MuiChip-deleteIcon": {
                        color: isArchived ? "#9CA3AF" : "#9B2C62",
                        "&:hover": {
                          color: isArchived ? "#9CA3AF" : "#BE3455",
                        },
                      },
                    }}
                  />
                );
              })
            }
          />
          {options.some(
            (option) => option.isArchived && selectedValues.includes(option._id)
          ) && (
            <p className="mt-2 text-sm text-yellow-600">
              Note: Contains archived items. Archived items cannot be added to
              new records.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
