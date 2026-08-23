export const getCurrentMonth = () => {
  const now = new Date();
  return now.toISOString().split('T')[0].substring(0, 7);
};

export const getCategoryName = (categoryId, categories) => {
  return categories.find(c => c.id === categoryId)?.name || 'לא ידוע';
};

export const formatCurrency = (amount) => {
  return `${amount.toFixed(0)} ₪`;
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('he-IL');
};

export const getMonthName = (monthStr) => {
  const [year, month] = monthStr.split('-');
  const monthNames = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};
