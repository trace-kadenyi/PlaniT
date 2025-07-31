export default function FilterBox({
  filters,
  setFilters,
  customDateRange,
  setCustomDateRange,
  filterConfig,
}) {
  return (
    <div className="bg-[#FFF9F5] border border-gray-200 rounded-lg p-4 max-w-5xl mx-auto shadow-xs">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-[#9B2C62]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder={filterConfig.searchPlaceholder}
          className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-[#9B2C62] focus:ring focus:ring-[#9B2C62] focus:ring-opacity-50 bg-white"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center">
        {/* Dynamic Filters */}
        {filterConfig.filters.map((filter) => {
          // Get the options - either static or from a function
          const options =
            typeof filter.options === "function"
              ? filter.options(filterConfig.dynamicData)
              : filter.options;

          return (
            <div key={filter.id} className="w-full sm:w-auto">
              <label htmlFor={`${filter.id}-filter`} className="sr-only">
                {filter.label}
              </label>
              <div className="relative">
                <select
                  id={`${filter.id}-filter`}
                  className="filter-dropdown block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 focus:border-[#9B2C62] focus:ring-1 focus:ring-[#9B2C62]"
                  value={filters[filter.id]}
                  onChange={(e) =>
                    setFilters({ ...filters, [filter.id]: e.target.value })
                  }
                >
                  {options.map((option, index) => {
                    const uniqueKey = `${filter.id}-${
                      option.value
                    }-${Date.now()}-${index}`;

                    return (
                      <option
                        key={uniqueKey}
                        value={option.value}
                        className={option.className || "py-1"}
                      >
                        {option.label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          );
        })}

        {/* Date Range Filter */}
        <div className="w-full sm:w-auto">
          <label htmlFor="date-filter" className="sr-only">
            {filterConfig.dateLabel}
          </label>
          <div className="relative">
            <select
              id="date-filter"
              className="filter-dropdown block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 focus:border-[#9B2C62] focus:ring-1 focus:ring-[#9B2C62]"
              value={filters.dateRange}
              onChange={(e) =>
                setFilters({ ...filters, dateRange: e.target.value })
              }
            >
              {Object.entries(filterConfig.dateFilters).map(
                ([value, label]) => (
                  <option
                    key={`date-${value}`} // Add prefix to make unique
                    value={value}
                    className="py-1"
                  >
                    {label}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {/* Custom Date Range Picker */}
        {filters.dateRange === "custom" && (
          <div className="w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2 rounded-md">
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) =>
                    setCustomDateRange({
                      ...customDateRange,
                      start: e.target.value,
                    })
                  }
                  className="rounded-md border-gray-300 shadow-sm p-1 text-sm"
                />
                <span className="text-gray-600 text-sm">to</span>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) =>
                    setCustomDateRange({
                      ...customDateRange,
                      end: e.target.value,
                    })
                  }
                  className="rounded-md border-gray-300 shadow-sm p-1 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Clear Filters Button */}
        <div className="w-full sm:w-auto">
          <button
            onClick={() => {
              setFilters(filterConfig.defaultFilters);
              setCustomDateRange({ start: "", end: "" });
            }}
            className="w-full sm:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#9B2C62] hover:bg-[#7a2250] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9B2C62] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Active Search Term Indicator */}
      {filters.search && (
        <div className="mt-3 text-sm text-[#9B2C62]">
          Showing results for:{" "}
          <span className="font-medium">"{filters.search}"</span>
        </div>
      )}
    </div>
  );
}
