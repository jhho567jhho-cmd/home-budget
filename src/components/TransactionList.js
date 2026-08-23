import React, { useState, useMemo } from 'react';
import { FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { getCategoryName } from '../utils/helpers';

function TransactionList({ transactions, categories, onDelete }) {
  const [expandedMonth, setExpandedMonth] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');

  const groupedByMonth = useMemo(() => {
    const grouped = {};
    transactions.forEach(t => {
      const month = t.date.substring(0, 7);
      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(t);
    });

    Object.keys(grouped).forEach(month => {
      grouped[month].sort((a, b) => {
        const comparison = new Date(b.date) - new Date(a.date);
        return sortOrder === 'desc' ? comparison : -comparison;
      });
    });

    return grouped;
  }, [transactions, sortOrder]);

  const months = Object.keys(groupedByMonth).sort().reverse();

  const formatMonthLabel = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const monthNames = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="transaction-list">
      <div className="list-controls">
        <button
          className={`sort-btn ${sortOrder === 'desc' ? 'active' : ''}`}
          onClick={() => setSortOrder('desc')}
        >
          חדש לישן
        </button>
        <button
          className={`sort-btn ${sortOrder === 'asc' ? 'active' : ''}`}
          onClick={() => setSortOrder('asc')}
        >
          ישן לחדש
        </button>
      </div>

      {months.length === 0 ? (
        <p className="empty-state">אין עסקאות</p>
      ) : (
        months.map(month => (
          <div key={month} className="month-group">
            <button
              className="month-header"
              onClick={() => setExpandedMonth(expandedMonth === month ? null : month)}
            >
              <span>{formatMonthLabel(month)}</span>
              <span className="month-count">
                ({groupedByMonth[month].length})
              </span>
              {expandedMonth === month ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            {expandedMonth === month && (
              <div className="transaction-items">
                {groupedByMonth[month].map(t => (
                  <div key={t.id} className="transaction-item">
                    <div className="transaction-info">
                      <div className="transaction-header">
                        <span className="category-name">
                          {getCategoryName(t.categoryId, categories)}
                        </span>
                        <span className="transaction-date">{t.date}</span>
                      </div>
                      {t.description && (
                        <p className="transaction-description">{t.description}</p>
                      )}
                    </div>
                    <div className="transaction-actions">
                      <span className={`amount ${categories.find(c => c.id === t.categoryId)?.type}`}>
                        {categories.find(c => c.id === t.categoryId)?.type === 'income' ? '+' : '-'}
                        {t.amount.toFixed(0)} ₪
                      </span>
                      <button
                        className="delete-btn"
                        onClick={() => {
                          if (window.confirm('האם אתה בטוח?')) {
                            onDelete(t.id);
                          }
                        }}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default TransactionList;
