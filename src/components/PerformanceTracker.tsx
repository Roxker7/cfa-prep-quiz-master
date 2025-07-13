
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, BookOpen, Award } from "lucide-react";

interface QuizResult {
  questionId: number;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  subject: string;
  timestamp: string;
}

interface PerformanceTrackerProps {
  results: QuizResult[];
}

export const PerformanceTracker: React.FC<PerformanceTrackerProps> = ({ results }) => {
  const analytics = useMemo(() => {
    if (results.length === 0) {
      return {
        overallScore: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        subjectPerformance: [],
        recentPerformance: [],
        strengths: [],
        weaknesses: []
      };
    }

    const correctAnswers = results.filter(r => r.isCorrect).length;
    const overallScore = Math.round((correctAnswers / results.length) * 100);

    // Subject performance analysis
    const subjectStats = results.reduce((acc, result) => {
      if (!acc[result.subject]) {
        acc[result.subject] = { correct: 0, total: 0 };
      }
      acc[result.subject].total += 1;
      if (result.isCorrect) {
        acc[result.subject].correct += 1;
      }
      return acc;
    }, {} as Record<string, { correct: number; total: number }>);

    const subjectPerformance = Object.entries(subjectStats).map(([subject, stats]) => ({
      subject: subject.length > 20 ? subject.substring(0, 20) + '...' : subject,
      fullSubject: subject,
      score: Math.round((stats.correct / stats.total) * 100),
      correct: stats.correct,
      total: stats.total
    })).sort((a, b) => b.score - a.score);

    // Recent performance trend (last 10 questions)
    const recentResults = results.slice(-10);
    const recentPerformance = recentResults.map((result, index) => ({
      question: index + 1,
      correct: result.isCorrect ? 100 : 0,
      subject: result.subject
    }));

    // Identify strengths and weaknesses
    const strengths = subjectPerformance.filter(s => s.score >= 70).slice(0, 3);
    const weaknesses = subjectPerformance.filter(s => s.score < 70).slice(0, 3);

    return {
      overallScore,
      totalQuestions: results.length,
      correctAnswers,
      subjectPerformance,
      recentPerformance,
      strengths,
      weaknesses
    };
  }, [results]);

  const pieData = analytics.subjectPerformance.map((subject, index) => ({
    name: subject.subject,
    value: subject.total,
    color: `hsl(${index * 45}, 70%, 60%)`
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

  if (results.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Quiz Data Yet</h3>
            <p className="text-gray-500">Complete some quizzes to see your performance analytics here.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overallScore}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.correctAnswers} of {analytics.totalQuestions} correct
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalQuestions}</div>
            <p className="text-xs text-muted-foreground">
              Across {analytics.subjectPerformance.length} subjects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Subject</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.strengths[0]?.score || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.strengths[0]?.subject || 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Focus</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.weaknesses[0]?.score || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.weaknesses[0]?.subject || 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
            <CardDescription>Your accuracy by CFA subject area</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.subjectPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="subject" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value}% (${props.payload.correct}/${props.payload.total})`,
                    'Score'
                  ]}
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.fullSubject || label}
                />
                <Bar dataKey="score" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question Distribution</CardTitle>
            <CardDescription>Questions answered by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Your Strengths</CardTitle>
            <CardDescription>Subjects you're performing well in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.strengths.length > 0 ? (
              analytics.strengths.map((subject, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{subject.fullSubject}</p>
                    <Progress value={subject.score} className="mt-2" />
                  </div>
                  <Badge variant="secondary" className="ml-4">
                    {subject.score}%
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Complete more questions to identify strengths</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-orange-700">Areas for Improvement</CardTitle>
            <CardDescription>Subjects that need more focus</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.weaknesses.length > 0 ? (
              analytics.weaknesses.map((subject, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{subject.fullSubject}</p>
                    <Progress value={subject.score} className="mt-2" />
                  </div>
                  <Badge variant="outline" className="ml-4">
                    {subject.score}%
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Great job! No weak areas identified yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Performance Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Performance Trend</CardTitle>
          <CardDescription>Your last 10 questions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.recentPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="question" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value) => [value === 100 ? 'Correct' : 'Incorrect', 'Answer']}
              />
              <Bar dataKey="correct" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
