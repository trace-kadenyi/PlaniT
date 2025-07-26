import ProgressBar from "../../ui/ProgressBar";

export default function BudgetOverview({ budgetStatus }) {
  if (!budgetStatus || budgetStatus.totalBudget === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
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
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Budget Overview
      </h2>

      <div className="space-y-4">
        {/* Budget Progress Bar */}
        <div>
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-gray-600">Budget Utilization</span>
            <span className="text-gray-800">{percentageUsed.toFixed(1)}%</span>
          </div>
          <ProgressBar
            value={percentageUsed}
            className={isBudgetWarning ? "bg-red-100" : "bg-blue-100"}
          />
        </div>

        {/* Budget Metrics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Budget</p>
            <p className="text-xl font-bold text-blue-800">
              ${totalBudget.toLocaleString()}
            </p>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg">
            <p className="text-sm text-amber-600 font-medium">Expenses</p>
            <p className="text-xl font-bold text-amber-800">
              ${totalExpenses.toLocaleString()}
            </p>
          </div>
          <div
            className={`p-3 rounded-lg ${
              isBudgetWarning ? "bg-red-50" : "bg-green-50"
            }`}
          >
            <p
              className={`text-sm font-medium ${
                isBudgetWarning ? "text-red-600" : "text-green-600"
              }`}
            >
              Remaining
            </p>
            <p
              className={`text-xl font-bold ${
                isBudgetWarning ? "text-red-800" : "text-green-800"
              }`}
            >
              ${remainingBudget.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Budget Warning (if applicable) */}
        {isBudgetWarning && (
          <div className="mt-4 p-3 bg-red-100 rounded-lg text-red-800 text-sm">
            ⚠️ Warning: Less than 10% of budget remaining
          </div>
        )}
      </div>
    </div>
  );
}
