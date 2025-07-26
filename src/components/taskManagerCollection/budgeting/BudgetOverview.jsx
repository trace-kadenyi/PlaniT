import ProgressBar from "../../ui/ProgressBar";

export default function BudgetOverview({ budgetStatus }) {
  if (!budgetStatus || budgetStatus.totalBudget === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#F3EDE9] mb-6">
        <h2 className="text-lg font-semibold text-[#9B2C62] mb-4">
          Budget Overview
        </h2>
        <p className="text-gray-600">No budget set for this event</p>
      </div>
    );
  }

  const { totalBudget, totalExpenses, remainingBudget } = budgetStatus;
  const percentageUsed = (totalExpenses / totalBudget) * 100;
  const isBudgetWarning = remainingBudget < totalBudget * 0.1;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#F3EDE9] mb-6">
      <h2 className="text-lg font-semibold text-[#9B2C62] mb-4">
        Budget Overview
      </h2>

      <div className="space-y-4">
        {/* Budget Progress Bar */}
        <div>
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-[#6B3B0F]">Budget Utilization</span>
            <span className="text-[#9B2C62] font-bold">
              {percentageUsed.toFixed(1)}%
            </span>
          </div>
          <ProgressBar
            value={percentageUsed}
            className={isBudgetWarning ? "bg-[#FFF5EB]" : "bg-[#FFF5EB]"}
          />
        </div>

        {/* Budget Metrics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-[#FFF5EB] p-3 rounded-lg border border-[#F3EDE9]">
            <p className="text-sm text-[#6B3B0F] font-medium">Total Budget</p>
            <p className="text-xl font-bold text-[#9B2C62]">
              ${totalBudget.toLocaleString()}
            </p>
          </div>
          <div className="bg-[#FFF5EB] p-3 rounded-lg border border-[#F3EDE9]">
            <p className="text-sm text-[#6B3B0F] font-medium">Expenses</p>
            <p className="text-xl font-bold text-[#9B2C62]">
              ${totalExpenses.toLocaleString()}
            </p>
          </div>
          <div
            className={`p-3 rounded-lg border ${
              isBudgetWarning
                ? "bg-[#FFF5EB] border-[#F59E0B]"
                : "bg-[#FFF5EB] border-[#F3EDE9]"
            }`}
          >
            <p
              className={`text-sm font-medium ${
                isBudgetWarning ? "text-[#6B3B0F]" : "text-[#6B3B0F]"
              }`}
            >
              Remaining
            </p>
            <p
              className={`text-xl font-bold ${
                isBudgetWarning ? "text-[#9B2C62]" : "text-[#9B2C62]"
              }`}
            >
              ${remainingBudget.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Budget Warning (if applicable) */}
        {isBudgetWarning && (
          <div className="mt-4 p-3 bg-[#FFF5EB] rounded-lg text-[#6B3B0F] text-sm border border-[#F59E0B]">
            ⚠️ Warning: Less than 10% of budget remaining
          </div>
        )}
      </div>
    </div>
  );
}
