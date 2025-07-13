
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, BookOpen, Target, TrendingUp, FileText, Zap, Award, BarChart3 } from "lucide-react";
import { QuizUploader } from "@/components/QuizUploader";
import { QuizInterface } from "@/components/QuizInterface";
import { PerformanceTracker } from "@/components/PerformanceTracker";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'quiz' | 'performance'>('upload');
  const [questions, setQuestions] = useState([]);
  const [quizResults, setQuizResults] = useState([]);

  const handleQuestionsExtracted = (extractedQuestions: any[]) => {
    setQuestions(extractedQuestions);
    setActiveTab('quiz');
  };

  const handleQuizComplete = (results: any[]) => {
    setQuizResults(prev => [...prev, ...results]);
    setActiveTab('performance');
  };

  const stats = {
    totalQuestions: questions.length,
    totalAttempts: quizResults.length,
    averageScore: quizResults.length > 0 
      ? Math.round((quizResults.filter(r => r.isCorrect).length / quizResults.length) * 100)
      : 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Header */}
      <div className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-10 shadow-sm dark:bg-gray-900/90 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                  CFA Level 1 Quiz Master
                </h1>
                <p className="text-gray-600 font-medium dark:text-gray-400">Professional exam preparation platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Quick Stats */}
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-2xl text-blue-600 dark:text-blue-400">{stats.totalQuestions}</div>
                  <div className="text-gray-500 dark:text-gray-400">Questions</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-2xl text-green-600 dark:text-green-400">{stats.totalAttempts}</div>
                  <div className="text-gray-500 dark:text-gray-400">Attempts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-2xl text-purple-600 dark:text-purple-400">{stats.averageScore}%</div>
                  <div className="text-gray-500 dark:text-gray-400">Avg Score</div>
                </div>
              </div>
              
              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>

          {/* Enhanced Navigation */}
          <div className="flex space-x-2 mt-6">
            <Button
              variant={activeTab === 'upload' ? 'default' : 'outline'}
              onClick={() => setActiveTab('upload')}
              className="flex items-center space-x-2 transition-all hover:scale-105"
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </Button>
            <Button
              variant={activeTab === 'quiz' ? 'default' : 'outline'}
              onClick={() => setActiveTab('quiz')}
              disabled={questions.length === 0}
              className="flex items-center space-x-2 transition-all hover:scale-105"
            >
              <Target className="h-4 w-4" />
              <span>Quiz</span>
              {questions.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                  {questions.length}
                </span>
              )}
            </Button>
            <Button
              variant={activeTab === 'performance' ? 'default' : 'outline'}
              onClick={() => setActiveTab('performance')}
              className="flex items-center space-x-2 transition-all hover:scale-105"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Analytics</span>
              {quizResults.length > 0 && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-200">
                  {quizResults.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'upload' && (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 dark:text-white">
                Upload Your CFA Question Bank
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto dark:text-gray-300">
                Transform your PDF question bank into an interactive quiz experience. 
                Extract questions, track progress, and identify areas for improvement.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="text-center hover:shadow-lg transition-all hover:-translate-y-1 border-0 shadow-md dark:bg-gray-800 dark:shadow-gray-900/20">
                <CardHeader>
                  <div className="mx-auto bg-blue-100 p-4 rounded-full w-fit mb-4 dark:bg-blue-900">
                    <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl dark:text-white">Smart PDF Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base dark:text-gray-300">
                    Advanced AI-powered extraction that identifies questions, multiple-choice options, 
                    and correct answers from your CFA question bank with high accuracy.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-all hover:-translate-y-1 border-0 shadow-md dark:bg-gray-800 dark:shadow-gray-900/20">
                <CardHeader>
                  <div className="mx-auto bg-green-100 p-4 rounded-full w-fit mb-4 dark:bg-green-900">
                    <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl dark:text-white">Subject Organization</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base dark:text-gray-300">
                    Questions automatically organized by CFA curriculum topics: Ethics, 
                    Quantitative Methods, Portfolio Management, and all major subject areas.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-all hover:-translate-y-1 border-0 shadow-md dark:bg-gray-800 dark:shadow-gray-900/20">
                <CardHeader>
                  <div className="mx-auto bg-purple-100 p-4 rounded-full w-fit mb-4 dark:bg-purple-900">
                    <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl dark:text-white">Advanced Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base dark:text-gray-300">
                    Comprehensive performance tracking with detailed analytics, progress visualization, 
                    and personalized recommendations for focused study.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <QuizUploader onQuestionsExtracted={handleQuestionsExtracted} />
          </div>
        )}

        {activeTab === 'quiz' && (
          <QuizInterface 
            questions={questions} 
            onQuizComplete={handleQuizComplete}
          />
        )}

        {activeTab === 'performance' && (
          <PerformanceTracker results={quizResults} />
        )}
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gray-50 border-t mt-16 dark:bg-gray-800 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 dark:text-white">About CFA Quiz Master</h3>
              <p className="text-gray-600 text-sm dark:text-gray-400">
                A comprehensive platform designed to help CFA Level 1 candidates 
                prepare effectively using their own question banks.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 dark:text-white">Features</h3>
              <ul className="text-gray-600 text-sm space-y-1 dark:text-gray-400">
                <li>• PDF Question Extraction</li>
                <li>• Subject-Based Organization</li>
                <li>• Performance Analytics</li>
                <li>• Progress Tracking</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 dark:text-white">Study Tips</h3>
              <ul className="text-gray-600 text-sm space-y-1 dark:text-gray-400">
                <li>• Focus on weak areas</li>
                <li>• Regular practice sessions</li>
                <li>• Review incorrect answers</li>
                <li>• Track improvement over time</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
