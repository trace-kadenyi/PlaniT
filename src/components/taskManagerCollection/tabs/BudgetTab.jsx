import { useState } from "react";
import { getExpensesByCategory } from "../utils/budgetHelpers";

export default function BudgetTab({ expenses, budgetStatus }) {
  const [activeView, setActiveView] = useState("list");

  const expensesByCategory = getExpensesByCategory(expenses);

  return (
    <>
      {expenses.length === 0 ? (
        <div>
          <h2 className="text-xl font-bold text-[#9B2C62] mb-4">Expenses</h2>
          <p className="text-gray-600">No expenses added</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Budget Details
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveView("list")}
                className={`px-3 py-1 text-sm rounded-md ${
                  activeView === "list"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setActiveView("categories")}
                className={`px-3 py-1 text-sm rounded-md ${
                  activeView === "categories"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                By Category
              </button>
            </div>
          </div>

          {activeView === "list" ? (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="border-b pb-4 last:border-b-0"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{expense.description}</h3>
                      <p className="text-sm text-gray-500">
                        {expense.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${expense.amount.toFixed(2)}</p>
                      <p
                        className={`text-xs ${
                          expense.paymentStatus === "paid"
                            ? "text-green-600"
                            : "text-amber-600"
                        }`}
                      >
                        {expense.paymentStatus}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <div key={category} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium capitalize">{category}</h3>
                    <div className="text-right">
                      <p className="font-bold">${amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        {((amount / budgetStatus.totalExpenses) * 100).toFixed(
                          1
                        )}
                        % of expenses
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
