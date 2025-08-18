'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FormItem } from '@/components/ui/form';
import { Wizard } from '../form/wizard';
import { Form } from '@/app/api/upload/form';
import { toast } from 'sonner';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Form | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('pdf', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setResult(data as Form);
    setLoading(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = (answers: Record<string, any>) => {
    console.log('Form submitted with answers:', answers);
    setResult(null);
    toast.success('Form submitted successfully! Check the console for details.');
  };

  const handleFormCancel = () => {
    console.log('Form cancelled');
    setResult(null);
    toast.info('Form cancelled');
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {result == null ? (
        <Card className="p-8 w-full max-w-md shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormItem>
              <Label htmlFor="pdf">PDF File</Label>
              <Input
                id="pdf"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                required
              />
            </FormItem>
            <Button type="submit" disabled={loading || !file} className="w-full">
              {loading ? 'Uploading...' : 'Save'}
            </Button>
          </form>
          {result && (
            <div className="mt-6">
              <Label>Result</Label>
              <pre className="p-2 rounded text-xs overflow-x-auto">{result}</pre>
            </div>
          )}
        </Card>
      ) : (
        <Wizard form={result} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
      )}
    </div>
  );
}
