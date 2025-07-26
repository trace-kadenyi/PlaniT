import { useState } from "react";
import { getExpensesByCategory } from "../utils/budgetHelpers";

export default function BudgetTab({ expenses, budgetStatus }) {
  const [activeView, setActiveView] = useState("list");

  const expensesByCategory = getExpensesByCategory(expenses);

  return (
    <>
      <h2 className="text-2xl font-bold text-[#9B2C62] mb-6">Expenses</h2>

      {expenses.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#F3EDE9]">
          <p className="text-gray-600">No expenses added</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#F3EDE9]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#6B3B0F]">
              Expense Summary
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

          {activeView === "list" ? (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="border-b border-[#F3EDE9] pb-4 last:border-b-0"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-[#6B3B0F]">
                        {expense.description}
                      </h3>
                      <p className="text-sm text-[#9B2C62]/70">
                        {expense.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#6B3B0F]">
                        ${expense.amount.toFixed(2)}
                      </p>
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
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <div
                  key={category}
                  className="border-b border-[#F3EDE9] pb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-[#6B3B0F] capitalize">
                      {category}
                    </h3>
                    <div className="text-right">
                      <p className="font-bold text-[#6B3B0F]">
                        ${amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-[#9B2C62]/70">
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
