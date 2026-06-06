import { gasApi, getGasApiUrl, isGasConfigured } from './gasApi';
import { localApi } from './localStore';

function activeApi() {
  return isGasConfigured() ? gasApi : localApi;
}

export const financeApi = {
  getSourceInfo() {
    return {
      mode: isGasConfigured() ? 'google-sheets' : 'local',
      label: isGasConfigured() ? 'Google Sheets' : 'Demo Lokal',
      url: getGasApiUrl(),
    };
  },

  getTransactions: (params) => activeApi().getTransactions(params),
  getAllTransactions: () => activeApi().getAllTransactions(),
  addTransaction: (data) => activeApi().addTransaction(data),
  updateTransaction: (data) => activeApi().updateTransaction(data),
  deleteTransaction: (id) => activeApi().deleteTransaction(id),
  getCategories: () => activeApi().getCategories(),
  addCategory: (data) => activeApi().addCategory(data),
  getWallets: () => activeApi().getWallets(),
  addWallet: (data) => activeApi().addWallet(data),
  getBudgets: () => activeApi().getBudgets(),
  addBudget: (data) => activeApi().addBudget(data),
  getSettings: () => activeApi().getSettings(),
  updateSettings: (settings) => activeApi().updateSettings(settings),
  resetDemoData: () => localApi.resetDemoData(),
};
