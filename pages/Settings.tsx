import React from 'react';
import Header from '../components/Header';
import { logout } from '../services/storage';
import { LogOut } from 'lucide-react';

interface SettingsProps {
    onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onLogout }) => {
  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Settings" />
      <div className="p-4">
        <div className="bg-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 text-red-600 font-medium transition-colors"
            >
                <LogOut size={20} />
                Sign Out
            </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-8">MemberTracker Pro v1.0.0</p>
      </div>
    </div>
  );
};

export default Settings;