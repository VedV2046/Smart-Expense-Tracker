import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, List, PieChart, Wallet, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <List size={20} /> },
    { name: 'Insights', path: '/insights', icon: <PieChart size={20} /> },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
    }
  };

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
        
        {/* User Profile Area */}
        <div className="p-6 border-t border-outline-variant/30 flex justify-between items-center gap-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-primary">{user?.name || 'User Name'}</p>
              <p className="text-xs text-on-surface-variant truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            title="Log Out"
            className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-all shrink-0"
          >
            <LogOut size={18} />
          </button>
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
          <div className="flex items-center gap-2">
            <button 
              onClick={handleLogout}
              className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-md transition-all"
              title="Log Out"
            >
               <LogOut size={20}/>
            </button>
          </div>
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
