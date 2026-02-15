import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as db from '../services/db';
import { Budget, Transaction } from '../types';
import { Save, AlertTriangle, CheckCircle2 } from 'lucide-react';

const BudgetPage = () => {
  const { user } = useAuth();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [limitInput, setLimitInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [b, tx] = await Promise.all([
        db.dbGetBudget(user.id),
        db.dbGetTransactions(user.id)
      ]);
      setBudget(b);
      setExpenses(tx.filter(t => t.type === 'expense'));
      if (b) setLimitInput(b.monthlyLimit.toString());
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleSave = async () => {
    if (!user || !limitInput) return;
    const b = await db.dbSetBudget(user.id, parseFloat(limitInput));
    setBudget(b);
    alert('Budget updated successfully!');
  };

  const formatMoney = (amount: number) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: user?.currency || 'USD', maximumFractionDigits: 0 }).format(amount);
  }

  const currentMonth = new Date().getMonth();
  const currentMonthExpenses = expenses
    .filter(t => new Date(t.date).getMonth() === currentMonth)
    .reduce((acc, t) => acc + t.amount, 0);

  const percentage = budget ? Math.min((currentMonthExpenses / budget.monthlyLimit) * 100, 100) : 0;
  const remaining = budget ? budget.monthlyLimit - currentMonthExpenses : 0;

  if (loading) return <div className="text-gray-400 p-10">Loading budget data...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget Settings</h1>
          <p className="text-gray-500">Define your monthly spending limits to save more.</p>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Set Monthly Spending Limit</label>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <span className="absolute left-4 top-3.5 text-gray-400 font-semibold">$</span>
            <input 
              type="number"
              className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all font-medium text-gray-900"
              placeholder="e.g. 5000"
              value={limitInput}
              onChange={e => setLimitInput(e.target.value)}
            />
          </div>
          <button 
            onClick={handleSave}
            className="bg-primary-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-primary-700 shadow-sm shadow-primary-600/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Save size={18} /> Update Limit
          </button>
        </div>
      </div>

      {/* Visualizer */}
      {budget && (
        <div className="bg-white p-8 rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-gray-900">
                {new Date().toLocaleString('default', { month: 'long' })} Overview
              </h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${remaining < 0 ? 'bg-red-100 text-red-700' : 'bg-primary-50 text-primary-700'}`}>
                  {remaining < 0 ? 'Over Budget' : 'On Track'}
              </span>
          </div>
          
          <div className="relative pb-4">
             {/* Progress Bar Container */}
             <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div 
                  className={`h-full transition-all duration-1000 ease-out rounded-full ${percentage >= 100 ? 'bg-red-500' : percentage >= 80 ? 'bg-yellow-400' : 'bg-primary-500'}`}
                  style={{ width: `${percentage}%` }}
                ></div>
             </div>
             
             <div className="flex justify-between text-sm font-medium mt-2">
                <div className="flex flex-col">
                    <span className="text-gray-400 text-xs uppercase mb-1">Spent</span>
                    <span className="text-gray-900 font-bold text-lg">{formatMoney(currentMonthExpenses)}</span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-gray-400 text-xs uppercase mb-1">Limit</span>
                    <span className="text-gray-900 font-bold text-lg">{formatMoney(budget.monthlyLimit)}</span>
                </div>
             </div>

             {/* Dynamic Indicator */}
             {percentage >= 80 ? (
               <div className="mt-8 bg-red-50 border border-red-100 text-red-800 p-5 rounded-xl flex items-start gap-3">
                 <AlertTriangle className="shrink-0 mt-0.5 text-red-600" size={20} />
                 <div>
                   <p className="font-bold text-sm">Budget Alert!</p>
                   <p className="text-sm mt-1 opacity-90">You have consumed {percentage.toFixed(1)}% of your monthly budget.</p>
                 </div>
               </div>
             ) : (
                <div className="mt-8 bg-primary-50 border border-primary-100 text-primary-800 p-5 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="shrink-0 mt-0.5 text-primary-600" size={20} />
                    <div>
                        <p className="font-bold text-sm">Great Job!</p>
                        <p className="text-sm mt-1 opacity-90">You are within your budget limits. Keep it up!</p>
                    </div>
                </div>
             )}

             <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 text-center">
                   <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Remaining</p>
                   <p className={`text-2xl font-bold ${remaining < 0 ? 'text-red-600' : 'text-primary-600'}`}>
                      {formatMoney(remaining)}
                   </p>
                </div>
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 text-center">
                   <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Daily Safe Spend</p>
                   <p className="text-2xl font-bold text-blue-600">
                      {formatMoney(Math.max(0, remaining / (new Date(new Date().getFullYear(), currentMonth + 1, 0).getDate() - new Date().getDate())))}
                   </p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPage;