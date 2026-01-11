export default function ExpenseTab({ activeView, setActiveView, expenses }) {
  return (
    <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4 sm:gap-3">
      <h2 className="text-md sm:text-lg font-semibold text-[#6B3B0F] dark:text-amber-400 text-center">
        {activeView === "list"
          ? `Expenses Summary (${expenses.length})`
          : "Expenses by Category"}
      </h2>
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveView("list")}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            activeView === "list"
              ? "bg-[#9B2C62] text-white dark:bg-[#D97706]"
              : "bg-[#FFF5EB] text-[#6B3B0F] hover:bg-[#F3EDE9] dark:bg-[#D97706]/50 dark:text-gray-300 dark:hover:bg-[#F59E0B]/90"
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setActiveView("categories")}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            activeView === "categories"
              ? "bg-[#9B2C62] text-white dark:bg-[#D97706] dark:hover:bg-[#F59E0B]/90"
              : "bg-[#FFF5EB] text-[#6B3B0F] hover:bg-[#F3EDE9] dark:bg-[#D97706]/50 dark:text-gray-300 dark:hover:bg-[#F59E0B]/90"
          }`}
        >
          By Category
        </button>
      </div>
    </div>
  );
}
