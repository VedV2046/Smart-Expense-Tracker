import { useState } from 'react';
import { X } from 'lucide-react';
import '../styles/TransactionModal.css';

const expenseCategories = ['Food', 'Travel', 'Bills', 'Utilities', 'Entertainment', 'Stationary', 'Other'];
const incomeCategories = ['Income', 'Salary', 'Freelance', 'Investment', 'Other'];

const formatDateForInput = (dateVal) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function TransactionModal({ isOpen, onClose, onSubmit, transaction }) {
  const [name, setName] = useState(transaction?.name || '');
  const [amount, setAmount] = useState(transaction ? Math.abs(Number(transaction.amount)) : '');
  const [type, setType] = useState(transaction ? (Number(transaction.amount) > 0 ? 'Income' : 'Expense') : 'Expense');
  const [category, setCategory] = useState(transaction?.category || 'Food');
  const [date, setDate] = useState(transaction?.date ? formatDateForInput(transaction.date) : formatDateForInput(new Date()));

  if (!isOpen) return null;

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'Expense') {
      setCategory('Food');
    } else {
      setCategory('Income');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !amount || isNaN(amount) || !date) return;

    // Convert amount to negative if expense
    const finalAmount = type === 'Expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount));

    onSubmit({
      name: name.trim(),
      amount: finalAmount,
      category,
      type,
      date: new Date(date).toISOString()
    });
  };

  const categories = type === 'Expense' ? expenseCategories : incomeCategories;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">
            {transaction ? 'Edit Transaction' : 'New Transaction'}
          </h3>
          <button 
            onClick={onClose} 
            className="modal-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Transaction Type Toggle */}
          <div>
            <label className="modal-label mb-2">Type</label>
            <div className="modal-toggle-container">
              <button
                type="button"
                onClick={() => handleTypeChange('Expense')}
                className={`modal-toggle-btn ${
                  type === 'Expense' 
                    ? 'modal-toggle-btn-expense' 
                    : 'modal-toggle-btn-inactive'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('Income')}
                className={`modal-toggle-btn ${
                  type === 'Income' 
                    ? 'modal-toggle-btn-income' 
                    : 'modal-toggle-btn-inactive'
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="modal-label">Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Grocery Store, Salary, Netflix"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="modal-input"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="modal-label">Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              required
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="modal-input font-medium"
            />
          </div>

          {/* Date */}
          <div>
            <label className="modal-label">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="modal-input"
            />
          </div>

          {/* Category */}
          <div>
            <label className="modal-label">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="modal-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="modal-btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn-submit"
            >
              {transaction ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
