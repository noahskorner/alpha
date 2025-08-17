'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem } from '@/components/ui/form';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('name', name);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
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
          <FormItem>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormItem>
          <Button type="submit" disabled={loading || !file || !name} className="w-full">
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
    </div>
  );
}
