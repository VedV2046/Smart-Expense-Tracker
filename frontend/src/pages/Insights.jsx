import { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, AlertCircle, TrendingUp, Sparkles } from 'lucide-react';

export default function Insights() {
  const [allTransactions, setAllTransactions] = useState([]);

  useEffect(() => {
    axios.get('/api/transactions')
      .then(res => setAllTransactions(res.data))
      .catch(err => {
        console.error("Error fetching transactions:", err);
        // Fallback dummy data if DB is not connected
        setAllTransactions([
          { id: 1, name: 'Grocery Store', category: 'Food', amount: -120.50, date: new Date().toISOString() },
          { id: 2, name: 'Salary', category: 'Income', amount: 4200.00, date: new Date().toISOString() },
          { id: 3, name: 'Electric Bill', category: 'Utilities', amount: -85.00, date: new Date().toISOString() },
          { id: 4, name: 'Netflix', category: 'Entertainment', amount: -15.99, date: new Date().toISOString() },
          { id: 5, name: 'Gas Station', category: 'Travel', amount: -45.00, date: new Date().toISOString() },
          { id: 6, name: 'Freelance Client', category: 'Income', amount: 800.00, date: new Date().toISOString() },
          { id: 7, name: 'Restaurant', category: 'Food', amount: -65.30, date: new Date().toISOString() }
        ]);
      });
  }, []);

  const totalIncome = allTransactions
    .filter(t => Number(t.amount) > 0)
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpenses = Math.abs(
    allTransactions
      .filter(t => Number(t.amount) < 0)
      .reduce((acc, curr) => acc + Number(curr.amount), 0)
  );

  const currentSavings = totalIncome > totalExpenses ? totalIncome - totalExpenses : 0;

  // Predict End of Month
  const getProjectedEnd = () => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const currentDay = today.getDate();
    
    // Calculate expense velocity
    const dailyExpenseRate = totalExpenses / (currentDay || 1);
    const projectedExpenses = dailyExpenseRate * daysInMonth;
    
    // Assume income is static
    const projectedSavings = totalIncome - projectedExpenses;
    return projectedSavings > 0 ? projectedSavings : 0;
  };

  const projectedSavings = getProjectedEnd();

  // Calculate category aggregates
  const categoryExpenses = {};
  allTransactions
    .filter(t => Number(t.amount) < 0)
    .forEach(tx => {
      const cat = tx.category || 'Other';
      categoryExpenses[cat] = (categoryExpenses[cat] || 0) + Math.abs(Number(tx.amount));
    });

  // Sort categories by expenditure
  const topCategories = Object.entries(categoryExpenses)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Dynamic budget recommendations
  const budgets = {
    Food: 3000,
    Travel: 2500,
    Utilities: 2000,
    Entertainment: 1500,
    Bills: 4000,
    Housing: 8000,
    Other: 2000
  };

  const budgetRecommendations = Object.keys(budgets).map(category => {
    const spent = categoryExpenses[category] || 0;
    const limit = budgets[category];
    const pct = Math.min(100, Math.round((spent / limit) * 100));
    
    let status = 'On Track';
    let statusColor = 'text-tertiary';
    let progressColor = 'bg-tertiary';
    let advice = 'Well within recommended budget limit.';

    if (pct >= 85) {
      status = `Reduce by ₹${Math.round(spent - limit * 0.8).toLocaleString()}`;
      statusColor = 'text-error';
      progressColor = 'bg-error';
      advice = 'Approaching or exceeding monthly cap limit!';
    } else if (pct >= 60) {
      status = 'Watch closely';
      statusColor = 'text-secondary';
      progressColor = 'bg-secondary';
      advice = 'Consuming moderate portion of the cap.';
    }

    return {
      category,
      spent,
      limit,
      pct,
      status,
      statusColor,
      progressColor,
      advice
    };
  }).filter(b => b.spent > 0);

  // Dynamic smart analysis list
  const getSmartAnalysis = () => {
    const insights = [];

    // Food insight
    const foodSpent = categoryExpenses['Food'] || 0;
    if (totalExpenses > 0 && foodSpent / totalExpenses > 0.35) {
      insights.push({
        type: 'warning',
        title: 'High Food Expenditure',
        message: `Dining and food accounts for ${Math.round((foodSpent / totalExpenses) * 100)}% of your total outlays. Try budgeting meal preps or shopping sales.`,
        icon: <AlertCircle className="text-error" />
      });
    }

    // Savings insight
    const savingsRate = totalIncome > 0 ? (currentSavings / totalIncome) * 100 : 0;
    if (savingsRate >= 20) {
      insights.push({
        type: 'positive',
        title: 'Healthy Savings Rate',
        message: `Superb work! You are saving ${Math.round(savingsRate)}% of your total earnings, surpassing the standard 20% savings rule.`,
        icon: <TrendingUp className="text-tertiary" />
      });
    } else if (totalIncome > 0) {
      insights.push({
        type: 'info',
        title: 'Savings Potential',
        message: `Your savings rate is currently ${Math.round(savingsRate)}%. Setting aside small, automatic contributions could bump you closer to the recommended 20%.`,
        icon: <Sparkles className="text-secondary" />
      });
    }

    // Subscriptions count insight
    const subscriptionsCount = allTransactions.filter(t => t.category === 'Entertainment').length;
    if (subscriptionsCount >= 3) {
      insights.push({
        type: 'info',
        title: 'Review Entertainment Bills',
        message: `You recorded ${subscriptionsCount} transactions under 'Entertainment'. Audit active subscription duplicates to free up monthly cash flow.`,
        icon: <AlertCircle className="text-secondary" />
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: 'info',
        title: 'Awaiting Financial Activity',
        message: 'No unusual spending patterns identified yet. Keep logging expenses to unlock deeper smart analysis.',
        icon: <Sparkles className="text-secondary" />
      });
    }

    return insights;
  };

  const smartAnalysisList = getSmartAnalysis();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-primary">Financial Insights</h1>
        <p className="text-on-surface-variant mt-1">AI-powered analysis of your spending habits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Insights Panel */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-surface p-6 rounded-2xl shadow-level-1 border border-outline-variant/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Brain size={120} />
            </div>
            
            <h2 className="text-xl font-heading font-semibold text-primary mb-6 flex items-center gap-2">
              <Brain className="text-secondary" />
              <span>Smart Analysis</span>
            </h2>
            
            <div className="space-y-4 relative z-10">
              {smartAnalysisList.map((item, index) => (
                <InsightItem 
                  key={index}
                  type={item.type}
                  title={item.title}
                  message={item.message}
                  icon={item.icon}
                />
              ))}
            </div>
          </div>

          <div className="bg-surface p-6 rounded-2xl shadow-level-1 border border-outline-variant/30">
             <h2 className="text-xl font-heading font-semibold text-primary mb-4">Budget Recommendations</h2>
             <div className="space-y-4">
                {budgetRecommendations.map((b) => (
                  <div key={b.category} className="p-4 border border-outline-variant/30 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-primary">{b.category}</span>
                      <span className={`${b.statusColor} font-medium text-sm`}>{b.status}</span>
                    </div>
                    <div className="w-full bg-surface-dim rounded-full h-2 mb-2">
                      <div className={`${b.progressColor} h-2 rounded-full`} style={{ width: `${b.pct}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-on-surface-variant">
                      <span>Spent ₹{b.spent.toLocaleString()} of ₹{b.limit.toLocaleString()}</span>
                      <span>{b.advice}</span>
                    </div>
                  </div>
                ))}
                {budgetRecommendations.length === 0 && (
                  <p className="text-sm text-on-surface-variant text-center py-6">No budget data available. Record some expenses first!</p>
                )}
             </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-2xl shadow-level-1 border border-outline-variant/30 bg-gradient-to-br from-primary to-[#1e293b] text-white">
            <h3 className="font-heading font-semibold mb-2">Predicted End of Month</h3>
            <div className="text-3xl font-bold font-heading mb-4">₹{projectedSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-sm text-gray-300">Based on your current spending velocity, you are projected to end the month with ₹{projectedSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })} in savings.</p>
          </div>

          <div className="bg-surface p-6 rounded-2xl shadow-level-1 border border-outline-variant/30">
            <h3 className="font-heading font-semibold text-primary mb-4">Top Spending Categories</h3>
            <ul className="space-y-4">
              {topCategories.slice(0, 5).map(({ category, amount }) => (
                <li key={category} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <span className="text-sm font-medium">{category}</span>
                  </div>
                  <span className="text-sm font-bold text-primary">₹{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </li>
              ))}
              {topCategories.length === 0 && (
                <p className="text-xs text-on-surface-variant text-center py-4">No categories spent on yet.</p>
              )}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

function InsightItem({ type, title, message, icon }) {
  const bgColors = {
    warning: 'bg-error/10 border-error/20',
    positive: 'bg-tertiary/10 border-tertiary/20',
    info: 'bg-secondary/10 border-secondary/20'
  };

  return (
    <div className={`p-4 rounded-xl border flex gap-4 ${bgColors[type]}`}>
      <div className="mt-1">{icon}</div>
      <div>
        <h4 className="font-semibold text-primary mb-1">{title}</h4>
        <p className="text-sm text-on-surface-variant leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
