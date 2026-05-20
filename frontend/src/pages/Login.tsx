import React, { useState } from 'react';
import { api, useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { LogIn } from 'lucide-react';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, data } = response.data;
      login(token, data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-md p-8 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-2">S</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
          <p className="text-sm text-slate-500">Sign in to manage your smart leads dashboard</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn size={18} />
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          New to the platform?{' '}
          <button onClick={onSwitchToRegister} className="text-blue-600 hover:underline font-medium focus:outline-none">
            Create an account here
          </button>
        </div>
      </div>
    </div>
  );
};