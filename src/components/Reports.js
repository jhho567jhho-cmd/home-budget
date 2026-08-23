import React, { useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCategoryName } from '../utils/helpers';

function Reports({ transactions, categories, budgets }) {
  const monthlyData = useMemo(() => {
    const data = {};
    transactions.forEach(t => {
      const month = t.date.substring(0, 7);
      if (!data[month]) {
        data[month] = { income: 0, expenses: 0, balance: 0 };
      }
      const category = categories.find(c => c.id === t.categoryId);
      if (category?.type === 'income') {
        data[month].income += t.amount;
      } else {
        data[month].expenses += t.amount;
      }
    });

    return Object.entries(data)
      .map(([month, values]) => ({
        month,
        ...values,
        balance: values.income - values.expenses
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12);
  }, [transactions, categories]);

  const expensesByCategory = useMemo(() => {
    const data = {};
    transactions.forEach(t => {
      const category = categories.find(c => c.id === t.categoryId);
      if (category?.type === 'expense') {
        const name = getCategoryName(t.categoryId, categories);
        data[t.categoryId] = {
          name,
          value: (data[t.categoryId]?.value || 0) + t.amount,
          color: category.color
        };
      }
    });
    return Object.values(data).sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  const stats = useMemo(() => {
    const allTransactions = transactions.filter(t => {
      const category = categories.find(c => c.id === t.categoryId);
      return category?.type === 'expense';
    });

    if (allTransactions.length === 0) {
      return { avg: 0, max: 0, min: 0, total: 0 };
    }

    const amounts = allTransactions.map(t => t.amount);
    return {
      total: amounts.reduce((a, b) => a + b, 0),
      avg: amounts.reduce((a, b) => a + b, 0) / amounts.length,
      max: Math.max(...amounts),
      min: Math.min(...amounts)
    };
  }, [transactions, categories]);

  const monthNames = ['ינו', 'פבר', 'מרץ', 'אפ', 'מאי', 'יוני', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצ'];

  const chartData = monthlyData.map(d => ({
    ...d,
    monthName: monthNames[parseInt(d.month.split('-')[1]) - 1]
  }));

  return (
    <div className="reports">
      <h2>ניתוחים ודוחות</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">סה״כ הוצאות</p>
          <h3>{stats.total.toFixed(0)} ₪</h3>
        </div>
        <div className="stat-card">
          <p className="stat-label">ממוצע הוצאה</p>
          <h3>{stats.avg.toFixed(0)} ₪</h3>
        </div>
        <div className="stat-card">
          <p className="stat-label">הוצאה מקסימלית</p>
          <h3>{stats.max.toFixed(0)} ₪</h3>
        </div>
        <div className="stat-card">
          <p className="stat-label">הוצאה מינימלית</p>
          <h3>{stats.min.toFixed(0)} ₪</h3>
        </div>
      </div>

      <div className="chart-container">
        <h3>הכנסות והוצאות חודשיות</h3>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthName" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toFixed(0)} ₪`} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#27AE60" name="הכנסות" />
              <Line type="monotone" dataKey="expenses" stroke="#E74C3C" name="הוצאות" />
              <Line type="monotone" dataKey="balance" stroke="#3498DB" name="יתרה" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="empty-state">אין נתונים לתצוגה</p>
        )}
      </div>

      <div className="chart-container">
        <h3>הוצאות לפי קטגוריה</h3>
        {expensesByCategory.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expensesByCategory.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toFixed(0)} ₪`} />
              <Bar dataKey="value" fill="#3498DB" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="empty-state">אין הוצאות</p>
        )}
      </div>

      <div className="summary-section">
        <h3>סיכום קטגוריות</h3>
        {expensesByCategory.length > 0 ? (
          <table className="summary-table">
            <thead>
              <tr>
                <th>קטגוריה</th>
                <th>סכום</th>
                <th>% מסה״כ</th>
              </tr>
            </thead>
            <tbody>
              {expensesByCategory.map(cat => (
                <tr key={cat.name}>
                  <td>
                    <span
                      className="category-dot"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </td>
                  <td>{cat.value.toFixed(0)} ₪</td>
                  <td>{((cat.value / stats.total) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-state">אין נתונים</p>
        )}
      </div>
    </div>
  );
}

export default Reports;
