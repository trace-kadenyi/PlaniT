import { useState, useEffect } from "react";
export default function EditDeleteExpense({
  showCreateExpenseForm,
  setShowCreateExpenseForm,
  handleExpenseDelete,
  setExpenseToEdit,
  formRef,
  expense,
}) {
  const [scrollToForm, setScrollToForm] = useState(false);

  useEffect(() => {
    if (scrollToForm && showCreateExpenseForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setScrollToForm(false);
    }
  }, [scrollToForm, showCreateExpenseForm]);

  return (
    <div className="transform -translate-y-1/2 flex space-x-2 mt-4 flex justify-self-end">
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
        onClick={() => handleExpenseDelete(expense._id)}
      >
        Delete expense
      </button>
    </div>
  );
}
