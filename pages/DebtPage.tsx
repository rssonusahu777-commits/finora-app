import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as db from '../services/db';
import { Debt } from '../types';
import { Plus, CheckCircle, TrendingDown, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DebtPage = () => {
  const { user } = useAuth();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    loanName: '',
    totalAmount: '',
    interestRate: '',
    tenureMonths: '',
    remainingAmount: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const loadDebts = async () => {
    if (user) {
      const data = await db.dbGetDebts(user.id);
      // Sort by snowball method (smallest balance first)
      data.sort((a, b) => a.remainingAmount - b.remainingAmount);
      setDebts(data);
    }
  };

  useEffect(() => {
    loadDebts();
  }, [user]);

  const calculateEMI = (principal: number, rate: number, months: number) => {
    const r = rate / 12 / 100;
    const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    return emi.toFixed(2);
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: user?.currency || 'USD' }).format(amount);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await db.dbAddDebt({
        userId: user.id,
        loanName: formData.loanName,
        totalAmount: parseFloat(formData.totalAmount),
        remainingAmount: parseFloat(formData.remainingAmount || formData.totalAmount),
        interestRate: parseFloat(formData.interestRate),
        tenureMonths: parseInt(formData.tenureMonths),
        startDate: formData.startDate
    });
    setShowForm(false);
    setFormData({ loanName: '', totalAmount: '', interestRate: '', tenureMonths: '', remainingAmount: '', startDate: '' });
    loadDebts();
  };

  const handlePayment = async (debt: Debt) => {
    const amount = prompt('Enter payment amount:');
    if (amount) {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) return alert('Invalid amount');
        const newBalance = Math.max(0, debt.remainingAmount - val);
        await db.dbUpdateDebt({ ...debt, remainingAmount: newBalance });
        loadDebts();
    }
  };

  return (
    <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Debt Tracker</h1>
                <p className="text-gray-500 mt-1 flex items-center gap-2">
                    <Target size={16} className="text-primary-600" />
                    Strategy: <span className="font-semibold text-gray-700">Snowball Method</span> (Smallest balance first)
                </p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="bg-primary-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-primary-700 shadow-sm transition-all active:scale-95 font-medium">
                <Plus size={18} /> Add Loan
            </button>
        </div>

        {showForm && (
             <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-fade-in">
                <h3 className="font-bold text-lg text-gray-900 mb-6">Add Loan Details</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Loan Name</label>
                        <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. Car Loan" required value={formData.loanName} onChange={e => setFormData({...formData, loanName: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Total Principal</label>
                        <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" type="number" placeholder="0.00" required value={formData.totalAmount} onChange={e => setFormData({...formData, totalAmount: e.target.value, remainingAmount: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Interest Rate (%)</label>
                        <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" type="number" placeholder="5.5" required value={formData.interestRate} onChange={e => setFormData({...formData, interestRate: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Tenure (Months)</label>
                        <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" type="number" placeholder="12" required value={formData.tenureMonths} onChange={e => setFormData({...formData, tenureMonths: e.target.value})} />
                    </div>
                    <button type="submit" className="md:col-span-2 bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 font-bold shadow-md shadow-primary-600/20 mt-2">Add Debt Record</button>
                </form>
             </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-2 space-y-4">
                {debts.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center text-gray-400">
                        No debts recorded. You are financially free!
                    </div>
                ) : debts.map((debt, index) => (
                    <div key={debt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden hover:shadow-md transition-shadow">
                        {index === 0 && debts.length > 1 && (
                            <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                                Pay This First
                            </div>
                        )}
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900">{debt.loanName}</h3>
                            <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                <span className="bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">{debt.interestRate}% APR</span>
                                <span className="bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">{debt.tenureMonths} Months</span>
                            </div>
                            <p className="text-sm mt-3 text-gray-600">
                                Est. Monthly: <span className="font-bold text-gray-900">${calculateEMI(debt.totalAmount, debt.interestRate, debt.tenureMonths)}</span>
                            </p>
                        </div>
                        <div className="text-center md:text-right w-full md:w-auto">
                             <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Remaining Balance</p>
                             <p className="text-2xl font-bold text-gray-900">{formatMoney(debt.remainingAmount)}</p>
                             <div className="w-full md:w-40 h-2 bg-gray-100 rounded-full mt-3 ml-auto mr-auto md:mr-0 overflow-hidden">
                                 <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(debt.remainingAmount / debt.totalAmount) * 100}%` }}></div>
                             </div>
                             <p className="text-xs text-gray-400 mt-1">{(debt.remainingAmount / debt.totalAmount * 100).toFixed(0)}% Left</p>
                        </div>
                        <button 
                            onClick={() => handlePayment(debt)}
                            disabled={debt.remainingAmount <= 0}
                            className="bg-primary-50 hover:bg-primary-100 text-primary-700 p-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                            title="Make Payment"
                        >
                            <CheckCircle size={24} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-96">
                <h3 className="font-bold text-gray-900 mb-6">Debt Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={debts}>
                        <XAxis dataKey="loanName" tick={{fontSize: 10, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip 
                            cursor={{fill: '#f3f4f6'}}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="remainingAmount" radius={[6, 6, 0, 0]}>
                            {debts.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#f59e0b' : '#059669'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Priority</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary-600"></div> Others</div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default DebtPage;