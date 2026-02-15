import { User, Transaction, Budget, Debt, LearningProgress, Goal } from '../types';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Keys
const KEYS = {
  USERS: 'finora_users',
  TRANSACTIONS: 'finora_transactions',
  BUDGETS: 'finora_budgets',
  DEBTS: 'finora_debts',
  PROGRESS: 'finora_progress',
  GOALS: 'finora_goals',
};

// Generic LocalStorage Helpers
const getCollection = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveCollection = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- AUTH SERVICES ---

export const dbRegister = async (name: string, email: string, password: string): Promise<User> => {
  await delay(500);
  const users = getCollection<User>(KEYS.USERS);
  
  if (users.find(u => u.email === email)) {
    throw new Error('User already exists');
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash: btoa(password), 
    createdAt: new Date().toISOString(),
    currency: 'USD',
    theme: 'light',
    notifications: true
  };

  users.push(newUser);
  saveCollection(KEYS.USERS, users);
  return newUser;
};

export const dbLogin = async (email: string, password: string): Promise<User> => {
  await delay(500);
  const users = getCollection<User>(KEYS.USERS);
  const user = users.find(u => u.email === email && u.passwordHash === btoa(password));
  
  if (!user) throw new Error('Invalid credentials');
  
  return user;
};

export const dbUpdateUser = async (updatedUser: User): Promise<User> => {
  await delay(400);
  let users = getCollection<User>(KEYS.USERS);
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index === -1) throw new Error('User not found');
  
  users[index] = updatedUser;
  saveCollection(KEYS.USERS, users);
  return updatedUser;
};

export const dbChangePassword = async (userId: string, currentPass: string, newPass: string): Promise<void> => {
  await delay(500);
  let users = getCollection<User>(KEYS.USERS);
  const user = users.find(u => u.id === userId);
  
  if (!user) throw new Error('User not found');
  if (user.passwordHash !== btoa(currentPass)) throw new Error('Current password is incorrect');
  
  user.passwordHash = btoa(newPass);
  saveCollection(KEYS.USERS, users);
};

export const dbDeleteAccount = async (userId: string): Promise<void> => {
  await delay(1000);
  
  // Cascade delete all user data
  const filterOut = <T extends { userId: string }>(key: string) => {
    const data = getCollection<T>(key);
    saveCollection(key, data.filter(item => item.userId !== userId));
  };

  const users = getCollection<User>(KEYS.USERS);
  saveCollection(KEYS.USERS, users.filter(u => u.id !== userId));

  filterOut(KEYS.TRANSACTIONS);
  filterOut(KEYS.BUDGETS);
  filterOut(KEYS.DEBTS);
  filterOut(KEYS.GOALS);
  
  // Progress uses a slightly different structure in type definition but implementation uses userId prop
  filterOut(KEYS.PROGRESS);
};

// --- TRANSACTION SERVICES ---

export const dbGetTransactions = async (userId: string): Promise<Transaction[]> => {
  await delay(300);
  const all = getCollection<Transaction>(KEYS.TRANSACTIONS);
  return all.filter(t => t.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const dbAddTransaction = async (data: Omit<Transaction, 'id'>): Promise<Transaction> => {
  await delay(300);
  const all = getCollection<Transaction>(KEYS.TRANSACTIONS);
  const newTrans: Transaction = { ...data, id: crypto.randomUUID() };
  all.push(newTrans);
  saveCollection(KEYS.TRANSACTIONS, all);
  return newTrans;
};

export const dbDeleteTransaction = async (id: string): Promise<void> => {
  await delay(200);
  let all = getCollection<Transaction>(KEYS.TRANSACTIONS);
  all = all.filter(t => t.id !== id);
  saveCollection(KEYS.TRANSACTIONS, all);
};

// --- BUDGET SERVICES ---

export const dbGetBudget = async (userId: string): Promise<Budget | null> => {
  await delay(200);
  const all = getCollection<Budget>(KEYS.BUDGETS);
  return all.find(b => b.userId === userId) || null;
};

export const dbSetBudget = async (userId: string, monthlyLimit: number): Promise<Budget> => {
  await delay(300);
  let all = getCollection<Budget>(KEYS.BUDGETS);
  const existingIndex = all.findIndex(b => b.userId === userId);
  
  const newBudget: Budget = {
    id: existingIndex > -1 ? all[existingIndex].id : crypto.randomUUID(),
    userId,
    monthlyLimit,
    updatedAt: new Date().toISOString()
  };

  if (existingIndex > -1) {
    all[existingIndex] = newBudget;
  } else {
    all.push(newBudget);
  }
  
  saveCollection(KEYS.BUDGETS, all);
  return newBudget;
};

// --- DEBT SERVICES ---

export const dbGetDebts = async (userId: string): Promise<Debt[]> => {
  await delay(300);
  const all = getCollection<Debt>(KEYS.DEBTS);
  return all.filter(d => d.userId === userId);
};

export const dbAddDebt = async (data: Omit<Debt, 'id'>): Promise<Debt> => {
  await delay(300);
  const all = getCollection<Debt>(KEYS.DEBTS);
  const newDebt: Debt = { ...data, id: crypto.randomUUID() };
  all.push(newDebt);
  saveCollection(KEYS.DEBTS, all);
  return newDebt;
};

export const dbUpdateDebt = async (debt: Debt): Promise<void> => {
  await delay(200);
  let all = getCollection<Debt>(KEYS.DEBTS);
  const index = all.findIndex(d => d.id === debt.id);
  if (index > -1) {
    all[index] = debt;
    saveCollection(KEYS.DEBTS, all);
  }
};

// --- GOAL SERVICES ---

export const dbGetGoals = async (userId: string): Promise<Goal[]> => {
  await delay(200);
  const all = getCollection<Goal>(KEYS.GOALS);
  return all.filter(g => g.userId === userId);
};

export const dbAddGoal = async (data: Omit<Goal, 'id'>): Promise<Goal> => {
  await delay(200);
  const all = getCollection<Goal>(KEYS.GOALS);
  const newGoal: Goal = { ...data, id: crypto.randomUUID() };
  all.push(newGoal);
  saveCollection(KEYS.GOALS, all);
  return newGoal;
};

export const dbUpdateGoal = async (goal: Goal): Promise<void> => {
  await delay(200);
  let all = getCollection<Goal>(KEYS.GOALS);
  const index = all.findIndex(g => g.id === goal.id);
  if (index > -1) {
    all[index] = goal;
    saveCollection(KEYS.GOALS, all);
  }
};

export const dbDeleteGoal = async (id: string): Promise<void> => {
  await delay(200);
  let all = getCollection<Goal>(KEYS.GOALS);
  saveCollection(KEYS.GOALS, all.filter(g => g.id !== id));
};

// --- LEARNING SERVICES ---

export const dbGetProgress = async (userId: string): Promise<LearningProgress> => {
  const all = getCollection<LearningProgress>(KEYS.PROGRESS);
  const found = all.find(p => p.userId === userId);
  if (found) return found;
  return { userId, completedLessonIds: [], quizScore: 0 };
};

export const dbSaveProgress = async (progress: LearningProgress): Promise<void> => {
  let all = getCollection<LearningProgress>(KEYS.PROGRESS);
  const index = all.findIndex(p => p.userId === progress.userId);
  if (index > -1) {
    all[index] = progress;
  } else {
    all.push(progress);
  }
  saveCollection(KEYS.PROGRESS, all);
};