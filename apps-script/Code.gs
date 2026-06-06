const SPREADSHEET_ID = 'PASTE_SPREADSHEET_ID_HERE';

const SHEETS = {
  transactions: 'Transactions',
  categories: 'Categories',
  wallets: 'Wallets',
  budgets: 'Budgets',
  goals: 'Goals',
  settings: 'Settings',
};

const HEADERS = {
  Transactions: ['id', 'date', 'type', 'category', 'amount', 'wallet', 'note', 'created_at', 'updated_at'],
  Categories: ['id', 'name', 'type', 'icon', 'color'],
  Wallets: ['id', 'name', 'initial_balance', 'note'],
  Budgets: ['id', 'month', 'category', 'limit_amount', 'created_at'],
  Goals: ['id', 'name', 'target_amount', 'current_amount', 'deadline', 'created_at'],
  Settings: ['key', 'value'],
};

function doGet(e) {
  try {
    const action = e.parameter.action;

    if (action === 'getTransactions') {
      return jsonResponse(true, 'Transactions loaded', getTransactions(e.parameter));
    }

    if (action === 'getSummary') {
      return jsonResponse(true, 'Summary loaded', getSummary(e.parameter));
    }

    if (action === 'getCategories') {
      return jsonResponse(true, 'Categories loaded', getSheetObjects(SHEETS.categories));
    }

    if (action === 'getWallets') {
      return jsonResponse(true, 'Wallets loaded', getSheetObjects(SHEETS.wallets));
    }

    if (action === 'getBudgets') {
      return jsonResponse(true, 'Budgets loaded', getSheetObjects(SHEETS.budgets));
    }

    if (action === 'getGoals') {
      return jsonResponse(true, 'Goals loaded', getSheetObjects(SHEETS.goals));
    }

    if (action === 'getSettings') {
      return jsonResponse(true, 'Settings loaded', getSettings());
    }

    return jsonResponse(false, 'Invalid GET action', null);
  } catch (error) {
    return jsonResponse(false, error.message, null);
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;

    if (action === 'addTransaction') {
      return jsonResponse(true, 'Transaction added', addTransaction(body));
    }

    if (action === 'updateTransaction') {
      return jsonResponse(true, 'Transaction updated', updateTransaction(body));
    }

    if (action === 'deleteTransaction') {
      return jsonResponse(true, 'Transaction deleted', deleteTransaction(body.id));
    }

    if (action === 'addCategory') {
      return jsonResponse(true, 'Category added', addCategory(body));
    }

    if (action === 'addWallet') {
      return jsonResponse(true, 'Wallet added', addWallet(body));
    }

    if (action === 'addBudget') {
      return jsonResponse(true, 'Budget added', addBudget(body));
    }

    if (action === 'addGoal') {
      return jsonResponse(true, 'Goal added', addGoal(body));
    }

    if (action === 'updateSettings') {
      return jsonResponse(true, 'Settings updated', updateSettings(body.settings || body));
    }

    return jsonResponse(false, 'Invalid POST action', null);
  } catch (error) {
    return jsonResponse(false, error.message, null);
  }
}

function setupDatabase() {
  Object.keys(HEADERS).forEach(function(sheetName) {
    ensureSheet(sheetName);
  });

  seedDefaultsIfEmpty();
}

function seedDefaultsIfEmpty() {
  seedRows(SHEETS.categories, [
    ['CAT-001', 'Gaji', 'income', 'briefcase', '#047857'],
    ['CAT-002', 'Bonus', 'income', 'gift', '#0369a1'],
    ['CAT-003', 'Penjualan', 'income', 'store', '#7c3aed'],
    ['CAT-004', 'Makanan', 'expense', 'utensils', '#dc2626'],
    ['CAT-005', 'Transportasi', 'expense', 'car', '#ea580c'],
    ['CAT-006', 'Tagihan', 'expense', 'receipt', '#475569'],
    ['CAT-007', 'Belanja', 'expense', 'shopping-bag', '#db2777'],
    ['CAT-008', 'Kesehatan', 'expense', 'heart-pulse', '#0891b2'],
    ['CAT-009', 'Pendidikan', 'expense', 'book-open', '#ca8a04'],
    ['CAT-010', 'Lainnya', 'expense', 'circle-dot', '#64748b'],
  ]);

  seedRows(SHEETS.wallets, [
    ['WAL-001', 'Cash', 0, 'Uang tunai'],
    ['WAL-002', 'Bank', 0, 'Rekening utama'],
    ['WAL-003', 'E-Wallet', 0, 'Dompet digital'],
  ]);

  seedRows(SHEETS.settings, [
    ['app_name', 'Data Keuangan'],
    ['currency', 'IDR'],
    ['default_wallet', 'Cash'],
  ]);
}

function seedRows(sheetName, rows) {
  const sheet = getSheet(sheetName);
  const existingRows = sheet.getLastRow();

  if (existingRows <= 1 && rows.length) {
    sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  }
}

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getSheet(name) {
  return ensureSheet(name);
}

function ensureSheet(name) {
  const spreadsheet = getSpreadsheet();
  let sheet = spreadsheet.getSheetByName(name);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
  }

  ensureSheetHeader(sheet, name);

  return sheet;
}

function ensureSheetHeader(sheet, sheetName) {
  const headers = HEADERS[sheetName];

  if (!headers) {
    throw new Error('Unknown sheet: ' + sheetName);
  }

  const lastColumn = Math.max(sheet.getLastColumn(), headers.length);
  const currentHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  const hasHeader = currentHeaders.some(function(cell) {
    return cell !== '';
  });

  if (!hasHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    return;
  }

  const needsHeaderRepair = headers.some(function(header, index) {
    return currentHeaders[index] !== header;
  });

  if (needsHeaderRepair) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  sheet.setFrozenRows(1);
}

function getSheetObjects(sheetName) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return [];
  }

  const headers = values[0];
  const rows = values.slice(1).filter(function(row) {
    return row.some(function(cell) {
      return cell !== '';
    });
  });

  return rows.map(function(row) {
    const object = {};
    headers.forEach(function(header, index) {
      object[header] = normalizeValue(row[index]);
    });
    return object;
  });
}

function getTransactions(params) {
  let transactions = getSheetObjects(SHEETS.transactions);

  if (params.month) {
    transactions = transactions.filter(function(item) {
      return formatDateValue(item.date).indexOf(params.month) === 0;
    });
  }

  if (params.type) {
    transactions = transactions.filter(function(item) {
      return item.type === params.type;
    });
  }

  transactions.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  return transactions;
}

function addTransaction(data) {
  validateTransaction(data);

  const sheet = getSheet(SHEETS.transactions);
  const now = new Date();
  const id = generateId('TRX');
  const row = [
    id,
    data.date,
    data.type,
    data.category,
    Number(data.amount),
    data.wallet,
    data.note || '',
    now,
    now,
  ];

  sheet.appendRow(row);

  return {
    id: id,
    date: data.date,
    type: data.type,
    category: data.category,
    amount: Number(data.amount),
    wallet: data.wallet,
    note: data.note || '',
    created_at: now,
    updated_at: now,
  };
}

function updateTransaction(data) {
  if (!data.id) {
    throw new Error('Transaction id is required');
  }

  validateTransaction(data);

  const sheet = getSheet(SHEETS.transactions);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('id');

  for (let i = 1; i < values.length; i += 1) {
    if (values[i][idIndex] === data.id) {
      const rowNumber = i + 1;
      const updatedRow = [
        data.id,
        data.date,
        data.type,
        data.category,
        Number(data.amount),
        data.wallet,
        data.note || '',
        values[i][7],
        new Date(),
      ];

      sheet.getRange(rowNumber, 1, 1, updatedRow.length).setValues([updatedRow]);
      return data;
    }
  }

  throw new Error('Transaction not found');
}

function deleteTransaction(id) {
  if (!id) {
    throw new Error('Transaction id is required');
  }

  const sheet = getSheet(SHEETS.transactions);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('id');

  for (let i = 1; i < values.length; i += 1) {
    if (values[i][idIndex] === id) {
      sheet.deleteRow(i + 1);
      return { id: id };
    }
  }

  throw new Error('Transaction not found');
}

function getSummary(params) {
  const month = params.month || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM');
  const transactions = getTransactions({ month: month });
  const expenseByCategory = {};

  const totalIncome = transactions
    .filter(function(item) {
      return item.type === 'income';
    })
    .reduce(function(sum, item) {
      return sum + Number(item.amount || 0);
    }, 0);

  const totalExpense = transactions
    .filter(function(item) {
      return item.type === 'expense';
    })
    .reduce(function(sum, item) {
      return sum + Number(item.amount || 0);
    }, 0);

  transactions
    .filter(function(item) {
      return item.type === 'expense';
    })
    .forEach(function(item) {
      const category = item.category || 'Lainnya';
      expenseByCategory[category] = (expenseByCategory[category] || 0) + Number(item.amount || 0);
    });

  return {
    month: month,
    totalIncome: totalIncome,
    totalExpense: totalExpense,
    balance: totalIncome - totalExpense,
    expenseByCategory: expenseByCategory,
    recentTransactions: transactions.slice(0, 5),
  };
}

function addCategory(data) {
  if (!data.name) {
    throw new Error('Category name is required');
  }

  const sheet = getSheet(SHEETS.categories);
  const category = {
    id: generateId('CAT'),
    name: data.name,
    type: data.type || 'expense',
    icon: data.icon || 'circle-dot',
    color: data.color || '#64748b',
  };

  sheet.appendRow([category.id, category.name, category.type, category.icon, category.color]);
  return category;
}

function addWallet(data) {
  if (!data.name) {
    throw new Error('Wallet name is required');
  }

  const sheet = getSheet(SHEETS.wallets);
  const wallet = {
    id: generateId('WAL'),
    name: data.name,
    initial_balance: Number(data.initial_balance || 0),
    note: data.note || '',
  };

  sheet.appendRow([wallet.id, wallet.name, wallet.initial_balance, wallet.note]);
  return wallet;
}

function addBudget(data) {
  if (!data.month || !data.category) {
    throw new Error('Budget month and category are required');
  }

  const sheet = getSheet(SHEETS.budgets);
  const budget = {
    id: generateId('BUD'),
    month: data.month,
    category: data.category,
    limit_amount: Number(data.limit_amount || 0),
    created_at: new Date(),
  };

  sheet.appendRow([budget.id, budget.month, budget.category, budget.limit_amount, budget.created_at]);
  return budget;
}

function addGoal(data) {
  if (!data.name) {
    throw new Error('Goal name is required');
  }

  const sheet = getSheet(SHEETS.goals);
  const goal = {
    id: generateId('GOAL'),
    name: data.name,
    target_amount: Number(data.target_amount || 0),
    current_amount: Number(data.current_amount || 0),
    deadline: data.deadline || '',
    created_at: new Date(),
  };

  sheet.appendRow([
    goal.id,
    goal.name,
    goal.target_amount,
    goal.current_amount,
    goal.deadline,
    goal.created_at,
  ]);
  return goal;
}

function getSettings() {
  const settings = {};
  getSheetObjects(SHEETS.settings).forEach(function(item) {
    settings[item.key] = item.value;
  });
  return settings;
}

function updateSettings(settings) {
  const sheet = getSheet(SHEETS.settings);
  sheet.clearContents();
  sheet.getRange(1, 1, 1, HEADERS.Settings.length).setValues([HEADERS.Settings]);

  const rows = Object.keys(settings)
    .filter(function(key) {
      return key !== 'action';
    })
    .map(function(key) {
      return [key, settings[key]];
    });

  if (rows.length) {
    sheet.getRange(2, 1, rows.length, 2).setValues(rows);
  }

  return settings;
}

function validateTransaction(data) {
  if (!data.date) throw new Error('Date is required');
  if (data.type !== 'income' && data.type !== 'expense') throw new Error('Transaction type is invalid');
  if (!data.category) throw new Error('Category is required');
  if (!data.wallet) throw new Error('Wallet is required');
  if (!Number(data.amount) || Number(data.amount) <= 0) throw new Error('Amount must be greater than zero');
}

function generateId(prefix) {
  const date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMddHHmmss');
  const random = Math.floor(Math.random() * 10000);
  return prefix + '-' + date + '-' + random;
}

function normalizeValue(value) {
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return value;
}

function formatDateValue(value) {
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(value);
}

function jsonResponse(success, message, data) {
  return ContentService.createTextOutput(
    JSON.stringify({
      success: success,
      message: message,
      data: data,
    }),
  ).setMimeType(ContentService.MimeType.JSON);
}
