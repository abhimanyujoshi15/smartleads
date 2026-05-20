import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <input
        {...props}
        className={`px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 transition ${
          error 
            ? 'border-red-500 focus:ring-red-200' 
            : 'border-slate-300 dark:border-slate-700 focus:ring-blue-200'
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
};