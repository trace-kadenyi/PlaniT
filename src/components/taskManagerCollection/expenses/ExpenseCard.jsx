export default function ExpenseCard() {
  return (
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
              <p className="text-sm text-[#9B2C62]/70">{expense.category}</p>
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
  );
}

//  <div className="space-y-4">
//               {Object.entries(expensesByCategory).map(([category, amount]) => (
//                 <div
//                   key={category}
//                   className="border-b border-[#F3EDE9] pb-4 last:border-b-0"
//                 >
//                   <div className="flex justify-between items-center">
//                     <h3 className="font-medium text-[#6B3B0F] capitalize">
//                       {category}
//                     </h3>
//                     <div className="text-right">
//                       <p className="font-bold text-[#6B3B0F]">
//                         ${amount.toFixed(2)}
//                       </p>
//                       <p className="text-xs text-[#9B2C62]/70">
//                         {((amount / budgetStatus.totalExpenses) * 100).toFixed(
//                           1
//                         )}
//                         % of expenses
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
