'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Form, FormField } from '@/app/api/upload/form';
import { QuestionComponent } from './question';

interface WizardProps {
  form: Form;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?: (answers: Record<string, any>) => void;
  onCancel?: () => void;
}

export function Wizard({ form, onSubmit, onCancel }: WizardProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [visibleQuestions, setVisibleQuestions] = useState<FormField[]>([]);

  // Filter questions based on display rules and dependencies
  useEffect(() => {
    const filterQuestions = () => {
      return form.pages
        .flatMap((p) => p.fields)
        .filter((question) => {
          if (!question.dependency) return true;

          const { all, any } = question.dependency;

          // Check "all" conditions (AND logic)
          if (all && all.length > 0) {
            const allMatch = all.every((condition) => {
              const answerValue = answers[condition.questionId];
              if (condition.equals !== null) {
                return condition.not
                  ? answerValue !== condition.equals
                  : answerValue === condition.equals;
              }
              if (condition.in && condition.in.length > 0) {
                const inMatch = condition.in.includes(answerValue);
                return condition.not ? !inMatch : inMatch;
              }
              return true;
            });
            if (!allMatch) return false;
          }

          // Check "any" conditions (OR logic)
          if (any && any.length > 0) {
            const anyMatch = any.some((condition) => {
              const answerValue = answers[condition.questionId];
              if (condition.equals !== null) {
                return condition.not
                  ? answerValue !== condition.equals
                  : answerValue === condition.equals;
              }
              if (condition.in && condition.in.length > 0) {
                const inMatch = condition.in.includes(answerValue);
                return condition.not ? !inMatch : inMatch;
              }
              return true;
            });
            if (!anyMatch) return false;
          }

          return true;
        });
    };

    const filtered = filterQuestions();
    setVisibleQuestions(filtered);

    // Adjust current question index if it's out of bounds
    if (currentQuestionIndex >= filtered.length && filtered.length > 0) {
      setCurrentQuestionIndex(filtered.length - 1);
    }
  }, [form.pages, answers, currentQuestionIndex]);

  const currentQuestion = visibleQuestions[currentQuestionIndex];
  const progress =
    visibleQuestions.length > 0 ? ((currentQuestionIndex + 1) / visibleQuestions.length) * 100 : 0;
  const isLastQuestion = currentQuestionIndex === visibleQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAnswerChange = (questionName: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionName]: value,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onSubmit?.(answers);
    } else {
      setCurrentQuestionIndex((prev) => Math.min(prev + 1, visibleQuestions.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  const canProceed = () => {
    if (!currentQuestion) return false;
    const answer = answers[currentQuestion.name];

    // Check if required question has an answer
    if (currentQuestion.required && (answer === undefined || answer === null || answer === '')) {
      return false;
    }

    return true;
  };

  if (!currentQuestion) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No questions available to display.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Question {currentQuestionIndex + 1} of {visibleQuestions.length}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Form Header */}
      <Card>
        <CardHeader>
          <CardTitle>Lorem ipsum dolor sit amet.</CardTitle>
          <CardDescription>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eos nesciunt natus dolorem
            architecto fuga quasi unde debitis dolorum a facere.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.label}</CardTitle>
          {currentQuestion.description && (
            <CardDescription>{currentQuestion.description}</CardDescription>
          )}
          {currentQuestion.required && <span className="text-sm text-destructive">* Required</span>}
        </CardHeader>
        <CardContent>
          <QuestionComponent
            question={currentQuestion}
            value={answers[currentQuestion.name]}
            onChange={(value) => handleAnswerChange(currentQuestion.name, value)}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={isFirstQuestion ? onCancel : handlePrevious}
          disabled={false}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {isFirstQuestion ? 'Cancel' : 'Previous'}
        </Button>

        <Button onClick={handleNext} disabled={!canProceed()}>
          {isLastQuestion ? 'Submit' : 'Next'}
          {!isLastQuestion && <ChevronRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}
