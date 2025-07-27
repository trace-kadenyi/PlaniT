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
      <div className="grid grid-cols-3 gap-4 text-center">
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
    <div className="flex justify-between">
      <div className="w-3/4">
        <h3 className="font-medium text-[#6B3B0F]">{expense.description}</h3>
        <p className="text-sm text-[#9B2C62]/70 capitalize">
          {expense.category}
          {expense.vendorName && ` • ${expense.vendorName}`}
        </p>
        {expense.dueDate && (
          <p className="text-xs text-gray-500 mt-1">
            Due: {new Date(expense.dueDate).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="text-right">
        <p className="font-bold text-[#6B3B0F]">${expense.amount.toFixed(2)}</p>
        <p
          className={`text-xs ${
            expense.paymentStatus === "paid"
              ? "text-green-600"
              : "text-[#F59E0B]"
          }`}
        >
          {expense.paymentStatus}
        </p>
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
