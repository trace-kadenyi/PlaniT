export default function EditDeleteExpense({
  setShowCreateExpenseForm,
  handleExpenseDelete,
  setExpenseToEdit,
  expense,
  setScrollToForm,
  expenses,
}) {
  return (
    <div className="transform -translate-y-1/2 flex space-x-2 mt-4 flex justify-self-end sm:min-w-[212px]">
      <button
        className="flex items-center px-2 py-1 rounded-md transition-all duration-200 bg-[#9B2C62]/10 text-[#9B2C62] hover:bg-[#9B2C62] hover:text-white text-xs"
        onClick={() => {
          setExpenseToEdit(expense);
          setShowCreateExpenseForm(true);
          setScrollToForm(true);
        }}
      >
        Edit expense
      </button>
      <button
        className="flex items-center px-2 py-1 rounded-md transition-all duration-200 bg-[#BE3455]/10 text-[#BE3455] hover:bg-[#BE3455] hover:text-white text-xs"
        onClick={() => handleExpenseDelete(expense._id, expense.vendor?._id, expenses)}
      >
        Delete expense
      </button>
    </div>
  );
}
