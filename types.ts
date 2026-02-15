export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Simulated hash
  createdAt: string;
  phone?: string;
  currency?: string;
  theme?: 'light' | 'dark';
  notifications?: boolean;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO Date string
}

export interface Budget {
  id: string;
  userId: string;
  monthlyLimit: number;
  updatedAt: string;
}

export interface Debt {
  id: string;
  userId: string;
  loanName: string;
  totalAmount: number;
  interestRate: number; // Annual rate in %
  tenureMonths: number;
  remainingAmount: number;
  startDate: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  content: string[]; // Array of paragraphs
  summary: string;
  keyTakeaways: string[];
  questions: QuizQuestion[];
  durationMinutes: number;
}

export interface LearningProgress {
  userId: string;
  completedLessonIds: string[];
  quizScore: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}