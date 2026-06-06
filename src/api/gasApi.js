const API_URL = (import.meta.env.VITE_GAS_API_URL || '').trim();

export function isGasConfigured() {
  return Boolean(API_URL) && !API_URL.includes('PASTE_DEPLOYMENT_ID');
}

export function getGasApiUrl() {
  return API_URL;
}

async function getData(action, params = {}) {
  const query = new URLSearchParams({ action, ...params });
  const response = await fetch(`${API_URL}?${query.toString()}`);

  if (!response.ok) {
    throw new Error('Gagal mengambil data dari Google Apps Script');
  }

  const payload = await response.json();
  if (payload.success === false) {
    throw new Error(payload.message || 'Request gagal');
  }

  return payload;
}

async function postData(payload) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Gagal mengirim data ke Google Apps Script');
  }

  const result = await response.json();
  if (result.success === false) {
    throw new Error(result.message || 'Request gagal');
  }

  return result;
}

export const gasApi = {
  getTransactions: (params = {}) => getData('getTransactions', params),
  getAllTransactions: () => getData('getTransactions'),
  getSummary: (params = {}) => getData('getSummary', params),
  getCategories: () => getData('getCategories'),
  getWallets: () => getData('getWallets'),
  getBudgets: () => getData('getBudgets'),
  getGoals: () => getData('getGoals'),
  getSettings: () => getData('getSettings'),

  addTransaction: (data) => postData({ action: 'addTransaction', ...data }),
  updateTransaction: (data) => postData({ action: 'updateTransaction', ...data }),
  deleteTransaction: (id) => postData({ action: 'deleteTransaction', id }),
  addCategory: (data) => postData({ action: 'addCategory', ...data }),
  addWallet: (data) => postData({ action: 'addWallet', ...data }),
  addBudget: (data) => postData({ action: 'addBudget', ...data }),
  updateSettings: (settings) => postData({ action: 'updateSettings', settings }),
};
