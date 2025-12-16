import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import MemberForm from './pages/MemberForm';
import MemberDetail from './pages/MemberDetail';
import Sessions from './pages/Sessions';
import Attendance from './pages/Attendance';
import Login from './pages/Login';
import Settings from './pages/Settings';
import { checkAuth, seedData } from './services/storage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for auth token
    const auth = checkAuth();
    setIsAuthenticated(auth);
    // Seed mock data for demo if empty
    seedData();
    setLoading(false);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;

  return (
    <HashRouter>
      {isAuthenticated ? (
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/members/new" element={<MemberForm />} />
            <Route path="/members/:id" element={<MemberDetail />} />
            <Route path="/members/edit/:id" element={<MemberForm />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/attendance/:sessionId" element={<Attendance />} />
            <Route path="/settings" element={<Settings onLogout={() => setIsAuthenticated(false)} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </HashRouter>
  );
};

export default App;