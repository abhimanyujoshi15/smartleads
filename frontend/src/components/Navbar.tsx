import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Sun, Moon, ShieldAlert } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  //  Fix: Pull the correct state names 'theme' and 'toggleTheme' from context
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
        <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">SmartLeads</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme} //  Fix: Call toggleTheme
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle Theme"
        >
          {/* Fix: Evaluate if theme is exactly 'dark' */}
          {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
        </button>

        <div className="flex items-center gap-2 border-l pl-4 border-slate-200 dark:border-slate-800">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-slate-500 flex items-center justify-end gap-1">
              {user?.role === 'Admin' && <ShieldAlert size={12} className="text-amber-500" />}
              {user?.role}
            </p>
          </div>
          <button
            onClick={logout}
            className="ml-2 p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
            title="Log Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};