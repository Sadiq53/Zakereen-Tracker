import React, { useState } from 'react';
import { login } from '../services/storage';
import { Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      onLogin();
      navigate('/');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        
        <div className="bg-surface p-8 rounded-3xl shadow-soft border border-white/50 space-y-8">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary shadow-sm transform rotate-3">
                <Lock size={32} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back</h1>
              <p className="text-gray-500 text-sm">MemberTracker Pro Admin</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Enter access code"
                error={error ? "Incorrect password" : undefined}
                className="text-center tracking-widest text-lg"
              />

              <button
                type="submit"
                className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Unlock Dashboard</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
        </div>
        
        <div className="text-center mt-8">
           <p className="text-xs font-medium text-gray-400 bg-gray-100 inline-block px-3 py-1 rounded-full">Demo: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;