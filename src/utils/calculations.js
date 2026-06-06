import { getMonthKey, getRecentMonths } from './date';
import { toNumber } from './currency';

export function sortTransactions(transactions) {
  return [...transactions].sort((left, right) => {
    const leftTime = new Date(left.date || left.created_at || 0).getTime();
    const rightTime = new Date(right.date || right.created_at || 0).getTime();
    return rightTime - leftTime;
  });
}

export function filterTransactions(transactions, filters = {}) {
  const search = filters.search?.trim().toLowerCase();

  return sortTransactions(transactions).filter((transaction) => {
    if (filters.month && getMonthKey(transaction.date) !== filters.month) return false;
    if (filters.type && transaction.type !== filters.type) return false;
    if (filters.category && transaction.category !== filters.category) return false;
    if (filters.wallet && transaction.wallet !== filters.wallet) return false;

    if (search) {
      const haystack = [
        transaction.category,
        transaction.wallet,
        transaction.note,
        transaction.amount,
        transaction.date,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(search);
    }

    return true;
  });
}

export function buildSummary(transactions, month, budgets = []) {
  const monthlyTransactions = filterTransactions(transactions, { month });
  const totalIncome = monthlyTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + toNumber(transaction.amount), 0);
  const totalExpense = monthlyTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + toNumber(transaction.amount), 0);
  const expenseByCategory = buildExpenseByCategory(monthlyTransactions);
  const budgetMap = new Map();
  budgets
    .filter((budget) => budget.month === month)
    .forEach((budget) => {
      budgetMap.set(budget.category, budget);
    });
  const monthBudgets = [...budgetMap.values()];

  return {
    month,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    expenseByCategory,
    recentTransactions: sortTransactions(monthlyTransactions).slice(0, 5),
    budgetProgress: monthBudgets.map((budget) => {
      const spent = toNumber(expenseByCategory[budget.category]);
      const limit = toNumber(budget.limit_amount);
      return {
        ...budget,
        spent,
        remaining: Math.max(limit - spent, 0),
        percent: limit > 0 ? Math.min((spent / limit) * 100, 100) : 0,
      };
    }),
  };
}

export function buildExpenseByCategory(transactions) {
  return transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((totals, transaction) => {
      const category = transaction.category || 'Lainnya';
      totals[category] = (totals[category] || 0) + toNumber(transaction.amount);
      return totals;
    }, {});
}

export function buildWalletBalances(transactions, wallets) {
  return wallets.map((wallet) => {
    const movement = transactions
      .filter((transaction) => transaction.wallet === wallet.name)
      .reduce((sum, transaction) => {
        const amount = toNumber(transaction.amount);
        return transaction.type === 'income' ? sum + amount : sum - amount;
      }, 0);

    return {
      ...wallet,
      balance: toNumber(wallet.initial_balance) + movement,
    };
  });
}

export function buildMonthlyTrend(transactions, count = 6) {
  return getRecentMonths(count).map((month) => {
    const summary = buildSummary(transactions, month);
    return {
      month,
      income: summary.totalIncome,
      expense: summary.totalExpense,
      balance: summary.balance,
    };
  });
}
