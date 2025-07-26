// get budget status
export const getBudgetStatus = (budget, expenses) => {
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
};

// get expenses by category
export const getExpensesByCategory = (expenses) => {
  return expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {});
};
