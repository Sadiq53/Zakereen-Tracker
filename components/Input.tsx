import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`
            w-full bg-input hover:bg-white text-gray-900 placeholder:text-gray-400
            border border-transparent focus:border-primary/50 focus:bg-white 
            rounded-xl py-3.5 transition-all duration-200 ease-out outline-none
            focus:ring-4 focus:ring-primary/10 font-medium
            ${icon ? 'pl-10' : 'px-4'}
            ${error ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' : ''}
            ${className}
          `}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5 ml-1">{error}</p>}
    </div>
  );
};

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, className = '', children, ...props }) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            {...props}
            className={`
              w-full bg-input hover:bg-white text-gray-900 
              border border-transparent focus:border-primary/50 focus:bg-white 
              rounded-xl py-3.5 px-4 transition-all duration-200 ease-out outline-none
              focus:ring-4 focus:ring-primary/10 font-medium appearance-none
              ${className}
            `}
          >
            {children}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    );
  };
