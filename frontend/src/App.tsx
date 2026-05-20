import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

const App: React.FC = () => {
  const { token, loading } = useAuth();
  const [authView, setAuthView] = useState<'register' | 'login'>('register');

  // 1. Loading Safe-guard
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 2. Wrap all application view profiles in a strict global dark-mode container shell
  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-200">
      {!token ? (
        authView === 'register' ? (
          <Register onSwitchToLogin={() => setAuthView('login')} />
        ) : (
          <Login onSwitchToRegister={() => setAuthView('register')} />
        )
      ) : (
        <Dashboard />
      )}
    </div>
  );
};

export default App;