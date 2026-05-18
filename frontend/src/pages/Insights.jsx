import { Brain, AlertCircle, ArrowDown, TrendingUp } from 'lucide-react';

export default function Insights() {
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
              <InsightItem 
                type="warning"
                title="Unusual Spending Detected"
                message="You spent 30% more on Food this month compared to your average. Consider reviewing your recent restaurant transactions."
                icon={<AlertCircle className="text-error" />}
              />
              <InsightItem 
                type="positive"
                title="Savings Milestone"
                message="Great job! Your savings rate increased by 12% this month. You're on track to hit your yearly goal."
                icon={<TrendingUp className="text-tertiary" />}
              />
              <InsightItem 
                type="info"
                title="Subscription Alert"
                message="You have 3 active subscriptions under 'Entertainment'. Are you still using all of them?"
                icon={<AlertCircle className="text-secondary" />}
              />
            </div>
          </div>

          <div className="bg-surface p-6 rounded-2xl shadow-level-1 border border-outline-variant/30">
             <h2 className="text-xl font-heading font-semibold text-primary mb-4">Budget Recommendations</h2>
             <div className="space-y-4">
                <div className="p-4 border border-outline-variant/30 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-primary">Food & Dining</span>
                    <span className="text-error font-medium">Reduce by $150</span>
                  </div>
                  <div className="w-full bg-surface-dim rounded-full h-2 mb-2">
                    <div className="bg-error h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-on-surface-variant">Currently using 85% of recommended monthly budget.</p>
                </div>

                <div className="p-4 border border-outline-variant/30 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-primary">Shopping</span>
                    <span className="text-tertiary font-medium">On Track</span>
                  </div>
                  <div className="w-full bg-surface-dim rounded-full h-2 mb-2">
                    <div className="bg-tertiary h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <p className="text-xs text-on-surface-variant">Currently using 45% of recommended monthly budget.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-2xl shadow-level-1 border border-outline-variant/30 bg-gradient-to-br from-primary to-[#1e293b] text-white">
            <h3 className="font-heading font-semibold mb-2">Predicted End of Month</h3>
            <div className="text-3xl font-bold font-heading mb-4">$3,240.00</div>
            <p className="text-sm text-gray-300">Based on your current spending velocity, you are projected to end the month with $3,240 in savings.</p>
          </div>

          <div className="bg-surface p-6 rounded-2xl shadow-level-1 border border-outline-variant/30">
            <h3 className="font-heading font-semibold text-primary mb-4">Top Spending Categories</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm font-medium">Housing</span>
                </div>
                <span className="text-sm font-bold">$1,200</span>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <span className="text-sm font-medium">Food</span>
                </div>
                <span className="text-sm font-bold">$650</span>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                  <span className="text-sm font-medium">Transport</span>
                </div>
                <span className="text-sm font-bold">$300</span>
              </li>
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
