export default function TabsBtns({ activeTab, setActiveTab }) {
  return (
    <div className="flex border-b border-gray-200 mb-6 space-x-6">
      <button
        onClick={() => setActiveTab("tasks")}
        className={`pb-2 border-b-2 transition-all ${
          activeTab === "tasks"
            ? "border-[#9B2C62] text-[#9B2C62] font-semibold"
            : "border-transparent text-gray-500 hover:text-[#9B2C62]"
        }`}
      >
        Tasks
      </button>
      <button
        onClick={() => setActiveTab("budget")}
        className={`pb-2 border-b-2 transition-all ${
          activeTab === "budget"
            ? "border-[#F59E0B] text-[#F59E0B] font-semibold"
            : "border-transparent text-gray-500 hover:text-[#F59E0B]"
        }`}
      >
        Budget
      </button>
    </div>
  );
}
