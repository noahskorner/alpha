'use client';

import type React from 'react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Question } from '@/app/api/upload/form';

interface QuestionProps {
  question: Question;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: any) => void;
}

export function QuestionComponent({ question, value, onChange }: QuestionProps) {
  const { type, placeholder, options, validation, readOnly } = question;

  // Handle validation for input fields
  const getInputProps = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props: any = {
      placeholder: placeholder || '',
      disabled: readOnly || false,
      value: value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        onChange(e.target.value),
    };

    if (validation) {
      if (validation.minLength) props.minLength = validation.minLength;
      if (validation.maxLength) props.maxLength = validation.maxLength;
      if (validation.pattern) props.pattern = validation.pattern;
      if (validation.min !== null) props.min = validation.min;
      if (validation.max !== null) props.max = validation.max;
    }

    return props;
  };

  switch (type) {
    case 'short_text':
      return <Input {...getInputProps()} />;

    case 'long_text':
      return <Textarea {...getInputProps()} className="min-h-[100px] resize-y" />;

    case 'number':
      return <Input {...getInputProps()} type="number" step="any" />;

    case 'date':
      return <Input {...getInputProps()} type="date" />;

    case 'time':
      return <Input {...getInputProps()} type="time" />;

    case 'email':
      return <Input {...getInputProps()} type="email" />;

    case 'url':
      return <Input {...getInputProps()} type="url" />;

    case 'boolean':
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={value || false}
            onCheckedChange={onChange}
            disabled={readOnly ?? undefined}
          />
          <Label className="text-sm text-muted-foreground">{value ? 'Yes' : 'No'}</Label>
        </div>
      );

    case 'select_one':
      if (!options || options.length === 0) {
        return <p className="text-muted-foreground">No options available</p>;
      }

      // Use radio group for better UX with few options, select for many
      if (options.length <= 4) {
        return (
          <RadioGroup value={value || ''} onValueChange={onChange} disabled={readOnly ?? undefined}>
            {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              options.map((option: any) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label || option.value}</Label>
                </div>
              ))
            }
          </RadioGroup>
        );
      }

      return (
        <Select value={value || ''} onValueChange={onChange} disabled={readOnly ?? undefined}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option..." />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label || option.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'select_many':
      if (!options || options.length === 0) {
        return <p className="text-muted-foreground">No options available</p>;
      }

      const selectedValues = Array.isArray(value) ? value : [];

      return (
        <div className="space-y-3">
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={selectedValues.includes(option.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onChange([...selectedValues, option.value]);
                  } else {
                    onChange(selectedValues.filter((v: string) => v !== option.value));
                  }
                }}
                disabled={readOnly ?? undefined}
              />
              <Label htmlFor={option.value}>{option.label || option.value}</Label>
            </div>
          ))}
        </div>
      );

    case 'signature':
      return (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <p className="text-muted-foreground">Signature field - Implementation needed</p>
          <Input
            placeholder="Type your name as signature"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={readOnly ?? undefined}
            className="mt-4"
          />
        </div>
      );

    default:
      return <div className="text-muted-foreground">Unsupported question type: {type}</div>;
  }
}
