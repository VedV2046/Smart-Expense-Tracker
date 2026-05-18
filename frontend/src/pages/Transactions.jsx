import { useState } from 'react';
import { Search, Filter, Plus, FileDown } from 'lucide-react';

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy Data
  const allTransactions = [
    { id: 1, name: 'Grocery Store', category: 'Food', amount: -120.50, date: 'May 18, 2026', type: 'Expense' },
    { id: 2, name: 'Salary', category: 'Income', amount: 4200.00, date: 'May 17, 2026', type: 'Income' },
    { id: 3, name: 'Electric Bill', category: 'Bills', amount: -85.00, date: 'May 15, 2026', type: 'Expense' },
    { id: 4, name: 'Netflix', category: 'Entertainment', amount: -15.99, date: 'May 12, 2026', type: 'Expense' },
    { id: 5, name: 'Gas Station', category: 'Travel', amount: -45.00, date: 'May 10, 2026', type: 'Expense' },
    { id: 6, name: 'Freelance Client', category: 'Income', amount: 800.00, date: 'May 08, 2026', type: 'Income' },
    { id: 7, name: 'Restaurant', category: 'Food', amount: -65.30, date: 'May 05, 2026', type: 'Expense' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary">Transactions</h1>
          <p className="text-on-surface-variant mt-1">View and manage all your income and expenses.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-surface border border-outline-variant text-primary px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-dim/30 transition-colors">
            <FileDown size={18} />
            <span>Export</span>
          </button>
          <button className="flex-1 md:flex-none bg-primary text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
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
          <select className="flex-1 md:flex-none bg-surface border border-outline-variant/50 rounded-lg px-4 py-2 text-sm focus:outline-none">
            <option>All Types</option>
            <option>Income</option>
            <option>Expenses</option>
          </select>
          <select className="flex-1 md:flex-none bg-surface border border-outline-variant/50 rounded-lg px-4 py-2 text-sm focus:outline-none">
            <option>All Categories</option>
            <option>Food</option>
            <option>Travel</option>
            <option>Bills</option>
          </select>
          <button className="p-2 border border-outline-variant/50 rounded-lg hover:bg-surface-dim/30 text-on-surface-variant">
            <Filter size={18} />
          </button>
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
              {allTransactions.map((tx) => (
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
                    {tx.type}
                  </td>
                  <td className="py-4 px-6 text-on-surface-variant">{tx.date}</td>
                  <td className={`py-4 px-6 text-right font-medium ${tx.amount > 0 ? 'text-tertiary' : 'text-primary'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button className="text-secondary hover:underline text-xs font-medium mr-3">Edit</button>
                    <button className="text-error hover:underline text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
