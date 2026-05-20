import React, { useState } from 'react';
import { api, useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { UserPlus } from 'lucide-react';
import type { UserRole } from '../types';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Sales User');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('All fields are mandatory to create an account.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      const { token, data } = response.data;
      login(token, data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check your data.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-md p-8 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-2">S</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-sm text-slate-500">Sign up to access the SmartLeads workspace</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Full Name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email Address" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Workspace Assignment Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
            >
              <option value="Sales User">Sales User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <UserPlus size={18} />
            {submitting ? 'Creating Profile...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already registered?{' '}
          <button onClick={onSwitchToLogin} className="text-blue-600 hover:underline font-medium focus:outline-none">
            Log In here
          </button>
        </div>
      </div>
    </div>
  );
};