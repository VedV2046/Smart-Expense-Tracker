import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Plus, Trash2 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import TransactionModal from '../components/TransactionModal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState('This Month');
  const [allTransactions, setAllTransactions] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTransactions = () => {
    axios.get('http://localhost:5000/api/transactions')
      .then(res => {
        setAllTransactions(res.data);
        setRecentTransactions(res.data.slice(0, 4));
      })
      .catch(err => {
        console.error("Error fetching transactions:", err);
        const dummy = [
          { id: 1, name: 'Grocery Store', category: 'Food', amount: -120.50, date: new Date().toISOString() },
          { id: 2, name: 'Salary', category: 'Income', amount: 4200.00, date: new Date().toISOString() },
          { id: 3, name: 'Electric Bill', category: 'Utilities', amount: -85.00, date: new Date().toISOString() },
          { id: 4, name: 'Netflix', category: 'Entertainment', amount: -15.99, date: new Date().toISOString() },
        ];
        setAllTransactions(dummy);
        setRecentTransactions(dummy.slice(0, 4));
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = async (newTx) => {
    try {
      await axios.post('http://localhost:5000/api/transactions', newTx);
      fetchTransactions();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  const handleResetData = async () => {
    if (window.confirm("Are you sure you want to reset all data? This will permanently delete all income and expense records.")) {
      try {
        await axios.delete('http://localhost:5000/api/transactions');
        fetchTransactions();
      } catch (err) {
        console.error("Error resetting data:", err);
      }
    }
  };

  // Color map for categories
  const categoryColors = {
    Food: '#3b82f6',
    Income: '#10b981',
    Salary: '#10b981',
    Freelance: '#059669',
    Investment: '#047857',
    Utilities: '#f59e0b',
    Entertainment: '#8b5cf6',
    Bills: '#ef4444',
    Travel: '#0f172a',
    Housing: '#6366f1',
    Other: '#76777d'
  };

  // Dynamically calculate summary stats based on selected timeframe
  const getFilteredTransactions = () => {
    const now = new Date();
    return allTransactions.filter(tx => {
      const txDate = new Date(tx.date);
      if (timeframe === 'This Week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return txDate >= oneWeekAgo;
      } else if (timeframe === 'This Year') {
        return txDate.getFullYear() === now.getFullYear();
      }
      // This Month (default)
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    });
  };

  const filteredTxs = getFilteredTransactions();

  const summary = {
    income: filteredTxs.filter(t => Number(t.amount) > 0).reduce((acc, curr) => acc + Number(curr.amount), 0),
    expenses: Math.abs(filteredTxs.filter(t => Number(t.amount) < 0).reduce((acc, curr) => acc + Number(curr.amount), 0)),
  };
  summary.balance = summary.income - summary.expenses;
  summary.savings = summary.income > summary.expenses ? summary.income - summary.expenses : 0;

  // Dynamically group expenses by category for Doughnut chart
  const getDoughnutData = () => {
    const expenses = filteredTxs.filter(t => Number(t.amount) < 0);
    const categorySums = {};
    expenses.forEach(tx => {
      const cat = tx.category || 'Other';
      categorySums[cat] = (categorySums[cat] || 0) + Math.abs(Number(tx.amount));
    });

    const labels = Object.keys(categorySums);
    const data = Object.values(categorySums);
    const bgColors = labels.map(cat => categoryColors[cat] || '#76777d');

    return {
      labels: labels.length ? labels : ['No Expenses'],
      datasets: [{
        data: data.length ? data : [0],
        backgroundColor: bgColors.length ? bgColors : ['#c6c6cd'],
        borderWidth: 0,
      }]
    };
  };

  // Chronological Cash Flow for Line chart
  const getLineChartData = () => {
    const sorted = [...filteredTxs].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const dataByDate = {};
    let runningIncome = 0;
    let runningExpenses = 0;

    sorted.forEach(tx => {
      const d = new Date(tx.date);
      const label = `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
      const val = Number(tx.amount);
      if (val > 0) {
        runningIncome += val;
      } else {
        runningExpenses += Math.abs(val);
      }
      dataByDate[label] = { income: runningIncome, expenses: runningExpenses };
    });

    const labels = Object.keys(dataByDate);
    const incomeData = labels.map(l => dataByDate[l].income);
    const expenseData = labels.map(l => dataByDate[l].expenses);

    return {
      labels: labels.length ? labels : ['No Data'],
      datasets: [
        {
          label: 'Income',
          data: incomeData.length ? incomeData : [0],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Expenses',
          data: expenseData.length ? expenseData : [0],
          borderColor: '#ba1a1a',
          backgroundColor: 'rgba(186, 26, 26, 0.1)',
          tension: 0.4,
          fill: true,
        }
      ]
    };
  };

  const lineChartData = getLineChartData();
  const doughnutData = getDoughnutData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { border: { display: false }, grid: { color: '#f2f4f6' } },
      x: { border: { display: false }, grid: { display: false } }
    }
  };

  const doughnutOptions = {
    cutout: '75%',
    plugins: { legend: { display: false } }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary">Overview</h1>
          <p className="text-on-surface-variant mt-1">Here's your financial summary for {timeframe.toLowerCase()}.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <select 
            className="bg-surface border border-outline-variant rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-secondary"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
          <button 
            onClick={handleResetData}
            className="bg-surface border border-error/30 text-error px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-error/5 transition-colors"
          >
            <Trash2 size={18} />
            <span>Reset Data</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-error text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-error/90 transition-colors"
          >
            <Plus size={18} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Total Balance" 
          amount={`₹${summary.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          trend="" 
          isPositive={summary.balance >= 0}
          icon={<Wallet className="text-primary" />}
        />
        <SummaryCard 
          title="Income" 
          amount={`₹${summary.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          trend="" 
          isPositive={true}
          icon={<ArrowUpRight className="text-tertiary" />}
        />
        <SummaryCard 
          title="Expenses" 
          amount={`₹${summary.expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          trend="" 
          isPositive={false}
          icon={<ArrowDownRight className="text-error" />}
        />
        <SummaryCard 
          title="Total Savings" 
          amount={`₹${summary.savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          trend="" 
          isPositive={true}
          icon={<TrendingUp className="text-secondary" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart */}
        <div className="lg:col-span-2 bg-surface p-6 rounded-2xl shadow-level-1 border border-outline-variant/30">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-heading font-semibold text-primary">Cash Flow</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                <span>Income</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-error"></span>
                <span>Expenses</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="bg-surface p-6 rounded-2xl shadow-level-1 border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-heading font-semibold text-primary mb-6">Spending</h2>
            <div className="w-[200px] h-[200px] mx-auto relative mb-6">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-on-surface-variant font-medium">Total Spent</span>
                <span className="text-xl font-bold font-heading text-primary">₹{summary.expenses.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
          {/* Custom Legend */}
          <div className="flex flex-wrap gap-2 justify-center text-[11px]">
            {doughnutData.labels.map((label, i) => {
              if (label === 'No Expenses') return null;
              const val = doughnutData.datasets[0].data[i];
              const color = doughnutData.datasets[0].backgroundColor[i];
              return (
                <div key={label} className="flex items-center gap-1 px-2 py-0.5 bg-surface-dim/20 rounded-md">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                  <span className="text-on-surface-variant font-medium">{label}</span>
                  <span className="font-semibold text-primary">₹{val.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-3 bg-surface p-6 rounded-2xl shadow-level-1 border border-outline-variant/30">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-heading font-semibold text-primary">Recent Transactions</h2>
            <a href="/transactions" className="text-secondary text-sm font-medium hover:underline">View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/50 text-sm text-on-surface-variant">
                  <th className="pb-3 font-medium">Transaction</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-outline-variant/20 last:border-0 hover:bg-surface-dim/20 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: categoryColors[tx.category] || '#0f172a' }}>
                          {tx.name ? tx.name.charAt(0).toUpperCase() : 'T'}
                        </div>
                        <span className="font-medium text-primary">{tx.name}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface-dim text-on-surface-variant">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-on-surface-variant">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className={`py-4 text-right font-medium ${Number(tx.amount) > 0 ? 'text-tertiary' : 'text-primary'}`}>
                      {Number(tx.amount) > 0 ? '+' : ''}₹{Math.abs(Number(tx.amount)).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-on-surface-variant">No transactions found. Click Add Expense to create one!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TransactionModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTransaction}
        />
      )}
    </div>
  );
}

function SummaryCard({ title, amount, trend, isPositive, icon }) {
  return (
    <div className="bg-surface p-6 rounded-2xl shadow-level-1 border border-outline-variant/30">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-xl bg-surface-dim/50">
          {icon}
        </div>
        {trend && (
          <div className={`px-2 py-1 rounded-md text-xs font-medium ${isPositive ? 'bg-tertiary/10 text-tertiary' : 'bg-error/10 text-error'}`}>
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-on-surface-variant font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-heading font-bold text-primary">{amount}</h3>
      </div>
    </div>
  );
}
