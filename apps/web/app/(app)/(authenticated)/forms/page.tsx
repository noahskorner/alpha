'use client';

import type React from 'react';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Brain,
  Plus,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  aiAnalysis?: {
    formFields: number;
    confidence: number;
    type: string;
  };
}

export default function UploadPDFs() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: '1',
      name: 'employee-application-form.pdf',
      size: 2.4,
      status: 'completed',
      progress: 100,
      aiAnalysis: {
        formFields: 12,
        confidence: 95,
        type: 'Employment Form',
      },
    },
    {
      id: '2',
      name: 'insurance-claim-form.pdf',
      size: 1.8,
      status: 'processing',
      progress: 75,
    },
    {
      id: '3',
      name: 'tax-document-2024.pdf',
      size: 3.2,
      status: 'uploading',
      progress: 45,
    },
  ]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === 'application/pdf'
    );
    if (files.length > 0) {
      await uploadFiles(files);
    }
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      (file) => file.type === 'application/pdf'
    );
    if (files.length > 0) {
      await uploadFiles(files);
    }
    // Reset input
    e.target.value = '';
  }, []);

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);

    for (const file of files) {
      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

      // Add file to state with uploading status
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size / (1024 * 1024), // Convert to MB
        status: 'uploading',
        progress: 0,
      };

      setUploadedFiles((prev) => [...prev, newFile]);

      try {
        // Create FormData for multipart upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file.name);
        formData.append('contentType', 'application/pdf');

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileId && f.progress < 90 ? { ...f, progress: f.progress + 10 } : f
            )
          );
        }, 200);

        // Upload to API
        const response = await fetch('/api/files', {
          method: 'POST',
          body: formData,
        });

        clearInterval(progressInterval);

        if (response.ok) {
          const result = await response.json();
          console.log(result);

          // Update file status to processing
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === fileId ? { ...f, status: 'processing', progress: 100 } : f))
          );

          // Simulate AI processing
          setTimeout(() => {
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.id === fileId
                  ? {
                      ...f,
                      status: 'completed',
                      aiAnalysis: {
                        formFields: Math.floor(Math.random() * 20) + 5,
                        confidence: Math.floor(Math.random() * 20) + 80,
                        type: [
                          'Employment Form',
                          'Insurance Form',
                          'Tax Document',
                          'Application Form',
                        ][Math.floor(Math.random() * 4)],
                      },
                    }
                  : f
              )
            );
          }, 2000);
        } else {
          // Handle upload error
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === fileId ? { ...f, status: 'error', progress: 0 } : f))
          );
        }
      } catch (error) {
        console.error('Upload failed:', error);
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, status: 'error', progress: 0 } : f))
        );
      }
    }

    setIsUploading(false);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((files) => files.filter((file) => file.id !== fileId));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Brain className="h-4 w-4 text-blue-600 animate-pulse" />;
      case 'uploading':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'uploading':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatFileSize = (sizeInMB: number) => {
    return `${sizeInMB.toFixed(1)} MB`;
  };

  const completedFiles = uploadedFiles.filter((file) => file.status === 'completed');
  const processingFiles = uploadedFiles.filter((file) => file.status !== 'completed');

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h2 className="text-3xl font-bold text-foreground">Upload PDF Documents</h2>
            <p className="text-muted-foreground">
              Upload your PDF forms to be analyzed and converted by AI
            </p>
          </div>

          {/* Upload Area */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Drag and drop your PDF files here
                </h3>
                <p className="text-muted-foreground mb-4">or click to browse and select files</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  disabled={isUploading}
                />
                <Button
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isUploading}
                >
                  <label htmlFor="file-upload">
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      {isUploading ? 'Uploading...' : 'Select PDF Files'}
                    </>
                  </label>
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Supported format: PDF • Max file size: 10MB per file
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Processing Files */}
          {processingFiles.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg text-card-foreground">Processing Files</CardTitle>
                <CardDescription>Files currently being uploaded and analyzed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {processingFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg"
                    >
                      <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(file.status)}>
                              {getStatusIcon(file.status)}
                              <span className="ml-1 capitalize">{file.status}</span>
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={file.progress} className="flex-1" />
                          <span className="text-xs text-muted-foreground">{file.progress}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatFileSize(file.size)} •{' '}
                          {file.status === 'uploading' ? 'Uploading...' : 'AI analyzing...'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Completed Files */}
          {completedFiles.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg text-card-foreground">Completed Analysis</CardTitle>
                <CardDescription>Successfully processed and ready for grouping</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center space-x-4 p-3 bg-green-50 dark:bg-green-800 border border-green-200 dark:border-green-700 rounded-lg"
                    >
                      <FileText className="h-8 w-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(file.status)}>
                              {getStatusIcon(file.status)}
                              <span className="ml-1">Completed</span>
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {file.aiAnalysis && (
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span>{file.aiAnalysis.formFields} form fields detected</span>
                            <span>•</span>
                            <span>{file.aiAnalysis.confidence}% confidence</span>
                            <span>•</span>
                            <span className="text-green-600 font-medium">
                              {file.aiAnalysis.type}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          {completedFiles.length > 0 && (
            <div className="flex justify-between items-center pt-4">
              <p className="text-sm text-muted-foreground">
                {completedFiles.length} file{completedFiles.length !== 1 ? 's' : ''} ready for
                grouping
              </p>
              <div className="space-x-2">
                <Button variant="outline">Upload More Files</Button>
                <Link href="/">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Create Document Group
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Empty State */}
          {uploadedFiles.length === 0 && (
            <div className="text-center py-12">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No files uploaded yet</h3>
              <p className="text-muted-foreground">
                Start by uploading your PDF documents to begin the AI analysis process
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
