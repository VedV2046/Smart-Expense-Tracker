import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Plus } from 'lucide-react';
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
import { Line, Bar, Doughnut } from 'react-chartjs-2';

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

  // Dummy Data
  const summary = {
    balance: 12450.00,
    income: 4200.00,
    expenses: 1850.00,
    savings: 2350.00
  };

  const lineChartData = {
    labels: ['1', '5', '10', '15', '20', '25', '30'],
    datasets: [
      {
        label: 'Income',
        data: [1000, 1000, 1500, 1500, 3000, 3500, 4200],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Expenses',
        data: [200, 400, 600, 1100, 1300, 1600, 1850],
        borderColor: '#ba1a1a',
        backgroundColor: 'rgba(186, 26, 26, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const doughnutData = {
    labels: ['Housing', 'Food', 'Transport', 'Utilities', 'Entertainment'],
    datasets: [{
      data: [800, 400, 200, 150, 300],
      backgroundColor: [
        '#0f172a',
        '#3b82f6',
        '#10b981',
        '#f59e0b',
        '#8b5cf6'
      ],
      borderWidth: 0,
    }]
  };

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
    plugins: { legend: { position: 'bottom' } }
  };

  const recentTransactions = [
    { id: 1, name: 'Grocery Store', category: 'Food', amount: -120.50, date: 'Today, 10:30 AM', color: '#3b82f6' },
    { id: 2, name: 'Salary', category: 'Income', amount: 4200.00, date: 'Yesterday', color: '#10b981' },
    { id: 3, name: 'Electric Bill', category: 'Utilities', amount: -85.00, date: 'May 15', color: '#f59e0b' },
    { id: 4, name: 'Netflix', category: 'Entertainment', amount: -15.99, date: 'May 12', color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary">Overview</h1>
          <p className="text-on-surface-variant mt-1">Here's your financial summary for {timeframe.toLowerCase()}.</p>
        </div>
        <div className="flex gap-3">
          <select 
            className="bg-surface border border-outline-variant rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-secondary"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
          <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <Plus size={18} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Total Balance" 
          amount={`$${summary.balance.toLocaleString()}`} 
          trend="+5.2%" 
          isPositive={true}
          icon={<Wallet className="text-primary" />}
        />
        <SummaryCard 
          title="Income" 
          amount={`$${summary.income.toLocaleString()}`} 
          trend="+12.5%" 
          isPositive={true}
          icon={<ArrowUpRight className="text-tertiary" />}
        />
        <SummaryCard 
          title="Expenses" 
          amount={`$${summary.expenses.toLocaleString()}`} 
          trend="-2.4%" 
          isPositive={true}
          icon={<ArrowDownRight className="text-error" />}
        />
        <SummaryCard 
          title="Total Savings" 
          amount={`$${summary.savings.toLocaleString()}`} 
          trend="+8.1%" 
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
        <div className="bg-surface p-6 rounded-2xl shadow-level-1 border border-outline-variant/30">
          <h2 className="text-xl font-heading font-semibold text-primary mb-6">Spending</h2>
          <div className="h-[250px] relative">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-30px]">
              <span className="text-sm text-on-surface-variant">Total</span>
              <span className="text-2xl font-bold font-heading text-primary">$1,850</span>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-3 bg-surface p-6 rounded-2xl shadow-level-1 border border-outline-variant/30">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-heading font-semibold text-primary">Recent Transactions</h2>
            <button className="text-secondary text-sm font-medium hover:underline">View All</button>
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
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: tx.color }}>
                          {tx.name.charAt(0)}
                        </div>
                        <span className="font-medium text-primary">{tx.name}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface-dim text-on-surface-variant">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-on-surface-variant">{tx.date}</td>
                    <td className={`py-4 text-right font-medium ${tx.amount > 0 ? 'text-tertiary' : 'text-primary'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
        <div className={`px-2 py-1 rounded-md text-xs font-medium ${isPositive ? 'bg-tertiary/10 text-tertiary' : 'bg-error/10 text-error'}`}>
          {trend}
        </div>
      </div>
      <div>
        <p className="text-sm text-on-surface-variant font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-heading font-bold text-primary">{amount}</h3>
      </div>
    </div>
  );
}
