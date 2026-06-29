import React, { useState, useEffect, useCallback } from 'react';
import { api, useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { useDebounce } from '../hooks/useDebounce';
import { LeadFormModal } from './LeadFormModal';
import type { Lead, PaginationMeta } from '../types'; 
import { Search, Plus, Download, Edit2, Trash2, ChevronLeft, ChevronRight, Inbox, AlertTriangle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [sort, setSort] = useState<'Latest' | 'Oldest'>('Latest');
  const [page, setPage] = useState(1);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const debouncedSearchTerm = useDebounce(search, 400);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = { page, limit: 10, sort };
      if (debouncedSearchTerm) params.search = debouncedSearchTerm;
      if (status) params.status = status;
      if (source) params.source = source;

      const response = await api.get('/leads', { params });
      setLeads(response.data.data.leads);
      setMeta(response.data.meta);
    } catch (err: any) {
      setError('Could not retrieve information from server.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, status, source, sort, page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, status, source, sort]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Confirm permanent deletion of this lead record?')) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch (err) {
      alert('Action unauthorized or failed.');
    }
  };

  const triggerCSVDownload = () => {
  const token = localStorage.getItem('token');
  
  if (!token || token === 'undefined') {
    alert('Session expired. Please log out and sign back in.');
    return;
  }
  
  // Clean parameter streaming endpoint
  const API_URL = import.meta.env.VITE_API_URL || 'https://your-app.onrender.com';
  window.open(`${API_URL}/api/v1/leads/export?token=${encodeURIComponent(token)}`, '_blank');
};

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Core Actions Panel */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {user?.role === 'Admin' && (
              <button
                onClick={triggerCSVDownload}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition w-full sm:w-auto"
              >
                <Download size={16} /> Export CSV
              </button>
            )}
            <button
              onClick={() => { setEditingLead(null); setIsModalOpen(true); }}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition w-full sm:w-auto"
            >
              <Plus size={16} /> Add Lead
            </button>
          </div>
        </div>

        {/* Dynamic Filters Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>

          <select value={source} onChange={(e) => setSource(e.target.value)} className="px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="Latest">Sort by: Newest</option>
            <option value="Oldest">Sort by: Oldest</option>
          </select>
        </div>

        {/* Content Display Panels */}
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-2">
            <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Retrieving records from cluster...</p>
          </div>
        ) : error ? (
          <div className="h-64 flex flex-col items-center justify-center border border-dashed rounded-xl bg-red-50/50 dark:bg-red-950/10 border-red-200 dark:border-red-900 p-4 text-center">
            <AlertTriangle className="text-red-500 h-10 w-10 mb-2" />
            <h3 className="font-semibold text-red-800 dark:text-red-400">Query Exception Encountered</h3>
            <p className="text-sm text-red-600 dark:text-red-500 max-w-sm mt-1">{error}</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border border-dashed rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-4 text-center transition-colors">
            <Inbox className="text-slate-400 h-10 w-10 mb-2" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">No matching records found</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs mt-1">Try relaxing your search parameters or add a new lead.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm transition-colors">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Source</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                    <td className="p-4 font-medium text-slate-900 dark:text-white">{lead.name}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{lead.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        lead.status === 'New' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        lead.status === 'Contacted' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                        lead.status === 'Qualified' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
                        'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
                      }`}>{lead.status}</span>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{lead.source}</td>
                    <td className="p-4 text-right flex gap-2 justify-end">
                      <button onClick={() => { setEditingLead(lead); setIsModalOpen(true); }} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"><Edit2 size={16} /></button>
                      {user?.role === 'Admin' && (
                        <button onClick={() => handleDelete(lead._id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-500 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            {meta && meta.totalPages > 1 && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/10 transition-colors">
                <p className="text-xs text-slate-500 dark:text-slate-400">Showing page {meta.currentPage} of {meta.totalPages}</p>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-1.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><ChevronLeft size={16} /></button>
                  <button disabled={page === meta.totalPages} onClick={() => setPage(page + 1)} className="p-1.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><ChevronRight size={16} /></button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSaveSuccess={fetchLeads} editingLead={editingLead} />
    </div>
  );
};