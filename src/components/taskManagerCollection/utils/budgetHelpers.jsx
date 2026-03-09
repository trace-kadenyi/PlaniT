import { Link } from "react-router-dom";

// get budget status
export function getBudgetStatus(budget, expenses) {
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
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
export function BudgetStatus({ budgetStatus, paidExpensesCount = 0 }) {
  const {
    totalBudget = 0,
    totalExpenses = 0,
    remainingBudget = 0,
  } = budgetStatus ?? {};

  const showPaidDeletionNotice = paidExpensesCount > 0;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-[#F3EDE9] dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 dark:border-gray-900 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        {/* Total Budget */}
        <div className="bg-[#FFF5EB] p-3 rounded-lg dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)]">
          {" "}
          <p className="text-sm text-[#6B3B0F] dark:text-[#D97706]/90">
            Total Budget
          </p>
          <p className="text-xl font-bold text-[#9B2C62] dark:text-[#F59E0B]">
            ${totalBudget.toFixed(2)}
          </p>
        </div>

        {/* Total Expenses */}
        <div className="bg-[#FFF5EB] p-3 rounded-lg dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)]">
          {" "}
          <p className="text-sm text-[#6B3B0F] dark:text-[#D97706]/90">
            Total Expenses
          </p>
          <p className="text-xl font-bold text-[#9B2C62] dark:text-[#F59E0B]">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>

        {/* Remaining */}
        <div className="bg-[#FFF5EB] p-3 rounded-lg dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)]">
          {" "}
          <p className="text-sm text-[#6B3B0F] dark:text-[#D97706]/90">
            Remaining
          </p>
          <p className="text-xl font-bold text-[#9B2C62] dark:text-[#F59E0B]">
            ${remainingBudget.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Explanation */}
      {showPaidDeletionNotice && (
        <p className="mt-3 text-xs text-gray-600 dark:text-gray-400 italic">
          Note: {paidExpensesCount} paid expense
          {paidExpensesCount > 1 ? "s were" : " was"} deleted. Paid expenses do
          not restore remaining budget, which may cause totals to appear
          different.
        </p>
      )}
    </div>
  );
}

// shareables
function Desc({ expense }) {
  return (
    <h3 className="font-medium text-[#6B3B0F] mb-2">
      {expense.description || "No description provided"}
    </h3>
  );
}

function Cat({ expense }) {
  return (
    <span className="capitalize bg-[#F3EDE9] px-2 py-0.5 rounded-full">
      {expense.category || "uncategorized"}
    </span>
  );
}

function Vend({ expense }) {
  return (
    <div className="bg-[#F8D476]/30 border border-[#F59E0B]/50 rounded-lg px-2 py-0.5 text-sm flex items-center">
      <Link
        to={`/vendors/${expense.vendor._id}`}
        className="font-medium text-[#6B3C0F] hover:underline"
      >
        {expense.vendor.name}
      </Link>
      {expense.vendor.services && (
        <span className="text-[#9B2C62]/80 ml-1">
          - {expense.vendor.services}
        </span>
      )}
    </div>
  );
}

// handle expense list view
export function ExpenseListView({ expense, children }) {
  return (
    <>
      {/* MOBILE VIEW */}
      <div className="sm:hidden">
        {/* description */}
        <Desc expense={expense} />
        {/* category & vendor */}
        <div className="flex items-center text-sm text-[#9B2C62]/80 gap-1.5">
          {!expense.vendor && <Cat expense={expense} />}
          {expense.vendor && <Vend expense={expense} />}
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-between gap-4">
        {/* Left Section */}
        <div className="flex-1 space-y-2">
          {/* DESKTOP VIEW */}
          <div className="hidden sm:block">
            {/* description */}
            <Desc expense={expense} />
            {/* category & vendor */}
            <div className="flex items-center text-sm text-[#9B2C62]/80 gap-1.5">
              {!expense.vendor && <Cat expense={expense} />}
              {expense.vendor && <Vend expense={expense} />}
            </div>
          </div>
          {/* SHARED VIEW */}
          {expense.notes ? (
            <p className="text-xs text-gray-600 mt-1 w-full md:pr-10">
              <span className="text-gray-500 font-semibold">Note:</span>{" "}
              {expense.notes}
            </p>
          ) : (
            <p className="text-xs text-gray-400 italic mt-1">No notes</p>
          )}

          {/* Receipt Link */}
          {expense.receiptUrl ? (
            <a
              href={expense.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#9B2C62] hover:underline mt-1 inline-block"
            >
              View receipt ↗
            </a>
          ) : (
            <p className="text-xs text-gray-400 italic mt-1">No receipt</p>
          )}
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-start sm:items-end gap-1 min-w-[140px] sm:min-w-[120px] mt-4 sm:mt-0">
          <p className="text-lg font-bold text-[#6B3B0F]">
            ${expense.amount?.toFixed(2) || "0.00"}
          </p>
          <div className="my-2 sm:my-1 flex items-center sm:flex-col items-end gap-2">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                expense.paymentStatus === "paid"
                  ? "bg-green-100 text-green-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {expense.paymentStatus || "pending"}
            </span>

            <p className="text-xs text-gray-500 text-left sm:text-right">
              {expense.paymentStatus === "paid" ? (
                expense.paymentDate ? (
                  <>
                    Paid on {new Date(expense.paymentDate).toLocaleDateString()}
                  </>
                ) : (
                  <>Payment date not recorded</>
                )
              ) : expense.dueDate ? (
                <>Due {new Date(expense.dueDate).toLocaleDateString()}</>
              ) : (
                <>No due date set</>
              )}
            </p>
          </div>
          <div className="mt-2">{children}</div>
        </div>
      </div>
    </>
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
    <div className="bg-[#F3EDE9] p-3 rounded-md mb-4 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-gray-800 dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)] dark:border-l-[#F59E0B]">
      <div className="flex justify-between items-center dark:text-gray-300">
        <span className="font-medium">Remaining Budget:</span>
        <span
          className={`font-bold ${
            budgetStatus.remainingBudget === 0 ||
            budgetStatus.remainingBudget < 0
              ? "text-red-600"
              : "text-[#9B2C62] dark:text-[#F59E0B]"
          }`}
        >
          ${budgetStatus.remainingBudget.toFixed(2)}
        </span>
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
        <span className="font-semibold">Total:</span> $
        {budgetStatus.totalBudget.toFixed(2)} •{" "}
        <span className="font-semibold">Spent:</span> $
        {budgetStatus.totalExpenses.toFixed(2)}
      </div>
    </div>
  );
}
