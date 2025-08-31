import { ChevronLeft, ChevronRight } from "lucide-react";

export default function VendorPagination({
  paginate,
  currentPage,
  totalPages,
  indexOfFirstVendor,
  indexOfLastVendor,
  filteredVendors = [],
}) {
  // Protect against invalid values
  const safeIndexOfFirst = Math.max(0, indexOfFirstVendor);
  const safeIndexOfLast = Math.min(indexOfLastVendor, filteredVendors.length);
  const safeTotalItems = filteredVendors.length;

  return (
    <div className="px-6 py-3 flex items-center justify-between border-t border-[#E3CBC1] dark:border-gray-900 dark:bg-gray-900">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => paginate(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-4 py-2 border border-[#E3CBC1] text-sm font-medium rounded-md dark:border-gray-700 ${
            currentPage === 1
              ? "bg-gray-100 dark:bg-gray-500 text-gray-400 dark:bg-gray-500"
              : "bg-white dark:bg-gray-900 text-[#9B2C62] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`ml-3 relative inline-flex items-center px-4 py-2 border border-[#E3CBC1] dark:border-gray-700 text-sm font-medium rounded-md ${
            currentPage === totalPages
              ? "bg-gray-100 dark:bg-gray-500 text-gray-400"
              : "bg-white text-[#9B2C62] hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
          }`}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Showing <span className="font-medium">{safeIndexOfFirst + 1}</span>{" "}
            to <span className="font-medium">{safeIndexOfLast}</span> of{" "}
            <span className="font-medium">{safeTotalItems}</span> vendors
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-[#E3CBC1] bg-white text-sm font-medium dark:bg-gray-800 dark:border-gray-700 ${
                currentPage === 1
                  ? "text-gray-300 dark:text-gray-700 cursor-not-allowed"
                  : "text-[#9B2C62] hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === number
                      ? "z-10 bg-[#9B2C62] border-[#9B2C62] text-white"
                      : "bg-white border-[#E3CBC1] text-[#9B2C62] hover:bg-gray-100 dark:bg-gray-600/60 dark:text-white dark:border-gray-800 dark:hover:bg-gray-500/10"
                  }`}
                >
                  {number}
                </button>
              )
            )}

            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-[#E3CBC1] dark:border-gray-700 bg-white text-sm font-medium dark:bg-gray-800 ${
                currentPage === totalPages
                  ? "text-gray-300 dark:text-gray-700 cursor-not-allowed"
                  : "text-[#9B2C62] hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
