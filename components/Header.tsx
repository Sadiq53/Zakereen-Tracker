import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, showBack, rightAction }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm h-14">
      <div className="flex items-center gap-2">
        {showBack && (
          <button 
            onClick={() => navigate(-1)}
            className="p-1 -ml-2 rounded-full hover:bg-gray-100 text-gray-600"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className="text-lg font-bold text-gray-900 truncate max-w-[200px]">{title}</h1>
      </div>
      <div>
        {rightAction}
      </div>
    </header>
  );
};

export default Header;