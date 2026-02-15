import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, TrendingDown, PiggyBank, GraduationCap, UserCircle, LogOut, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/income', label: 'Income', icon: DollarSign },
    { to: '/expenses', label: 'Expenses', icon: Wallet },
    { to: '/budget', label: 'Budget', icon: PiggyBank },
    { to: '/debt', label: 'Debt Tracker', icon: TrendingDown },
    { to: '/learning', label: 'Learning Hub', icon: GraduationCap },
  ];

  const handleLogout = () => {
    if(window.confirm('Are you sure you want to logout?')) {
        logout();
    }
  }

  return (
    <aside className="w-64 bg-white text-gray-900 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto border-r border-gray-200 hidden md:flex shadow-sm z-10">
      <div className="p-8 border-b border-gray-100">
        <h1 className="text-3xl font-bold text-primary-600 tracking-tight">Finora<span className="text-gray-400">.</span></h1>
        <p className="text-xs text-gray-400 mt-1 font-medium tracking-wide">SMART MONEY MANAGEMENT</p>
      </div>

      <nav className="flex-1 p-4 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium group ${
                isActive
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={`transition-colors ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <NavLink
            to="/profile"
            className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-colors font-medium ${
                    isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
            }
        >
             <UserCircle size={20} />
             <span>Profile</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;