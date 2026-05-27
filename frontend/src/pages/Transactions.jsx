import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, FileDown, Trash2 } from 'lucide-react';
import TransactionModal from '../components/TransactionModal';

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  
  const [allTransactions, setAllTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const fetchTransactions = () => {
    axios.get('/api/transactions')
      .then(res => setAllTransactions(res.data))
      .catch(err => {
        console.error("Error fetching transactions:", err);
        // Fallback dummy data if DB is not connected
        setAllTransactions([
          { id: 1, name: 'Grocery Store', category: 'Food', amount: -120.50, date: new Date().toISOString(), type: 'Expense' },
          { id: 2, name: 'Salary', category: 'Income', amount: 4200.00, date: new Date().toISOString(), type: 'Income' },
          { id: 3, name: 'Electric Bill', category: 'Utilities', amount: -85.00, date: new Date().toISOString(), type: 'Expense' },
          { id: 4, name: 'Netflix', category: 'Entertainment', amount: -15.99, date: new Date().toISOString(), type: 'Expense' },
          { id: 5, name: 'Gas Station', category: 'Travel', amount: -45.00, date: new Date().toISOString(), type: 'Expense' },
          { id: 6, name: 'Freelance Client', category: 'Income', amount: 800.00, date: new Date().toISOString(), type: 'Income' },
          { id: 7, name: 'Restaurant', category: 'Food', amount: -65.30, date: new Date().toISOString(), type: 'Expense' }
        ]);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleOpenAdd = () => {
    setSelectedTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tx) => {
    setSelectedTransaction(tx);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await axios.delete(`/api/transactions/${id}`);
        fetchTransactions();
      } catch (err) {
        console.error("Error deleting transaction:", err);
      }
    }
  };

  const handleResetData = async () => {
    if (window.confirm("Are you sure you want to reset all data? This will permanently delete all income and expense records.")) {
      try {
        await axios.delete('/api/transactions');
        fetchTransactions();
      } catch (err) {
        console.error("Error resetting data:", err);
      }
    }
  };

  const handleModalSubmit = async (txData) => {
    try {
      if (selectedTransaction) {
        // Edit mode
        await axios.put(`/api/transactions/${selectedTransaction.id}`, txData);
      } else {
        // Add mode
        await axios.post('/api/transactions', txData);
      }
      fetchTransactions();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving transaction:", err);
    }
  };

  // Filter transactions dynamically
  const filteredTransactions = allTransactions.filter(tx => {
    const matchesSearch = (tx.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (tx.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const isIncome = Number(tx.amount) > 0;
    const matchesType = selectedType === 'All Types' || 
                        (selectedType === 'Income' && isIncome) ||
                        (selectedType === 'Expenses' && !isIncome);
    
    const matchesCategory = selectedCategory === 'All Categories' || 
                            tx.category === selectedCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  // Extract unique categories from actual transactions for the filter dropdown
  const uniqueCategories = Array.from(new Set(allTransactions.map(tx => tx.category).filter(Boolean)));

  // Export transactions as CSV
  const handleExport = () => {
    const headers = ['ID', 'Description', 'Category', 'Type', 'Amount', 'Date'];
    const rows = filteredTransactions.map(tx => [
      tx.id,
      tx.name,
      tx.category,
      Number(tx.amount) > 0 ? 'Income' : 'Expense',
      tx.amount,
      new Date(tx.date).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transactions_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary">Transactions</h1>
          <p className="text-on-surface-variant mt-1">View and manage all your income and expenses.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto flex-wrap">
          <button 
            onClick={handleExport}
            className="flex-1 md:flex-none bg-surface border border-outline-variant text-primary px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-dim/30 transition-colors"
          >
            <FileDown size={18} />
            <span>Export</span>
          </button>
          <button 
            onClick={handleResetData}
            className="flex-1 md:flex-none bg-surface border border-error/30 text-error px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-error/5 transition-colors"
          >
            <Trash2 size={18} />
            <span>Reset Data</span>
          </button>
          <button 
            onClick={handleOpenAdd}
            className="flex-1 md:flex-none bg-error text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-error/90 transition-colors"
          >
            <Plus size={18} />
            <span>New Transaction</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-surface p-4 rounded-xl shadow-level-1 border border-outline-variant/30 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="w-full bg-surface-dim/30 border border-outline-variant/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-secondary focus:bg-surface"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="flex-1 md:flex-none bg-surface border border-outline-variant/50 rounded-lg px-4 py-2 text-sm focus:outline-none"
          >
            <option>All Types</option>
            <option>Income</option>
            <option>Expenses</option>
          </select>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 md:flex-none bg-surface border border-outline-variant/50 rounded-lg px-4 py-2 text-sm focus:outline-none"
          >
            <option>All Categories</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-surface rounded-2xl shadow-level-1 border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-surface-dim/20 border-b border-outline-variant/50 text-xs text-on-surface-variant uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Description</th>
                <th className="py-4 px-6 font-semibold">Category</th>
                <th className="py-4 px-6 font-semibold">Type</th>
                <th className="py-4 px-6 font-semibold">Date</th>
                <th className="py-4 px-6 font-semibold text-right">Amount</th>
                <th className="py-4 px-6 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredTransactions.map((tx) => {
                const isIncome = Number(tx.amount) > 0;
                return (
                  <tr key={tx.id} className="border-b border-outline-variant/20 last:border-0 hover:bg-surface-dim/10 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-medium text-primary">{tx.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface-dim text-on-surface-variant inline-block">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {isIncome ? 'Income' : 'Expense'}
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className={`py-4 px-6 text-right font-medium ${isIncome ? 'text-tertiary' : 'text-primary'}`}>
                      {isIncome ? '+' : ''}₹{Math.abs(Number(tx.amount)).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button 
                        onClick={() => handleOpenEdit(tx)}
                        className="text-secondary hover:underline text-xs font-medium mr-3"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(tx.id)}
                        className="text-error hover:underline text-xs font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-on-surface-variant font-medium">
                    No transactions found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <TransactionModal 
          key={selectedTransaction ? `edit-${selectedTransaction.id}` : 'new-tx'}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
}
