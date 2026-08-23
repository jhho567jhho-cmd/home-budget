import React, { useState, useMemo } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import { getCurrentMonth } from '../utils/helpers';

function BudgetManager({ budgets, categories, transactions, onUpdateBudgets, onAddCategory }) {
  const [editingBudget, setEditingBudget] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#FF6B6B',
    type: 'expense'
  });

  const currentMonth = useMemo(() => getCurrentMonth(), []);

  const expenseCategories = categories.filter(c => c.type === 'expense');

  const categorySpending = useMemo(() => {
    const spending = {};
    transactions.forEach(t => {
      if (t.date.startsWith(currentMonth) && categories.find(c => c.id === t.categoryId)?.type === 'expense') {
        spending[t.categoryId] = (spending[t.categoryId] || 0) + t.amount;
      }
    });
    return spending;
  }, [transactions, currentMonth, categories]);

  const handleSaveBudget = (categoryId) => {
    if (!budgetAmount || isNaN(budgetAmount)) {
      alert('אנא הכנס סכום תקציב תקין');
      return;
    }

    const updated = {
      ...budgets,
      [categoryId]: parseFloat(budgetAmount)
    };
    onUpdateBudgets(updated);
    setEditingBudget(null);
    setBudgetAmount('');
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      alert('אנא הכנס שם קטגוריה');
      return;
    }
    onAddCategory(newCategory);
    setNewCategory({ name: '', color: '#FF6B6B', type: 'expense' });
    setShowNewCategory(false);
  };

  const getPercentage = (categoryId) => {
    const budget = budgets[categoryId];
    if (!budget) return 0;
    const spent = categorySpending[categoryId] || 0;
    return Math.min(100, (spent / budget) * 100);
  };

  const isOverBudget = (categoryId) => {
    const budget = budgets[categoryId];
    if (!budget) return false;
    return (categorySpending[categoryId] || 0) > budget;
  };

  return (
    <div className="budget-manager">
      <div className="section-header">
        <h2>תקציבים חודשיים</h2>
        <button
          className="btn btn-secondary"
          onClick={() => setShowNewCategory(true)}
        >
          <FiPlus /> הוסף קטגוריה
        </button>
      </div>

      {showNewCategory && (
        <div className="modal-overlay" onClick={() => setShowNewCategory(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>קטגוריה חדשה</h2>
              <button className="close-btn" onClick={() => setShowNewCategory(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="category-form">
              <div className="form-group">
                <label htmlFor="catname">שם הקטגוריה</label>
                <input
                  id="catname"
                  type="text"
                  placeholder="e.g., בידור"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="cattype">סוג</label>
                <select
                  id="cattype"
                  value={newCategory.type}
                  onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                >
                  <option value="expense">הוצאה</option>
                  <option value="income">הכנסה</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="catcolor">צבע</label>
                <input
                  id="catcolor"
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewCategory(false)}>
                  ביטול
                </button>
                <button type="submit" className="btn btn-primary">
                  הוסף קטגוריה
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="budget-grid">
        {expenseCategories.map(category => {
          const spent = categorySpending[category.id] || 0;
          const budget = budgets[category.id];
          const percentage = getPercentage(category.id);
          const overBudget = isOverBudget(category.id);

          return (
            <div key={category.id} className={`budget-card ${overBudget ? 'over-budget' : ''}`}>
              <div className="budget-header">
                <span
                  className="category-dot"
                  style={{ backgroundColor: category.color }}
                />
                <h3>{category.name}</h3>
              </div>

              {editingBudget === category.id ? (
                <div className="budget-edit">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="הכנס תקציב"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    autoFocus
                  />
                  <div className="edit-actions">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => {
                        setEditingBudget(null);
                        setBudgetAmount('');
                      }}
                    >
                      ביטול
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleSaveBudget(category.id)}
                    >
                      שמור
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="budget-info">
                    <span className="spent">ξ {spent.toFixed(0)} ₪</span>
                    <span className="budget">
                      {budget ? `מתוך ${budget.toFixed(0)} ₪` : 'לא הוגדר תקציב'}
                    </span>
                  </div>

                  {budget && (
                    <div className="budget-bar">
                      <div
                        className="budget-progress"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  )}

                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => {
                      setEditingBudget(category.id);
                      setBudgetAmount(budget || '');
                    }}
                  >
                    {budget ? 'ערוך' : 'הגדר תקציב'}
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BudgetManager;
