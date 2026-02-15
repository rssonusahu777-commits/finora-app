import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Transaction, TransactionType } from '../types';
import * as db from '../services/db';
import { EXPENSE_CATEGORIES, INCOME_SOURCES } from '../constants';
import { Trash2, Plus, Filter, Search } from 'lucide-react';

interface Props {
  type: TransactionType;
}

const TransactionsPage: React.FC<Props> = ({ type }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterMonth, setFilterMonth] = useState<string>('');
  
  // Form State
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchTransactions = async () => {
    if (!user) return;
    setLoading(true);
    const data = await db.dbGetTransactions(user.id);
    setTransactions(data.filter(t => t.type === type));
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [type, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await db.dbAddTransaction({
      userId: user.id,
      type,
      amount: parseFloat(amount),
      category,
      description,
      date
    });

    setShowForm(false);
    setAmount('');
    setDescription('');
    fetchTransactions();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this transaction?')) {
      await db.dbDeleteTransaction(id);
      fetchTransactions();
    }
  };

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_SOURCES;

  const filteredTransactions = transactions.filter(t => {
      if(!filterMonth) return true;
      return t.date.startsWith(filterMonth);
  });

  const formatMoney = (amount: number) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: user?.currency || 'USD' }).format(amount);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{type}s</h1>
            <p className="text-gray-500 text-sm">Manage your {type} records efficiently.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm shadow-primary-600/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus size={18} /> Add {type}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-fade-in mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-900">New {type === 'income' ? 'Income' : 'Expense'} Entry</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">Cancel</button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount</label>
              <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 font-bold">$</span>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select 
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
              <input 
                type="date" 
                required 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description (Optional)</label>
              <input 
                type="text" 
                placeholder="What was this for?"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 shadow-sm">Save Transaction</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-500">
                <Filter size={16} />
                <span className="text-sm font-medium">Filter:</span>
            </div>
            <input 
                type="month" 
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary-500 transition-colors"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
            />
            {filterMonth && <button onClick={() => setFilterMonth('')} className="text-xs text-primary-600 font-medium hover:underline">Reset</button>}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="p-12 text-center text-gray-400">Loading records...</td></tr>
              ) : filteredTransactions.length === 0 ? (
                <tr><td colSpan={5} className="p-12 text-center text-gray-400">No transactions found for this period.</td></tr>
              ) : (
                filteredTransactions.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-5 text-gray-600 font-medium text-sm">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="p-5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {t.category}
                        </span>
                    </td>
                    <td className="p-5 text-gray-500 text-sm">{t.description || '-'}</td>
                    <td className={`p-5 font-bold text-sm ${type === 'income' ? 'text-primary-600' : 'text-gray-900'}`}>
                        {type === 'income' ? '+' : '-'}{formatMoney(t.amount)}
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => handleDelete(t.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;