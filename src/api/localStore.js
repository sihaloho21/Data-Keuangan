import { createDefaultState } from './defaultData';
import { filterTransactions, sortTransactions } from '../utils/calculations';

const STORAGE_KEY = 'data-keuangan-state-v1';

function createId(prefix) {
  const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `${prefix}-${stamp}-${random}`;
}

function readState() {
  const fallback = createDefaultState();
  const saved = window.localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    writeState(fallback);
    return fallback;
  }

  try {
    const parsed = JSON.parse(saved);
    return {
      ...fallback,
      ...parsed,
      settings: { ...fallback.settings, ...parsed.settings },
      categories: parsed.categories?.length ? parsed.categories : fallback.categories,
      wallets: parsed.wallets?.length ? parsed.wallets : fallback.wallets,
      budgets: parsed.budgets || [],
      transactions: parsed.transactions || [],
      goals: parsed.goals || [],
    };
  } catch {
    writeState(fallback);
    return fallback;
  }
}

function writeState(state) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function response(data, message = 'OK') {
  return Promise.resolve({ success: true, message, data });
}

export const localApi = {
  async getTransactions(params = {}) {
    const state = readState();
    return response(filterTransactions(state.transactions, params), 'Transactions loaded');
  },

  async getAllTransactions() {
    const state = readState();
    return response(sortTransactions(state.transactions), 'Transactions loaded');
  },

  async addTransaction(data) {
    const state = readState();
    const now = new Date().toISOString();
    const transaction = {
      id: createId('TRX'),
      date: data.date,
      type: data.type,
      category: data.category,
      amount: Number(data.amount),
      wallet: data.wallet,
      note: data.note || '',
      created_at: now,
      updated_at: now,
    };

    const nextState = {
      ...state,
      transactions: [transaction, ...state.transactions],
    };
    writeState(nextState);
    return response(transaction, 'Transaction added');
  },

  async updateTransaction(data) {
    const state = readState();
    const now = new Date().toISOString();
    const nextTransactions = state.transactions.map((transaction) =>
      transaction.id === data.id
        ? {
            ...transaction,
            ...data,
            amount: Number(data.amount),
            note: data.note || '',
            updated_at: now,
          }
        : transaction,
    );

    writeState({ ...state, transactions: nextTransactions });
    return response(nextTransactions.find((transaction) => transaction.id === data.id), 'Transaction updated');
  },

  async deleteTransaction(id) {
    const state = readState();
    writeState({
      ...state,
      transactions: state.transactions.filter((transaction) => transaction.id !== id),
    });
    return response({ id }, 'Transaction deleted');
  },

  async getCategories() {
    return response(readState().categories, 'Categories loaded');
  },

  async addCategory(data) {
    const state = readState();
    const category = {
      id: createId('CAT'),
      name: data.name.trim(),
      type: data.type,
      icon: data.icon || 'circle-dot',
      color: data.color || '#64748b',
    };

    writeState({ ...state, categories: [...state.categories, category] });
    return response(category, 'Category added');
  },

  async getWallets() {
    return response(readState().wallets, 'Wallets loaded');
  },

  async addWallet(data) {
    const state = readState();
    const wallet = {
      id: createId('WAL'),
      name: data.name.trim(),
      initial_balance: Number(data.initial_balance || 0),
      note: data.note || '',
    };

    writeState({ ...state, wallets: [...state.wallets, wallet] });
    return response(wallet, 'Wallet added');
  },

  async getBudgets() {
    return response(readState().budgets, 'Budgets loaded');
  },

  async addBudget(data) {
    const state = readState();
    const budget = {
      id: data.id || createId('BUD'),
      month: data.month,
      category: data.category,
      limit_amount: Number(data.limit_amount || 0),
      created_at: data.created_at || new Date().toISOString(),
    };
    const exists = state.budgets.some(
      (item) => item.month === budget.month && item.category === budget.category,
    );
    const budgets = exists
      ? state.budgets.map((item) =>
          item.month === budget.month && item.category === budget.category ? { ...item, ...budget } : item,
        )
      : [...state.budgets, budget];

    writeState({ ...state, budgets });
    return response(budget, 'Budget saved');
  },

  async getSettings() {
    return response(readState().settings, 'Settings loaded');
  },

  async updateSettings(settings) {
    const state = readState();
    const nextSettings = { ...state.settings, ...settings };
    writeState({ ...state, settings: nextSettings });
    return response(nextSettings, 'Settings saved');
  },

  resetDemoData() {
    const state = createDefaultState();
    writeState(state);
    return response(state, 'Demo data restored');
  },
};
