
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, RotateCcw, Filter, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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
      timestamp: new Date().toISOString()
    };

    setQuizResults(prev => [...prev, result]);
    setShowResult(true);

    if (isCorrect) {
      toast({
        title: "Correct! 🎉",
        description: "Well done! Moving to the next question.",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer is ${currentQuestion.answer}.`,
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
  };

  const correctAnswers = quizResults.filter(r => r.isCorrect).length;
  const totalAnswered = quizResults.length;

  if (isQuizComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto bg-green-100 p-4 rounded-full w-fit mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            <CardDescription>
              Great job completing the quiz. Here's your performance summary.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{correctAnswers}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{totalAnswered - correctAnswers}</div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round((correctAnswers / totalAnswered) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
            </div>
            
            <Button onClick={resetQuiz} className="w-full" size="lg">
              <RotateCcw className="h-4 w-4 mr-2" />
              Take Quiz Again
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
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No questions available for the selected subject.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">
                Question {currentQuestionIndex + 1} of {filteredQuestions.length}
              </CardTitle>
              <CardDescription>
                Current Score: {correctAnswers}/{totalAnswered} 
                {totalAnswered > 0 && ` (${Math.round((correctAnswers / totalAnswered) * 100)}%)`}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{currentQuestion.subject}</Badge>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">
            {currentQuestion.text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            disabled={showResult}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => {
              const optionLetter = option.split('.')[0];
              const isSelected = selectedAnswer === optionLetter;
              const isCorrect = optionLetter === currentQuestion.answer;
              
              let cardClassName = "p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50";
              
              if (showResult) {
                if (isCorrect) {
                  cardClassName += " bg-green-50 border-green-200";
                } else if (isSelected && !isCorrect) {
                  cardClassName += " bg-red-50 border-red-200";
                }
              } else if (isSelected) {
                cardClassName += " bg-blue-50 border-blue-200";
              }

              return (
                <div key={index} className={cardClassName}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={optionLetter} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                    {showResult && (
                      <div>
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : isSelected ? (
                          <XCircle className="h-5 w-5 text-red-600" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </RadioGroup>

          <div className="flex justify-between pt-4">
            <div className="flex-1">
              {showResult && (
                <div className={`p-3 rounded-lg ${
                  selectedAnswer === currentQuestion.answer 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-red-50 text-red-800'
                }`}>
                  {selectedAnswer === currentQuestion.answer 
                    ? '✅ Correct! Well done.' 
                    : `❌ Incorrect. The correct answer is ${currentQuestion.answer}.`
                  }
                </div>
              )}
            </div>
            <div className="ml-4">
              {!showResult ? (
                <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer}>
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion}>
                  {currentQuestionIndex < filteredQuestions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    'Complete Quiz'
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
