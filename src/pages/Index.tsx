
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, BookOpen, Target, TrendingUp, FileText } from "lucide-react";
import { QuizUploader } from "@/components/QuizUploader";
import { QuizInterface } from "@/components/QuizInterface";
import { PerformanceTracker } from "@/components/PerformanceTracker";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CFA Level 1 Quiz System</h1>
                <p className="text-sm text-gray-600">Professional exam preparation tool</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={activeTab === 'upload' ? 'default' : 'outline'}
                onClick={() => setActiveTab('upload')}
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </Button>
              <Button
                variant={activeTab === 'quiz' ? 'default' : 'outline'}
                onClick={() => setActiveTab('quiz')}
                disabled={questions.length === 0}
                className="flex items-center space-x-2"
              >
                <Target className="h-4 w-4" />
                <span>Quiz</span>
              </Button>
              <Button
                variant={activeTab === 'performance' ? 'default' : 'outline'}
                onClick={() => setActiveTab('performance')}
                className="flex items-center space-x-2"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Performance</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'upload' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Your CFA Question Bank</h2>
              <p className="text-lg text-gray-600 mb-8">
                Upload your PDF question bank to extract questions and start practicing
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center">
                <CardHeader>
                  <FileText className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <CardTitle>PDF Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Advanced PDF parsing to extract questions, options, and answers from your CFA question bank
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <Target className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <CardTitle>Subject Organization</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Questions organized by CFA subjects: Ethics, Quantitative Methods, Portfolio Management, and more
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <CardTitle>Performance Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Track your progress, identify weak areas, and monitor improvement over time
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
    </div>
  );
};

export default Index;
