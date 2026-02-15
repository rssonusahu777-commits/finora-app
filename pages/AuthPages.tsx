import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as db from '../services/db';
import { useNavigate, Link } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const user = await db.dbLogin(email, password);
      login(user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-primary-600 tracking-tight mb-2">Finora<span className="text-gray-400">.</span></h1>
            <p className="text-gray-500 font-medium">Smart money management made simple.</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm text-center font-medium border border-red-100">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input 
                type="email" 
                required 
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input 
                type="password" 
                required 
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••"
            />
          </div>
          <button disabled={isLoading} className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition-all disabled:opacity-70 shadow-lg shadow-primary-600/20 active:scale-[0.98] mt-2">
            {isLoading ? 'Accessing Secure Vault...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-500">
          New to Finora? <Link to="/register" className="text-primary-600 font-bold hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const user = await db.dbRegister(name, email, password);
      login(user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-primary-600 tracking-tight mb-2">Join Finora</h1>
            <p className="text-gray-500 font-medium">Start your journey to financial freedom.</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm text-center font-medium border border-red-100">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input 
                type="text" 
                required 
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input 
                type="email" 
                required 
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input 
                type="password" 
                required 
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••"
            />
          </div>
          <button disabled={isLoading} className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition-all disabled:opacity-70 shadow-lg shadow-primary-600/20 active:scale-[0.98] mt-2">
            {isLoading ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};