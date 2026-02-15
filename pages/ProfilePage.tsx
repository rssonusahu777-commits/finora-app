import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as db from '../services/db';
import { Transaction, Debt, LearningProgress, Goal } from '../types';
import { User, Mail, Phone, Calendar, Moon, Sun, Shield, Trash2, Edit2, Check, X, Plus, LogOut, ChevronRight, Settings, Target } from 'lucide-react';
import { EDUCATIONAL_CONTENT } from '../constants';

const ProfilePage = () => {
  const { user, login, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [progress, setProgress] = useState<LearningProgress | null>(null);
  
  // UI State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '' });
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passForm, setPassForm] = useState({ current: '', new: '', confirm: '' });
  
  const [newGoalForm, setNewGoalForm] = useState({ title: '', targetAmount: '', currentAmount: '' });
  const [showGoalForm, setShowGoalForm] = useState(false);

  // Load Data
  useEffect(() => {
    if (!user) return;
    
    // Apply Theme
    if (user.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const loadData = async () => {
      const [tx, dbts, gls, prog] = await Promise.all([
        db.dbGetTransactions(user.id),
        db.dbGetDebts(user.id),
        db.dbGetGoals(user.id),
        db.dbGetProgress(user.id)
      ]);
      setTransactions(tx);
      setDebts(dbts);
      setGoals(gls);
      setProgress(prog);
      setEditForm({ name: user.name, phone: user.phone || '' });
      setLoading(false);
    };
    loadData();
  }, [user]);

  // Calculations
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const totalDebt = debts.reduce((acc, d) => acc + d.remainingAmount, 0);
  const liquidAssets = totalIncome - totalExpense;
  const netWorth = liquidAssets - totalDebt;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: user?.currency || 'USD', maximumFractionDigits: 0 }).format(amount);
  }

  // Handlers
  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      const updatedUser = await db.dbUpdateUser({ ...user, name: editForm.name, phone: editForm.phone });
      login(updatedUser); // Update context
      setIsEditingProfile(false);
      alert('Profile updated successfully');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;
    if (passForm.new !== passForm.confirm) return alert("Passwords don't match");
    try {
      await db.dbChangePassword(user.id, passForm.current, passForm.new);
      setPassForm({ current: '', new: '', confirm: '' });
      setIsChangingPassword(false);
      alert('Password changed successfully');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleUpdateSettings = async (key: string, value: any) => {
    if (!user) return;
    const updatedUser = await db.dbUpdateUser({ ...user, [key]: value });
    login(updatedUser);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const confirm = window.confirm('Are you sure? This will delete ALL your data permanently.');
    if (confirm) {
      await db.dbDeleteAccount(user.id);
      logout();
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const goal = await db.dbAddGoal({
      userId: user.id,
      title: newGoalForm.title,
      targetAmount: parseFloat(newGoalForm.targetAmount),
      currentAmount: parseFloat(newGoalForm.currentAmount || '0')
    });
    setGoals([...goals, goal]);
    setNewGoalForm({ title: '', targetAmount: '', currentAmount: '' });
    setShowGoalForm(false);
  };

  const handleDeleteGoal = async (id: string) => {
    if (!confirm('Delete this goal?')) return;
    await db.dbDeleteGoal(id);
    setGoals(goals.filter(g => g.id !== id));
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* 1. Profile Header Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
        {/* Decorative bg element */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-50 to-emerald-50 opacity-50 z-0"></div>
        
        <div className="z-10 w-28 h-28 bg-white p-1.5 rounded-full shadow-md mt-4 md:mt-0">
            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-emerald-700 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-inner">
                {user?.name.charAt(0).toUpperCase()}
            </div>
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-4 w-full z-10 pt-4 md:pt-2">
          {isEditingProfile ? (
            <div className="space-y-4 max-w-md">
              <input 
                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" 
                value={editForm.name} 
                onChange={e => setEditForm({...editForm, name: e.target.value})} 
                placeholder="Full Name"
              />
              <input 
                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" 
                value={editForm.phone} 
                onChange={e => setEditForm({...editForm, phone: e.target.value})} 
                placeholder="Phone Number"
              />
              <div className="flex gap-2 justify-center md:justify-start">
                <button onClick={handleUpdateProfile} className="bg-primary-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-primary-700 transition-colors"><Check size={16}/> Save Changes</button>
                <button onClick={() => setIsEditingProfile(false)} className="bg-gray-100 text-gray-600 px-5 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-200 transition-colors"><X size={16}/> Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-gray-500 text-sm">
                    <span className="flex items-center gap-1.5"><Mail size={14} /> {user?.email}</span>
                    {user?.phone && <span className="flex items-center gap-1.5"><Phone size={14}/> {user.phone}</span>}
                </div>
                <p className="text-xs text-gray-400 mt-2 flex items-center justify-center md:justify-start gap-1">
                  <Calendar size={12} /> Member since {new Date(user!.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button 
                onClick={() => setIsEditingProfile(true)}
                className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center justify-center md:justify-start gap-1"
              >
                <Edit2 size={14} /> Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2. Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Income', value: totalIncome, color: 'text-primary-600', bg: 'bg-primary-50' },
          { label: 'Total Expense', value: totalExpense, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Total Debt', value: totalDebt, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Net Worth', value: netWorth, color: netWorth >= 0 ? 'text-blue-600' : 'text-gray-600', bg: 'bg-gray-50' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{item.label}</p>
            <p className={`text-2xl font-black ${item.color} mt-2`}>
              {formatMoney(item.value)}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 3. Goals Section */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm h-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-900">Financial Goals</h2>
            <button onClick={() => setShowGoalForm(!showGoalForm)} className="text-primary-600 hover:bg-primary-50 p-2 rounded-full transition-colors"><Plus size={20}/></button>
          </div>

          {showGoalForm && (
            <form onSubmit={handleAddGoal} className="bg-gray-50 p-6 rounded-xl mb-6 space-y-4 border border-gray-200">
              <input required placeholder="Goal Title (e.g. Vacation)" className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" value={newGoalForm.title} onChange={e => setNewGoalForm({...newGoalForm, title: e.target.value})} />
              <div className="flex gap-4">
                <input required type="number" placeholder="Target" className="w-1/2 p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" value={newGoalForm.targetAmount} onChange={e => setNewGoalForm({...newGoalForm, targetAmount: e.target.value})} />
                <input type="number" placeholder="Saved" className="w-1/2 p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" value={newGoalForm.currentAmount} onChange={e => setNewGoalForm({...newGoalForm, currentAmount: e.target.value})} />
              </div>
              <button className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors">Add New Goal</button>
            </form>
          )}

          <div className="space-y-6">
            {goals.length === 0 ? (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-3">
                        <Target size={24} />
                    </div>
                    <p className="text-gray-400">Set your first financial goal to track progress.</p>
                </div>
            ) : goals.map(goal => {
              const pct = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
              return (
                <div key={goal.id} className="group">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-gray-700">{goal.title}</span>
                    <button onClick={() => handleDeleteGoal(goal.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-primary-500 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                    <span>{formatMoney(goal.currentAmount)}</span>
                    <span>Target: {formatMoney(goal.targetAmount)} ({pct.toFixed(0)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Learning Stats */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm h-full">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Learning Progress</h2>
          <div className="grid grid-cols-2 gap-6">
             <div className="p-6 bg-indigo-50 rounded-2xl text-center border border-indigo-100">
                <div className="text-4xl font-black text-indigo-600">{progress?.completedLessonIds.length || 0}</div>
                <div className="text-xs text-indigo-400 uppercase font-bold tracking-wider mt-2">Lessons</div>
             </div>
             <div className="p-6 bg-purple-50 rounded-2xl text-center border border-purple-100">
                <div className="text-4xl font-black text-purple-600">{progress?.quizScore || 0}</div>
                <div className="text-xs text-purple-400 uppercase font-bold tracking-wider mt-2">Points</div>
             </div>
          </div>
          <div className="mt-8">
             <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-semibold text-gray-600">Curriculum Completion</p>
                <span className="text-xs font-bold text-primary-600">
                    {Math.round(((progress?.completedLessonIds.length || 0) / EDUCATIONAL_CONTENT.length) * 100)}%
                </span>
             </div>
             <div className="flex gap-2 h-2.5">
                {EDUCATIONAL_CONTENT.map(l => (
                  <div 
                    key={l.id} 
                    className={`flex-1 rounded-full ${progress?.completedLessonIds.includes(l.id) ? 'bg-primary-400' : 'bg-gray-200'}`}
                  ></div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 5. Settings */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
           <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
               <Settings size={20} className="text-gray-400" /> Preferences
           </h2>
           
           <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-200 text-gray-500">
                        {user?.theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                    </div>
                    <span className="font-semibold text-gray-700">Appearance</span>
                 </div>
                 <select 
                    value={user?.theme || 'light'}
                    onChange={(e) => handleUpdateSettings('theme', e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none text-gray-600 font-medium cursor-pointer hover:border-primary-400 transition-colors"
                 >
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                 </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-200 text-gray-500 font-serif font-bold">
                        $
                    </div>
                    <span className="font-semibold text-gray-700">Currency</span>
                 </div>
                 <select 
                    value={user?.currency || 'USD'}
                    onChange={(e) => handleUpdateSettings('currency', e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none text-gray-600 font-medium cursor-pointer hover:border-primary-400 transition-colors"
                 >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="GBP">GBP (£)</option>
                 </select>
              </div>
           </div>
        </div>

        {/* 6. Security */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
           <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <Shield size={20} className="text-primary-600" /> Security
           </h2>

           {isChangingPassword ? (
              <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                 <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Update Password</h3>
                 <input type="password" placeholder="Current Password" className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" value={passForm.current} onChange={e => setPassForm({...passForm, current: e.target.value})} />
                 <input type="password" placeholder="New Password" className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" value={passForm.new} onChange={e => setPassForm({...passForm, new: e.target.value})} />
                 <input type="password" placeholder="Confirm New Password" className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500" value={passForm.confirm} onChange={e => setPassForm({...passForm, confirm: e.target.value})} />
                 <div className="flex gap-3 pt-2">
                    <button onClick={handleChangePassword} className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-primary-700 shadow-md shadow-primary-600/20">Update</button>
                    <button onClick={() => setIsChangingPassword(false)} className="text-gray-500 px-4 py-2 text-sm font-medium hover:text-gray-700">Cancel</button>
                 </div>
              </div>
           ) : (
              <button 
                onClick={() => setIsChangingPassword(true)}
                className="w-full py-4 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-colors mb-6 flex items-center justify-between px-6 group"
              >
                Change Password
                <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
              </button>
           )}

           <div className="pt-2">
              <button 
                onClick={handleDeleteAccount}
                className="w-full py-4 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 group"
              >
                <Trash2 size={18} className="group-hover:scale-110 transition-transform" /> Delete Account
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;