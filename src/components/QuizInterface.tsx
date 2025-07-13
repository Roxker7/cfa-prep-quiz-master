
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, RotateCcw, Filter, ArrowRight, Clock, Trophy, Target } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { StudyTimer } from "./StudyTimer";

interface Question {
  id: number;
  text: string;
  options: string[];
  answer: string;
  subject: string;
}

interface QuizInterfaceProps {
  questions: Question[];
  onQuizComplete: (results: any[]) => void;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({ questions, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState(questions);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [studyTime, setStudyTime] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedSubject === 'all') {
      setFilteredQuestions(questions);
    } else {
      setFilteredQuestions(questions.filter(q => q.subject === selectedSubject));
    }
    setCurrentQuestionIndex(0);
    setQuizResults([]);
    setIsQuizComplete(false);
  }, [selectedSubject, questions]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;

  const subjects = [...new Set(questions.map(q => q.subject))].sort();

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) {
      toast({
        title: "Please select an answer",
        description: "Choose one of the options before submitting.",
        variant: "destructive",
      });
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.answer;
    const result = {
      questionId: currentQuestion.id,
      question: currentQuestion.text,
      selectedAnswer,
      correctAnswer: currentQuestion.answer,
      isCorrect,
      subject: currentQuestion.subject,
      timestamp: new Date().toISOString(),
      studyTime
    };

    setQuizResults(prev => [...prev, result]);
    setShowResult(true);

    if (isCorrect) {
      toast({
        title: "Excellent! 🎉",
        description: "Correct answer! Keep up the great work.",
      });
    } else {
      toast({
        title: "Not quite right",
        description: `The correct answer is ${currentQuestion.answer}. Review the explanation to understand why.`,
        variant: "destructive",
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      setIsQuizComplete(true);
      onQuizComplete(quizResults);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
    setQuizResults([]);
    setIsQuizComplete(false);
    setStudyTime(0);
  };

  const correctAnswers = quizResults.filter(r => r.isCorrect).length;
  const totalAnswered = quizResults.length;

  if (isQuizComplete) {
    const finalScore = Math.round((correctAnswers / totalAnswered) * 100);
    const totalStudyTime = Math.floor(studyTime / 60);

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="text-center border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <div className="mx-auto bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-full w-fit mb-6">
              <Trophy className="h-16 w-16 text-white" />
            </div>
            <CardTitle className="text-3xl mb-2">Quiz Complete! 🎉</CardTitle>
            <CardDescription className="text-lg">
              Excellent work! Here's your detailed performance summary.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">{correctAnswers}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">{totalAnswered - correctAnswers}</div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{finalScore}%</div>
                <div className="text-sm text-gray-600">Final Score</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">{totalStudyTime}</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-inner">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Performance Analysis
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Accuracy Rate</span>
                  <Badge variant={finalScore >= 70 ? "default" : "destructive"}>
                    {finalScore >= 70 ? "Excellent" : "Needs Improvement"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Study Efficiency</span>
                  <Badge variant="outline">
                    {Math.round(totalAnswered / Math.max(totalStudyTime, 1))} Q/min
                  </Badge>
                </div>
              </div>
            </div>
            
            <Button onClick={resetQuiz} className="w-full" size="lg">
              <RotateCcw className="h-5 w-5 mr-2" />
              Start New Quiz Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 text-lg">No questions available for the selected subject.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Enhanced Quiz Header */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">
                  Question {currentQuestionIndex + 1} of {filteredQuestions.length}
                </CardTitle>
                <CardDescription className="text-base">
                  Current Score: {correctAnswers}/{totalAnswered} 
                  {totalAnswered > 0 && ` (${Math.round((correctAnswers / totalAnswered) * 100)}%)`}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {currentQuestion.subject}
                </Badge>
              </div>
            </div>
            <Progress value={progress} className="w-full h-3" />
          </CardHeader>
        </Card>

        <StudyTimer onTimeUpdate={setStudyTime} />
      </div>

      {/* Subject Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects ({questions.length} questions)</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>
                    {subject} ({questions.filter(q => q.subject === subject).length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Question Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed font-medium">
            {currentQuestion.text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            disabled={showResult}
            className="space-y-4"
          >
            {currentQuestion.options.map((option, index) => {
              const optionLetter = option.split('.')[0];
              const isSelected = selectedAnswer === optionLetter;
              const isCorrect = optionLetter === currentQuestion.answer;
              
              let cardClassName = "p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md";
              
              if (showResult) {
                if (isCorrect) {
                  cardClassName += " bg-green-50 border-green-300 shadow-green-100";
                } else if (isSelected && !isCorrect) {
                  cardClassName += " bg-red-50 border-red-300 shadow-red-100";
                } else {
                  cardClassName += " bg-gray-50 border-gray-200";
                }
              } else if (isSelected) {
                cardClassName += " bg-blue-50 border-blue-300 shadow-blue-100";
              } else {
                cardClassName += " hover:bg-gray-50 hover:border-gray-300";
              }

              return (
                <div key={index} className={cardClassName}>
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value={optionLetter} id={`option-${index}`} className="mt-1" />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base leading-relaxed">
                      {option}
                    </Label>
                    {showResult && (
                      <div className="flex-shrink-0">
                        {isCorrect ? (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="h-6 w-6" />
                            <span className="font-medium">Correct</span>
                          </div>
                        ) : isSelected ? (
                          <div className="flex items-center space-x-2 text-red-600">
                            <XCircle className="h-6 w-6" />
                            <span className="font-medium">Incorrect</span>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </RadioGroup>

          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex-1">
              {showResult && (
                <div className={`p-4 rounded-lg ${
                  selectedAnswer === currentQuestion.answer 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    {selectedAnswer === currentQuestion.answer ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                    <span className="font-medium">
                      {selectedAnswer === currentQuestion.answer 
                        ? 'Excellent! You got it right.' 
                        : `The correct answer is ${currentQuestion.answer}.`
                      }
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="ml-6">
              {!showResult ? (
                <Button 
                  onClick={handleAnswerSubmit} 
                  disabled={!selectedAnswer}
                  size="lg"
                  className="px-8"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} size="lg" className="px-8">
                  {currentQuestionIndex < filteredQuestions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  ) : (
                    <>
                      Complete Quiz
                      <Trophy className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
