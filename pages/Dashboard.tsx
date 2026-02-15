import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Transaction, Budget, Debt, LearningProgress } from '../types';
import * as db from '../services/db';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      try {
        const [txData, budgetData, debtData] = await Promise.all([
          db.dbGetTransactions(user.id),
          db.dbGetBudget(user.id),
          db.dbGetDebts(user.id),
        ]);
        setTransactions(txData);
        setBudget(budgetData);
        setDebts(debtData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  if (loading) return <div className="flex h-96 items-center justify-center text-gray-400">Loading dashboard...</div>;

  // Calculations
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const savings = totalIncome - totalExpense;
  
  // Budget Logic
  const currentMonthExpenses = transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((acc, t) => acc + t.amount, 0);
    
  const budgetPercent = budget ? Math.min((currentMonthExpenses / budget.monthlyLimit) * 100, 100) : 0;

  // Chart Data
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.keys(expenseByCategory).map(key => ({
    name: key,
    value: expenseByCategory[key]
  }));

  const COLORS = ['#059669', '#34d399', '#6ee7b7', '#a7f3d0', '#f59e0b', '#ef4444'];
  const formatMoney = (amount: number) => {
      const currency = user?.currency || 'USD';
      const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
      });
      return formatter.format(amount);
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                <TrendingUp size={24} />
              </div>
              <span className="flex items-center text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                  <ArrowUpRight size={14} className="mr-1" /> +12%
              </span>
          </div>
          <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Total Income</p>
              <h3 className="text-3xl font-bold text-gray-900">{formatMoney(totalIncome)}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                <TrendingDown size={24} />
              </div>
              <span className="flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                  <ArrowDownRight size={14} className="mr-1" /> -5%
              </span>
          </div>
          <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Total Expenses</p>
              <h3 className="text-3xl font-bold text-gray-900">{formatMoney(totalExpense)}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <DollarSign size={24} />
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                  YTD
              </span>
          </div>
          <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Net Savings</p>
              <h3 className={`text-3xl font-bold ${savings >= 0 ? 'text-primary-600' : 'text-red-600'}`}>
                {formatMoney(savings)}
              </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Monthly Budget</h3>
              {budget && (
                   <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                       Limit: {formatMoney(budget.monthlyLimit)}
                   </span>
              )}
          </div>
          {budget ? (
            <div>
              <div className="flex justify-between mb-3 text-sm font-medium">
                <span className="text-gray-600">Spent: {formatMoney(currentMonthExpenses)}</span>
                <span className={`${budgetPercent >= 100 ? 'text-red-600' : 'text-primary-600'}`}>
                    {budgetPercent.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${budgetPercent >= 80 ? 'bg-red-500' : 'bg-primary-500'}`} 
                  style={{ width: `${budgetPercent}%` }}
                ></div>
              </div>
              {budgetPercent >= 80 && (
                <div className="mt-6 flex items-start gap-3 text-red-700 text-sm bg-red-50 p-4 rounded-xl border border-red-100">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>You're nearing your budget limit. Review your recent expenses to stay on track.</span>
                </div>
              )}
            </div>
          ) : (
             <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No budget set for this month.</p>
                <a href="/#/budget" className="text-primary-600 font-medium hover:underline">Set Budget Now</a>
             </div>
          )}
        </div>

        {/* Debt Summary */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Active Debts</h3>
            {debts.length > 0 ? (
                <div className="space-y-4">
                    {debts.slice(0, 3).map(debt => (
                        <div key={debt.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                                    {debt.interestRate}%
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{debt.loanName}</p>
                                    <p className="text-xs text-gray-500">Interest Rate</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-gray-900">{formatMoney(debt.remainingAmount)}</span>
                                <span className="text-xs text-gray-400">Remaining</span>
                            </div>
                        </div>
                    ))}
                    <div className="pt-4 border-t border-gray-100 text-center">
                        <a href="/#/debt" className="text-sm text-primary-600 font-medium hover:text-primary-700">View All Debts &rarr;</a>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                    <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-3">
                        <DollarSign size={24} />
                    </div>
                    <p className="text-gray-900 font-medium">Debt Free!</p>
                    <p className="text-sm text-gray-500">You have no active debts recorded.</p>
                </div>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense Distribution */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-8">Expense Breakdown</h3>
            <div className="h-64 flex items-center justify-center">
                {pieData.length > 0 ? (
                     <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie
                         data={pieData}
                         cx="50%"
                         cy="50%"
                         innerRadius={80}
                         outerRadius={100}
                         paddingAngle={5}
                         dataKey="value"
                         stroke="none"
                       >
                         {pieData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                       </Pie>
                       <Tooltip 
                            formatter={(value) => formatMoney(value as number)} 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                       />
                     </PieChart>
                   </ResponsiveContainer>
                ) : <p className="text-gray-400">No expenses recorded yet.</p>}
            </div>
            <div className="flex flex-wrap gap-4 mt-8 justify-center">
                {pieData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        {entry.name}
                    </div>
                ))}
            </div>
        </div>
        
        {/* Recent Transactions */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Transactions</h3>
            <div className="space-y-6">
                {transactions.slice(0, 5).map(t => (
                    <div key={t.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-xl ${t.type === 'income' ? 'bg-primary-50 text-primary-600' : 'bg-red-50 text-red-500'}`}>
                                {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{t.category}</p>
                                <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <span className={`font-semibold text-sm ${t.type === 'income' ? 'text-primary-600' : 'text-gray-900'}`}>
                            {t.type === 'income' ? '+' : '-'}{formatMoney(t.amount)}
                        </span>
                    </div>
                ))}
                {transactions.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No recent activity.</p>}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <a href="/#/expenses" className="text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors">View All Transactions</a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;