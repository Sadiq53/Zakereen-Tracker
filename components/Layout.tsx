import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, Users, CalendarCheck, Settings, Plus } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide nav on login page
  if (location.pathname === '/login') {
    return <div className="min-h-screen bg-background text-secondary">{children}</div>;
  }

  const navItems = [
    { path: '/', icon: LayoutGrid, label: 'Dash' },
    { path: '/members', icon: Users, label: 'Members' },
    { path: '/sessions', icon: CalendarCheck, label: 'Sessions' },
    // { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-secondary">
      {/* Main Content Area */}
      <main className="flex-1 pb-24 overflow-y-auto no-scrollbar">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200 px-6 py-3 pb-6 shadow-lg z-50">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${
                  active ? 'text-primary' : 'text-gray-400'
                }`}
              >
                <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
          
          <button
            onClick={() => navigate('/settings')}
             className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${
                  location.pathname === '/settings' ? 'text-primary' : 'text-gray-400'
                }`}
          >
             <Settings size={24} strokeWidth={location.pathname === '/settings' ? 2.5 : 2} />
             <span className="text-[10px] font-medium">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Layout;