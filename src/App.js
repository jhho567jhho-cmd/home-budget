import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrendingUp, FiTrendingDown, FiBarChart2, FiSettings } from 'react-icons/fi';
import { storage } from './utils/storage';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BudgetManager from './components/BudgetManager';
import Reports from './components/Reports';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setTransactions(storage.getTransactions());
    setCategories(storage.getCategories());
    setBudgets(storage.getBudgets());
  }, []);

  const handleAddTransaction = (transaction) => {
    const newTransaction = storage.addTransaction(transaction);
    setTransactions([...transactions, newTransaction]);
    setShowForm(false);
  };

  const handleDeleteTransaction = (id) => {
    storage.deleteTransaction(id);
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleUpdateBudgets = (newBudgets) => {
    storage.saveBudgets(newBudgets);
    setBudgets(newBudgets);
  };

  const handleAddCategory = (category) => {
    const newCategory = {
      ...category,
      id: Math.max(0, ...categories.map(c => c.id)) + 1
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    storage.saveCategories(updatedCategories);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>💰 ניהול תקציב בית</h1>
        <p className="subtitle">הקדש 5 דקות כדי לשלוט בכלכלה שלך</p>
      </header>

      <div className="content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FiBarChart2 /> דוח כללי
          </button>
          <button
            className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            <FiTrendingUp /> עסקאות
          </button>
          <button
            className={`tab ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('budget')}
          >
            <FiTrendingDown /> תקציבים
          </button>
          <button
            className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <FiBarChart2 /> ניתוחים
          </button>
          <button
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FiSettings /> הגדרות
          </button>
        </div>

        {showForm && (
          <TransactionForm
            categories={categories}
            onSubmit={handleAddTransaction}
            onCancel={() => setShowForm(false)}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            transactions={transactions}
            categories={categories}
            budgets={budgets}
            onAddClick={() => setShowForm(true)}
          />
        )}

        {activeTab === 'transactions' && (
          <div>
            <div className="tab-header">
              <h2>רשימת עסקאות</h2>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                <FiPlus /> הוסף עסקה
              </button>
            </div>
            {!showForm && (
              <TransactionList
                transactions={transactions}
                categories={categories}
                onDelete={handleDeleteTransaction}
              />
            )}
          </div>
        )}

        {activeTab === 'budget' && (
          <BudgetManager
            budgets={budgets}
            categories={categories}
            transactions={transactions}
            onUpdateBudgets={handleUpdateBudgets}
            onAddCategory={handleAddCategory}
          />
        )}

        {activeTab === 'reports' && (
          <Reports
            transactions={transactions}
            categories={categories}
            budgets={budgets}
          />
        )}

        {activeTab === 'settings' && (
          <div className="settings-panel">
            <h2>הגדרות</h2>
            <div className="setting-item">
              <h3>ניהול נתונים</h3>
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (window.confirm('אתה בטוח שברצונך למחוק את כל הנתונים?')) {
                    storage.saveTransactions([]);
                    storage.saveBudgets({});
                    setTransactions([]);
                    setBudgets({});
                  }
                }}
              >
                מחק את כל הנתונים
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
