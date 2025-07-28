// get budget status
export function getBudgetStatus(budget, expenses) {
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const remainingBudget = budget.totalBudget - totalExpenses;

  return {
    totalBudget: budget.totalBudget,
    totalExpenses,
    remainingBudget,
    percentageUsed: (totalExpenses / budget.totalBudget) * 100,
    isOverBudget: remainingBudget < 0,
  };
}

// get expenses by category
export function getExpensesByCategory(expenses) {
  return expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {});
}

// handle budget status
export function BudgetStatus({ budgetStatus }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-[#F3EDE9] mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-[#FFF5EB] p-3 rounded-lg">
          <p className="text-sm text-[#6B3B0F]">Total Budget</p>
          <p className="text-xl font-bold text-[#9B2C62]">
            ${budgetStatus.totalBudget?.toFixed(2) || "0.00"}
          </p>
        </div>
        <div className="bg-[#FFF5EB] p-3 rounded-lg">
          <p className="text-sm text-[#6B3B0F]">Total Expenses</p>
          <p className="text-xl font-bold text-[#9B2C62]">
            ${budgetStatus.totalExpenses?.toFixed(2) || "0.00"}
          </p>
        </div>
        <div className="bg-[#FFF5EB] p-3 rounded-lg">
          <p className="text-sm text-[#6B3B0F]">Remaining</p>
          <p className="text-xl font-bold text-[#9B2C62]">
            $
            {(budgetStatus.totalBudget - budgetStatus.totalExpenses)?.toFixed(
              2
            ) || "0.00"}
          </p>
        </div>
      </div>
    </div>
  );
}

// handle expense list view
export function ExpenseListView({ expense }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {/* Left Column (3/5 width) */}
      <div className="col-span-3 space-y-1.5">
        <h3 className="font-medium text-[#6B3B0F] truncate">
          {expense.description || "No description provided"}
        </h3>

        <div className="flex items-center text-sm text-[#9B2C62]/80 gap-1.5">
          <span className="capitalize bg-[#F3EDE9] px-2 py-0.5 rounded-full">
            {expense.category || "uncategorized"}
          </span>
          {expense.vendorName && (
            <span className="truncate">
              <span className="text-gray-400">•</span> {expense.vendorName}
            </span>
          )}
        </div>

        {expense.notes ? (
          <p className="text-sm text-gray-600 line-clamp-2">
            <span className="text-gray-500">Note:</span> {expense.notes}
          </p>
        ) : (
          <p className="text-sm text-gray-600 line-clamp-2">
            No notes added for this expense.
          </p>
        )}
      </div>

      {/* Right Column (2/5 width) */}
      <div className="col-span-2 space-y-1.5 text-right">
        <p className="font-bold text-[#6B3B0F] text-lg">
          ${expense.amount?.toFixed(2) || "0.00"}
        </p>

        <div className="flex justify-end">
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              expense.paymentStatus === "paid"
                ? "bg-green-100 text-green-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {expense.paymentStatus || "pending"}
          </span>
        </div>

        <div className="text-xs text-gray-500">
          {expense.paymentStatus === "paid" ? (
            expense.paymentDate ? (
              <span>
                Paid on {new Date(expense.paymentDate).toLocaleDateString()}
              </span>
            ) : (
              <span className="text-gray-400">Payment date not recorded</span>
            )
          ) : expense.dueDate ? (
            <span>Due {new Date(expense.dueDate).toLocaleDateString()}</span>
          ) : (
            <span className="text-gray-400">No due date set</span>
          )}
        </div>

        {expense.receiptUrl !== null ? (
          <a
            href={expense.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-[#9B2C62] hover:underline mt-1"
          >
            View receipt ↗
          </a>
        ) : (
          <p>No receipt added</p>
        )}
      </div>
    </div>
  );
}

// handle by category view
export function ExpenseByCategoryView({ category, amount, budgetStatus }) {
  return (
    <div className="border-b border-[#F3EDE9] pb-4 last:border-b-0">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-[#6B3B0F] capitalize">{category}</h3>
        <div className="text-right">
          <p className="font-bold text-[#6B3B0F]">${amount.toFixed(2)}</p>
          <p className="text-xs text-[#9B2C62]/70">
            {budgetStatus?.totalExpenses > 0
              ? ((amount / budgetStatus.totalExpenses) * 100).toFixed(1)
              : "0"}
            % of expenses
          </p>
        </div>
      </div>
    </div>
  );
}

// handle budget status in forms
export function FormBudgetSummary({ budgetStatus }) {
  return (
    <div className="bg-[#F3EDE9] p-3 rounded-md mb-4">
      <div className="flex justify-between items-center">
        <span className="font-medium">Remaining Budget:</span>
        <span
          className={`font-bold ${
            budgetStatus.remainingBudget < 0 ? "text-red-600" : "text-[#9B2C62]"
          }`}
        >
          ${budgetStatus.remainingBudget.toFixed(2)}
        </span>
      </div>
      <div className="text-xs text-gray-600 mt-1">
        <span className="font-semibold">Total:</span> $
        {budgetStatus.totalBudget.toFixed(2)} •{" "}
        <span className="font-semibold">Spent:</span> $
        {budgetStatus.totalExpenses.toFixed(2)}
      </div>
    </div>
  );
}
