import React, { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Menu, Bell, AlertCircle, CheckCircle } from 'lucide-react';

const Layout = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      <Sidebar />
      
      {/* Mobile Header */}
      <div className="md:hidden fixed w-full bg-white z-20 px-4 py-3 flex justify-between items-center shadow-sm border-b border-gray-200">
        <span className="font-bold text-xl text-primary-600">Finora</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600">
            <Menu />
        </button>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
          <div className="fixed inset-0 z-30 bg-black/20 md:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
              <div className="bg-white h-full w-64 shadow-2xl" onClick={e => e.stopPropagation()}>
                 <Sidebar /> 
              </div>
          </div>
      )}

      <main className="flex-1 md:ml-64 p-6 pt-20 md:pt-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name.split(' ')[0]}</h2>
              <p className="text-gray-500 mt-1">Here is your financial overview for today.</p>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
                {/* Notification Dropdown Container */}
                <div className="relative" ref={notifRef}>
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`p-2 transition-colors relative rounded-lg outline-none ${showNotifications ? 'text-primary-600 bg-primary-50' : 'text-gray-400 hover:text-primary-600'}`}
                    >
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>

                    {showNotifications && (
                        <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-fade-in origin-top-right">
                            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                                <button className="text-xs text-primary-600 font-medium hover:text-primary-700">Mark all read</button>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {/* Static Notifications */}
                                <div className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <div className="flex gap-3">
                                        <div className="mt-0.5 text-yellow-500 bg-yellow-50 p-1.5 rounded-full h-fit">
                                            <AlertCircle size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-800 font-medium group-hover:text-primary-700 transition-colors">Budget Alert</p>
                                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">You have reached 80% of your monthly budget limit.</p>
                                            <p className="text-[10px] text-gray-400 mt-2">2 hours ago</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <div className="flex gap-3">
                                        <div className="mt-0.5 text-green-500 bg-green-50 p-1.5 rounded-full h-fit">
                                            <CheckCircle size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-800 font-medium group-hover:text-primary-700 transition-colors">Goal Reached</p>
                                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Congratulations! You reached your savings goal for "New Laptop".</p>
                                            <p className="text-[10px] text-gray-400 mt-2">1 day ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 text-sm font-medium text-gray-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                    {new Date().toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
            </div>
          </header>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;