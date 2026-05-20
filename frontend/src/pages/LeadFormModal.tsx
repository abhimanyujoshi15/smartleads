import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import type { Lead, LeadStatus, LeadSource } from '../types'; //  Correct, tells Vite to completely strip this at runtime

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  editingLead: Lead | null;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({ isOpen, onClose, onSaveSuccess, editingLead }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<LeadStatus>('New');
  const [source, setSource] = useState<LeadSource>('Website');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingLead) {
      setName(editingLead.name);
      setEmail(editingLead.email);
      setStatus(editingLead.status);
      setSource(editingLead.source);
    } else {
      setName('');
      setEmail('');
      setStatus('New');
      setSource('Website');
    }
    setErrors({});
  }, [editingLead, isOpen]);

  const validateForm = () => {
    const activeErrors: { name?: string; email?: string } = {};
    if (!name.trim()) activeErrors.name = 'Name field cannot be left empty.';
    if (!email.trim()) {
      activeErrors.email = 'Email structure verification needed.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      activeErrors.email = 'Please provide a valid email format.';
    }
    setErrors(activeErrors);
    return Object.keys(activeErrors).length === 0;
  };

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = { name, email, status, source };
      if (editingLead) {
        await api.put(`/leads/${editingLead._id}`, payload);
      } else {
        await api.post('/leads', payload);
      }
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error('Error recording lead updates:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingLead ? 'Edit Lead Metrics' : 'Create New Lead Entry'}>
      <form onSubmit={handleFormSubmission} className="flex flex-col gap-4">
        <Input label="Lead Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Funnel Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as LeadStatus)}
            className="px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Acquisition Source</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as LeadSource)}
            className="px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
        </div>

        <div className="flex gap-3 justify-end mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
          >
            {submitting ? 'Saving changes...' : 'Save Lead'}
          </button>
        </div>
      </form>
    </Modal>
  );
};