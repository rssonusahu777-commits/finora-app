import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as db from '../services/db';
import { EDUCATIONAL_CONTENT } from '../constants';
import { LearningProgress, Lesson } from '../types';
import { BookOpen, CheckCircle2, Trophy, ArrowRight, Clock, Award, XCircle, ArrowLeft } from 'lucide-react';

const LearningPage = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<LearningProgress | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  
  // Quiz State
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [scorePercentage, setScorePercentage] = useState(0);

  useEffect(() => {
    if (user) {
      db.dbGetProgress(user.id).then(setProgress);
    }
  }, [user]);

  // Scroll to top when opening a lesson
  useEffect(() => {
    if (activeLesson) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeLesson]);

  const startQuiz = () => {
    setQuizMode(true);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(activeLesson?.questions.length).fill(-1));
    setQuizCompleted(false);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (activeLesson?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    if (!activeLesson || !progress || !user) return;

    let correctCount = 0;
    activeLesson.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) correctCount++;
    });

    const percentage = Math.round((correctCount / activeLesson.questions.length) * 100);
    setScorePercentage(percentage);
    setQuizCompleted(true);

    // If passed (>= 60%), save progress
    if (percentage >= 60) {
      const newIds = Array.from(new Set([...progress.completedLessonIds, activeLesson.id]));
      // Add points only if not previously completed (simple gamification)
      const pointsToAdd = progress.completedLessonIds.includes(activeLesson.id) ? 0 : 50;
      
      const newProgress = { 
        ...progress, 
        completedLessonIds: newIds, 
        quizScore: progress.quizScore + pointsToAdd 
      };
      
      await db.dbSaveProgress(newProgress);
      setProgress(newProgress);
    }
  };

  const resetLesson = () => {
    setActiveLesson(null);
    setQuizMode(false);
    setQuizCompleted(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
        {/* Header Card */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 gap-6">
            <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl">
                    <Trophy size={32} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Learning Hub</h1>
                    <p className="text-gray-500 mt-1">Boost your financial IQ. Complete lessons to earn points.</p>
                </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
                 <div className="flex-1 md:flex-none text-center bg-gray-50 px-6 py-3 rounded-xl border border-gray-100 min-w-[120px]">
                    <div className="text-xs uppercase tracking-wider text-gray-400 font-bold">Completed</div>
                    <div className="text-2xl font-black text-gray-800">
                        {progress?.completedLessonIds.length || 0} / {EDUCATIONAL_CONTENT.length}
                    </div>
                </div>
                <div className="flex-1 md:flex-none text-center bg-gray-50 px-6 py-3 rounded-xl border border-gray-100 min-w-[120px]">
                    <div className="text-xs uppercase tracking-wider text-gray-400 font-bold">XP Score</div>
                    <div className="text-2xl font-black text-primary-600">{progress?.quizScore || 0}</div>
                </div>
            </div>
        </div>

        {activeLesson ? (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
                {/* Lesson Navigation */}
                <div className="border-b border-gray-100 p-4 flex items-center bg-gray-50">
                    <button onClick={resetLesson} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors px-2 py-1 rounded-lg hover:bg-gray-200">
                        <ArrowLeft size={18} /> Back to Curriculum
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="p-8 md:p-12">
                    {!quizMode ? (
                        <>
                             {/* Content View */}
                            <div className="max-w-3xl mx-auto">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                        {activeLesson.category}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
                                        <Clock size={14} /> {activeLesson.durationMinutes} min read
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{activeLesson.title}</h2>
                                
                                <div className="prose prose-lg text-gray-600 mb-10 leading-relaxed space-y-6">
                                    {activeLesson.content.map((para, idx) => (
                                        <p key={idx}>{para}</p>
                                    ))}
                                </div>

                                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 mb-10">
                                    <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                                        <BookOpen size={20} /> Key Takeaways
                                    </h3>
                                    <ul className="space-y-2">
                                        {activeLesson.keyTakeaways.map((point, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-amber-800 text-sm font-medium">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></div>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex justify-center">
                                    <button 
                                        onClick={startQuiz}
                                        className="bg-primary-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all active:scale-[0.98] flex items-center gap-3"
                                    >
                                        Take Quiz to Complete <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Quiz View */
                        <div className="max-w-2xl mx-auto">
                            {!quizCompleted ? (
                                <>
                                    <div className="flex justify-between items-center mb-8">
                                        <span className="text-sm font-bold text-gray-400 uppercase">Question {currentQuestionIndex + 1} of {activeLesson.questions.length}</span>
                                        <div className="w-32 h-2 bg-gray-100 rounded-full">
                                            <div className="h-full bg-primary-500 rounded-full transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / activeLesson.questions.length) * 100}%` }}></div>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-6">{activeLesson.questions[currentQuestionIndex].question}</h3>

                                    <div className="space-y-3 mb-8">
                                        {activeLesson.questions[currentQuestionIndex].options.map((option, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={() => handleAnswerSelect(idx)}
                                                className={`w-full text-left p-5 rounded-xl border-2 transition-all flex items-center justify-between group ${
                                                    userAnswers[currentQuestionIndex] === idx 
                                                    ? 'border-primary-500 bg-primary-50 text-primary-900' 
                                                    : 'border-gray-100 bg-white hover:border-primary-200 text-gray-600'
                                                }`}
                                            >
                                                <span className="font-medium">{option}</span>
                                                {userAnswers[currentQuestionIndex] === idx && <CheckCircle2 className="text-primary-600" size={20} />}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex justify-end">
                                        <button 
                                            onClick={handleNextQuestion}
                                            disabled={userAnswers[currentQuestionIndex] === -1}
                                            className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            {currentQuestionIndex === activeLesson.questions.length - 1 ? 'Submit Results' : 'Next Question'}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                /* Quiz Results */
                                <div className="text-center py-8">
                                    {scorePercentage >= 60 ? (
                                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Award size={48} />
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <XCircle size={48} />
                                        </div>
                                    )}
                                    
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                        {scorePercentage >= 60 ? 'Lesson Completed!' : 'Keep Trying!'}
                                    </h2>
                                    <p className="text-gray-500 mb-8">
                                        You scored <span className={`font-bold ${scorePercentage >= 60 ? 'text-green-600' : 'text-red-600'}`}>{scorePercentage}%</span> on the quiz.
                                    </p>

                                    <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8 space-y-4">
                                        {activeLesson.questions.map((q, idx) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                {userAnswers[idx] === q.correctAnswer ? (
                                                    <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5" />
                                                ) : (
                                                    <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                                                )}
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{q.question}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Correct Answer: <span className="font-medium">{q.options[q.correctAnswer]}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-center gap-4">
                                        <button onClick={resetLesson} className="text-gray-500 font-bold hover:text-gray-900 transition-colors">
                                            Return to Hub
                                        </button>
                                        {scorePercentage < 60 && (
                                            <button onClick={startQuiz} className="bg-primary-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-primary-700">
                                                Retry Quiz
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        ) : (
            /* Dashboard Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {EDUCATIONAL_CONTENT.map((lesson, idx) => {
                    const isCompleted = progress?.completedLessonIds.includes(lesson.id);
                    return (
                        <div key={lesson.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-100 transition-all group flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lesson {idx + 1} • {lesson.category}</span>
                                {isCompleted ? <CheckCircle2 className="text-primary-500" size={24} /> : <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-primary-300 transition-colors"></div>}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">{lesson.title}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed flex-1">{lesson.summary}</p>
                            
                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                                <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                    <Clock size={14} /> {lesson.durationMinutes} min
                                </span>
                                <button 
                                    onClick={() => setActiveLesson(lesson)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${isCompleted ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-primary-50 text-primary-700 hover:bg-primary-100'}`}
                                >
                                    {isCompleted ? 'Review' : 'Start'} <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
    </div>
  );
};

export default LearningPage;