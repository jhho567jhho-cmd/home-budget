const STORAGE_KEYS = {
  BUDGET: 'home_budget_budget',
  TRANSACTIONS: 'home_budget_transactions',
  CATEGORIES: 'home_budget_categories'
};

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'מזון וקניות', color: '#FF6B6B', type: 'expense' },
  { id: 2, name: 'שכר דירה/משכנתא', color: '#4ECDC4', type: 'expense' },
  { id: 3, name: 'חשמל ומים', color: '#45B7D1', type: 'expense' },
  { id: 4, name: 'תחבורה', color: '#96CEB4', type: 'expense' },
  { id: 5, name: 'בריאות', color: '#FFEAA7', type: 'expense' },
  { id: 6, name: 'בידור', color: '#DDA15E', type: 'expense' },
  { id: 7, name: 'ביטוחים', color: '#BC6C25', type: 'expense' },
  { id: 8, name: 'חינוך', color: '#8E44AD', type: 'expense' },
  { id: 9, name: 'חיסכון', color: '#27AE60', type: 'expense' },
  { id: 10, name: 'משכורת', color: '#3498DB', type: 'income' },
  { id: 11, name: 'מענק', color: '#2ECC71', type: 'income' },
  { id: 12, name: 'הכנסה נוספת', color: '#F39C12', type: 'income' }
];

export const storage = {
  getCategories: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  },

  saveCategories: (categories) => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  getTransactions: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveTransactions: (transactions) => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  getBudgets: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BUDGET);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  saveBudgets: (budgets) => {
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budgets));
  },

  addTransaction: (transaction) => {
    const transactions = storage.getTransactions();
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      date: transaction.date || new Date().toISOString().split('T')[0]
    };
    transactions.push(newTransaction);
    storage.saveTransactions(transactions);
    return newTransaction;
  },

  deleteTransaction: (id) => {
    const transactions = storage.getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    storage.saveTransactions(filtered);
  },

  updateTransaction: (id, updates) => {
    const transactions = storage.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updates };
      storage.saveTransactions(transactions);
    }
  }
};
