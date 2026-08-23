import React, { useMemo } from 'react';
import { FiPlus, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getCurrentMonth, getCategoryName } from '../utils/helpers';

function Dashboard({ transactions, categories, budgets, onAddClick }) {
  const currentMonth = useMemo(() => getCurrentMonth(), []);

  const monthlyData = useMemo(() => {
    const data = {
      income: 0,
      expenses: {},
      byCategory: {}
    };

    transactions.forEach(t => {
      if (t.date.startsWith(currentMonth)) {
        const category = categories.find(c => c.id === t.categoryId);
        if (!category) return;

        if (category.type === 'income') {
          data.income += t.amount;
        } else {
          data.expenses[t.categoryId] = (data.expenses[t.categoryId] || 0) + t.amount;
        }

        data.byCategory[t.categoryId] = (data.byCategory[t.categoryId] || 0) + t.amount;
      }
    });

    return data;
  }, [transactions, currentMonth, categories]);

  const totalExpenses = Object.values(monthlyData.expenses).reduce((a, b) => a + b, 0);
  const balance = monthlyData.income - totalExpenses;

  const chartData = Object.entries(monthlyData.byCategory)
    .filter(([categoryId]) => {
      const cat = categories.find(c => c.id === parseInt(categoryId));
      return cat && cat.type === 'expense';
    })
    .map(([categoryId, amount]) => ({
      name: getCategoryName(parseInt(categoryId), categories),
      value: amount,
      color: categories.find(c => c.id === parseInt(categoryId))?.color || '#999'
    }))
    .filter(item => item.value > 0);

  const recentTransactions = transactions
    .filter(t => t.date.startsWith(currentMonth))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="dashboard">
      <div className="summary-cards">
        <div className="card income-card">
          <div className="card-icon"><FiArrowDown /></div>
          <div className="card-content">
            <p className="card-label">הכנסות</p>
            <h3>{monthlyData.income.toFixed(0)} ₪</h3>
          </div>
        </div>

        <div className="card expense-card">
          <div className="card-icon"><FiArrowUp /></div>
          <div className="card-content">
            <p className="card-label">הוצאות</p>
            <h3>{totalExpenses.toFixed(0)} ₪</h3>
          </div>
        </div>

        <div className={`card balance-card ${balance >= 0 ? 'positive' : 'negative'}`}>
          <div className="card-icon">💰</div>
          <div className="card-content">
            <p className="card-label">יתרה</p>
            <h3>{balance.toFixed(0)} ₪</h3>
          </div>
        </div>
      </div>

      <div className="main-grid">
        <div className="card">
          <h2>התפלגות הוצאות</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}₪`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(0)} ₪`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="empty-state">אין עדיין הוצאות</p>
          )}
        </div>

        <div className="card">
          <h2>עסקאות אחרונות</h2>
          {recentTransactions.length > 0 ? (
            <div className="transaction-mini-list">
              {recentTransactions.map(t => (
                <div key={t.id} className="transaction-mini-item">
                  <div>
                    <p className="transaction-category">
                      {getCategoryName(t.categoryId, categories)}
                    </p>
                    <p className="transaction-date">{t.date}</p>
                  </div>
                  <p className={`transaction-amount ${categories.find(c => c.id === t.categoryId)?.type}`}>
                    {categories.find(c => c.id === t.categoryId)?.type === 'income' ? '+' : '-'}{t.amount.toFixed(0)} ₪
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">אין עדיין עסקאות</p>
          )}
          <button className="btn btn-secondary" onClick={onAddClick} style={{ marginTop: '1rem' }}>
            <FiPlus /> הוסף עסקה
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
