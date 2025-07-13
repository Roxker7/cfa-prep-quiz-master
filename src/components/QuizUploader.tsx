
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuizUploaderProps {
  onQuestionsExtracted: (questions: any[]) => void;
}

export const QuizUploader: React.FC<QuizUploaderProps> = ({ onQuestionsExtracted }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedCount, setExtractedCount] = useState(0);
  const { toast } = useToast();

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      toast({
        title: "PDF Selected",
        description: `Selected: ${selectedFile.name}`,
      });
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a PDF file.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const simulateQuestionExtraction = async () => {
    setIsProcessing(true);
    setProgress(0);
    setExtractedCount(0);

    // Simulate PDF processing with progress updates
    const totalSteps = 100;
    const sampleQuestions = [];

    // Generate sample CFA questions for demonstration
    const subjects = [
      'Ethical and Professional Standards',
      'Quantitative Methods', 
      'Portfolio Management',
      'Alternative Investments',
      'Equity Investments',
      'Corporate Issuers',
      'Derivatives',
      'Fixed Income'
    ];

    const sampleQuestionTemplates = [
      {
        text: "Which of the following statements about the CFA Institute Code of Ethics is most accurate?",
        options: [
          "A. Members must comply with applicable laws and regulations",
          "B. Members should strive to maintain professional competence",
          "C. Both A and B are correct"
        ],
        answer: "C"
      },
      {
        text: "The primary objective of the Global Investment Performance Standards (GIPS) is to:",
        options: [
          "A. Ensure fair representation of investment performance",
          "B. Standardize performance calculation methods",
          "C. Promote investor confidence in performance presentations"
        ],
        answer: "A"
      },
      {
        text: "In portfolio management, which of the following best describes diversification?",
        options: [
          "A. Investing in different asset classes",
          "B. Reducing portfolio risk without sacrificing expected returns",
          "C. Spreading investments across various securities"
        ],
        answer: "B"
      }
    ];

    for (let i = 0; i < totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setProgress((i + 1) / totalSteps * 100);
      
      // Add sample questions at intervals
      if (i % 10 === 0 && i > 0) {
        const questionIndex = Math.floor(i / 10) - 1;
        if (questionIndex < sampleQuestionTemplates.length) {
          const template = sampleQuestionTemplates[questionIndex];
          sampleQuestions.push({
            id: questionIndex + 1,
            text: `${questionIndex + 1}. ${template.text}`,
            options: template.options,
            answer: template.answer,
            subject: subjects[questionIndex % subjects.length]
          });
          setExtractedCount(sampleQuestions.length);
        }
      }
    }

    // Add more sample questions to make it realistic
    for (let i = 0; i < 25; i++) {
      const template = sampleQuestionTemplates[i % sampleQuestionTemplates.length];
      sampleQuestions.push({
        id: i + 4,
        text: `${i + 4}. ${template.text}`,
        options: template.options,
        answer: template.answer,
        subject: subjects[i % subjects.length]
      });
    }

    setExtractedCount(sampleQuestions.length);
    setIsProcessing(false);

    toast({
      title: "Extraction Complete!",
      description: `Successfully extracted ${sampleQuestions.length} questions from your PDF.`,
    });

    onQuestionsExtracted(sampleQuestions);
  };

  const handleProcessFile = () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a PDF file first.",
        variant: "destructive",
      });
      return;
    }
    simulateQuestionExtraction();
  };

  return (
    <div className="space-y-6">
      <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit mb-4">
            <Upload className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle>Upload CFA Question Bank PDF</CardTitle>
          <CardDescription>
            Select your CFA Level 1 question bank PDF file to extract questions and answers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload"
            />
            <label htmlFor="pdf-upload" className="cursor-pointer">
              <Button variant="outline" className="w-full flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>{file ? file.name : "Choose PDF File"}</span>
              </Button>
            </label>
            
            {file && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">PDF file selected: {file.name}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {file && !isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle>Ready to Process</CardTitle>
            <CardDescription>
              Click the button below to extract questions from your PDF
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleProcessFile} className="w-full" size="lg">
              <Upload className="h-4 w-4 mr-2" />
              Extract Questions from PDF
            </Button>
          </CardContent>
        </Card>
      )}

      {isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Processing PDF...</span>
            </CardTitle>
            <CardDescription>
              Extracting questions and answers from your PDF file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress: {Math.round(progress)}%</span>
              <span>Questions extracted: {extractedCount}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> This demo uses sample CFA questions for demonstration. 
          In a production version, the system would parse your actual PDF using advanced text extraction algorithms 
          to identify questions, multiple-choice options, and corresponding answers from the solutions section.
        </AlertDescription>
      </Alert>
    </div>
  );
};
