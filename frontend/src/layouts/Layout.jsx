import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, List, PieChart, Wallet } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <List size={20} /> },
    { name: 'Insights', path: '/insights', icon: <PieChart size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-background font-sans text-on-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-outline-variant/30 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary text-white p-2 rounded-lg">
            <Wallet size={24} />
          </div>
          <span className="font-heading font-bold text-xl text-primary">FinTrack</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-secondary/10 text-secondary font-medium' 
                    : 'text-on-surface-variant hover:bg-surface-dim/30'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6 border-t border-outline-variant/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-dim flex items-center justify-center text-primary font-bold">
              U
            </div>
            <div>
              <p className="text-sm font-medium">User Name</p>
              <p className="text-xs text-on-surface-variant">user@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-surface p-4 border-b border-outline-variant/30 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wallet className="text-primary" size={20} />
            <span className="font-heading font-bold text-lg text-primary">FinTrack</span>
          </div>
          <button className="p-2 bg-surface-dim rounded-md">
             <Home size={20}/>
          </button>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-container-max mx-auto">
             <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
