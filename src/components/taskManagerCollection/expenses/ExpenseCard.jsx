import { Link } from "react-router-dom";

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
  // null check for vendor
  if (!expense.vendor || typeof expense.vendor === "string") {
    return (
      <div className="bg-gray-100/30 border border-gray-300/50 rounded-lg px-2 py-0.5 text-sm">
        <span className="text-gray-500">Vendor not specified</span>
      </div>
    );
  }

  return (
    <div className="bg-[#F8D476]/30 border border-[#F59E0B]/50 rounded-lg px-2 py-0.5 text-sm flex items-center">
      <Link
        to={`/vendors/${expense.vendor._id}`}
        className="font-medium text-[#6B3C0F] hover:italic cursor-default"
      >
        {expense.vendor.name}

        {expense.vendor.services && (
          <span className="text-[#9B2C62]/80 ml-1">
            - {expense.vendor.services}
          </span>
        )}
      </Link>
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
            <p className="text-sm text-gray-400 italic mt-1">No receipt</p>
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
