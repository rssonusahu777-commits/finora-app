import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import { Login, Register } from './pages/AuthPages';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import BudgetPage from './pages/BudgetPage';
import DebtPage from './pages/DebtPage';
import LearningPage from './pages/LearningPage';
import ProfilePage from './pages/ProfilePage';

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div className="flex h-screen w-full items-center justify-center bg-slate-50">Loading session...</div>;
  if (!isAuthenticated) return <Navigate to="/register" replace />;
  
  return <>{children}</>;
};

const App = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="income" element={<TransactionsPage type="income" />} />
            <Route path="expenses" element={<TransactionsPage type="expense" />} />
            <Route path="budget" element={<BudgetPage />} />
            <Route path="debt" element={<DebtPage />} />
            <Route path="learning" element={<LearningPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;