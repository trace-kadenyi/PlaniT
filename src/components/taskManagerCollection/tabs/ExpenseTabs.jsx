export default function ExpenseTabs({ activeView, setActiveView }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-semibold text-[#6B3B0F]">
        {activeView === "list" ? "Expenses Summary" : "Expenses by Category"}
      </h2>
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveView("list")}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            activeView === "list"
              ? "bg-[#9B2C62] text-white"
              : "bg-[#FFF5EB] text-[#6B3B0F] hover:bg-[#F3EDE9]"
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setActiveView("categories")}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            activeView === "categories"
              ? "bg-[#9B2C62] text-white"
              : "bg-[#FFF5EB] text-[#6B3B0F] hover:bg-[#F3EDE9]"
          }`}
        >
          By Category
        </button>
      </div>
    </div>
  );
}
