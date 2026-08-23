import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

function TransactionForm({ categories, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: null,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [selectedType, setSelectedType] = useState('expense');

  const filteredCategories = categories.filter(c => c.type === selectedType);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId) {
      alert('אנא מלא את כל השדות');
      return;
    }
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      categoryId: parseInt(formData.categoryId)
    });
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>הוסף עסקה</h2>
          <button className="close-btn" onClick={onCancel}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-group">
            <label>סוג עסקה</label>
            <div className="type-buttons">
              <button
                type="button"
                className={`type-btn ${selectedType === 'expense' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedType('expense');
                  setFormData({ ...formData, categoryId: null });
                }}
              >
                הוצאה
              </button>
              <button
                type="button"
                className={`type-btn ${selectedType === 'income' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedType('income');
                  setFormData({ ...formData, categoryId: null });
                }}
              >
                הכנסה
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="amount">סכום</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">קטגוריה</label>
            <select
              id="category"
              value={formData.categoryId || ''}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
            >
              <option value="">בחר קטגוריה</option>
              {filteredCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">תאריך</label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">הערות (אופציונלי)</label>
            <textarea
              id="description"
              placeholder="תיאור העסקה"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              ביטול
            </button>
            <button type="submit" className="btn btn-primary">
              שמור עסקה
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionForm;
