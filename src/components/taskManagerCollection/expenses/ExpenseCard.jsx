import { Link } from "react-router-dom";

import { formatDateTimeShort } from "../utils/formatting";
import { CreatedUpdatedData } from "../../shared/Snippets";

// SHAREABLE functions
// description
// function Desc({ expense }) {
//   return (
//     <h3 className="font-medium text-[#6B3B0F] dark:text-gray-300 mb-2">
//       {expense.description || "No description provided"}
//     </h3>
//   );
// }

function Desc({ expense }) {
  return (
    <h3
      className={`font-medium text-[#6B3B0F] dark:text-gray-300 mb-2 ${
        expense.isVoided ? "line-through opacity-70" : ""
      }`}
    >
      {expense.description || "No description provided"}
      {expense.isVoided && (
        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
          VOIDED
        </span>
      )}
    </h3>
  );
}

// category
// function Cat({ expense }) {
//   return (
//     <span className="capitalize bg-[#F3EDE9] dark:bg-[#F8D476]/20 dark:text-[#F59E0B]/90 px-2 py-0.5 rounded-full">
//       {expense.category || "uncategorized"}
//     </span>
//   );
// }

function Cat({ expense }) {
  return (
    <span
      className={`capitalize px-2 py-0.5 rounded-full ${
        expense.isVoided
          ? "bg-gray-200 dark:bg-gray-700 text-gray-500"
          : "bg-[#F3EDE9] dark:bg-[#F8D476]/20 dark:text-[#F59E0B]/90"
      }`}
    >
      {expense.category || "uncategorized"}
    </span>
  );
}

// vendor
// function Vend({ expense }) {
//   // null check for vendor
//   if (!expense.vendor || typeof expense.vendor === "string") {
//     return (
//       <div className="bg-gray-100/30 border border-gray-300/50 rounded-lg px-2 py-0.5 text-sm">
//         <span className="text-gray-500 dark:text-gray-400">
//           Vendor not specified
//         </span>
//       </div>
//     );
//   }

function Vend({ expense }) {
  // null check for vendor
  if (!expense.vendor || typeof expense.vendor === "string") {
    return (
      <div className="bg-gray-100/30 border border-gray-300/50 rounded-lg px-2 py-0.5 text-sm">
        <span className="text-gray-500 dark:text-gray-400">
          Vendor not specified
        </span>
      </div>
    );
  }

  return (
    <div
      className={`border rounded-lg px-2 py-0.5 text-sm flex items-center ${
        expense.isVoided
          ? "border-gray-300 bg-gray-100"
          : "border-[#F59E0B]/50 bg-[#F8D476]/30 dark:bg-[#F8D476]/20"
      }`}
    >
      <Link
        to={`/vendors/${expense.vendor._id}`}
        className={`font-medium hover:italic cursor-default ${
          expense.isVoided
            ? "text-gray-500 dark:text-gray-400"
            : "text-[#6B3C0F] dark:text-[#D97706]"
        }`}
      >
        {expense.vendor.name}
        {expense.vendor.services && (
          <span
            className={`ml-1 ${
              expense.isVoided
                ? "text-gray-400"
                : "text-[#9B2C62]/80 dark:text-[#F59E0B]/90"
            }`}
          >
            - {expense.vendor.services}
          </span>
        )}
        {expense.vendor.isArchived && (
          <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
            {" "}
            (Archived)
          </span>
        )}
      </Link>
    </div>
  );
}

// void info
function VoidInfo({ expense }) {
  if (!expense.isVoided) return null;
  
  return (
    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            This expense has been voided
          </p>
          {expense.voidReason && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span className="font-medium">Reason:</span> {expense.voidReason}
            </p>
          )}
          {expense.voidedBy && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Voided by {expense.voidedBy.firstName} {expense.voidedBy.lastName} on {new Date(expense.voidedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// handle expense list view
// export function ExpenseListView({ expense, children }) {
//   return (
//     <>
//       {/* MOBILE VIEW */}
//       <div className="sm:hidden">
//         {/* description */}
//         <Desc expense={expense} />
//         {/* category & vendor */}
//         <div className="flex items-center text-sm text-[#9B2C62]/80 gap-1.5">
//           {!expense.vendor && <Cat expense={expense} />}
//           {expense.vendor && <Vend expense={expense} />}
//         </div>
//       </div>

//       <div className="flex flex-col-reverse sm:flex-row justify-between gap-4">
//         {/* Left Section */}
//         <div className="flex-1 space-y-2">
//           {/* DESKTOP VIEW */}
//           <div className="hidden sm:block">
//             {/* description */}
//             <Desc expense={expense} />
//             {/* category & vendor */}
//             <div className="flex items-center text-sm text-[#9B2C62]/80 gap-1.5">
//               {!expense.vendor && <Cat expense={expense} />}
//               {expense.vendor && <Vend expense={expense} />}
//             </div>
//           </div>
//           {/* SHARED VIEW */}
//           {expense.notes ? (
//             <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 w-full md:pr-10">
//               <span className="text-gray-500 dark:text-gray-400 font-semibold">
//                 Note:
//               </span>{" "}
//               {expense.notes}
//             </p>
//           ) : (
//             <p className="text-xs text-gray-400 italic mt-1">No notes</p>
//           )}

//           {/* Receipt Link */}
//           {expense.receiptUrl ? (
//             <a
//               href={expense.receiptUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-sm text-[#9B2C62] dark:text-[#F59E0B] hover:underline mt-1 inline-block"
//             >
//               View receipt ↗
//             </a>
//           ) : (
//             <p className="text-sm text-gray-400 italic mt-1">No receipt</p>
//           )}

//           {/* created on/by details */}
//           <CreatedUpdatedData
//             item={expense}
//             formatDateTimeShort={formatDateTimeShort}
//           />
//         </div>

//         {/* Right Section */}
//         <div className="flex flex-col items-start sm:items-end gap-1 min-w-[140px] sm:min-w-[120px] mt-4 sm:mt-0">
//           <p className="text-lg font-bold text-[#6B3B0F] dark:text-gray-300">
//             ${expense.amount?.toFixed(2) || "0.00"}
//           </p>
//           <div className="my-2 sm:my-1 flex items-center sm:flex-col items-end gap-2">
//             <span
//               className={`px-2 py-0.5 rounded-full text-xs font-medium ${
//                 expense.paymentStatus === "paid"
//                   ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
//                   : "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100"
//               }`}
//             >
//               {expense.paymentStatus || "pending"}
//             </span>

//             <p className="text-xs text-gray-500 dark:text-gray-400 text-left sm:text-right">
//               {expense.paymentStatus === "paid" ? (
//                 expense.paymentDate ? (
//                   <>
//                     Paid on {new Date(expense.paymentDate).toLocaleDateString()}
//                   </>
//                 ) : (
//                   <>Payment date not recorded</>
//                 )
//               ) : expense.dueDate ? (
//                 <>Due {new Date(expense.dueDate).toLocaleDateString()}</>
//               ) : (
//                 <>No due date set</>
//               )}
//             </p>
//           </div>
//           <div className="mt-2">{children}</div>
//         </div>
//       </div>
//     </>
//   );
// }
export function ExpenseListView({ expense, children, showVoided = false }) {
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
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 w-full md:pr-10">
              <span className="text-gray-500 dark:text-gray-400 font-semibold">
                Note:
              </span>{" "}
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
              className="text-sm text-[#9B2C62] dark:text-[#F59E0B] hover:underline mt-1 inline-block"
            >
              View receipt ↗
            </a>
          ) : (
            <p className="text-sm text-gray-400 italic mt-1">No receipt</p>
          )}

          {/* Void info */}
          {expense.isVoided && <VoidInfo expense={expense} />}

          {/* created on/by details */}
          <CreatedUpdatedData
            item={expense}
            formatDateTimeShort={formatDateTimeShort}
          />
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-start sm:items-end gap-1 min-w-[140px] sm:min-w-[120px] mt-4 sm:mt-0">
          <p className={`text-lg font-bold ${expense.isVoided ? 'text-gray-500 line-through' : 'text-[#6B3B0F] dark:text-gray-300'}`}>
            ${expense.amount?.toFixed(2) || "0.00"}
          </p>
          <div className="my-2 sm:my-1 flex items-center sm:flex-col items-end gap-2">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${expense.isVoided ? 'bg-gray-200 text-gray-700' : expense.paymentStatus === "paid"
                  ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100"
                }`}
            >
              {expense.paymentStatus || "pending"}
            </span>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-left sm:text-right">
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
    <div className="border-b border-[#F3EDE9] dark:border-gray-700 pb-4 last:border-b-0">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-[#6B3B0F] dark:text-gray-300 capitalize">
          {category}
        </h3>
        <div className="text-right">
          <p className="font-bold text-[#6B3B0F] dark:text-gray-300">
            ${amount.toFixed(2)}
          </p>
          <p className="text-xs text-[#9B2C62]/70 dark:text-[#F59E0B]">
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
