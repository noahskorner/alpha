'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { FindFileResponse } from '../../api/files/find-files.response';
import { buildFileTree, FileNode } from '../../utils/build-file-tree';
import { CreateFileResponse } from '../../api/files/create-file.response';
import { toast } from 'sonner';
import { CreateFileRequest } from '../../api/files/create-file.request';
import { ROUTES } from '../../routes';
import { useRouter } from 'next/navigation';

type FilesContextType = {
  files: FindFileResponse[];
  tree: FileNode[];
  createFile: (request: CreateFileRequest) => Promise<void>;
  createFolder: (request: CreateFileRequest) => Promise<void>;
};

const FilesContext = createContext<FilesContextType>({
  files: [],
  tree: [],
  createFile: async (request: CreateFileRequest) => {},
  createFolder: async (request: CreateFileRequest) => {},
});

export interface FilesProviderProps {
  children: ReactNode;
  files: FindFileResponse[];
}

export const FilesProvider = ({ files: initialFiles, children }: FilesProviderProps) => {
  const router = useRouter();
  const [files, setFiles] = useState<FindFileResponse[]>(initialFiles);
  const tree = useMemo(() => {
    return buildFileTree(files);
  }, [files]);

  const createFile = async (request: CreateFileRequest) => {
    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const file: CreateFileResponse = await response.json();
      setFiles((prevFiles) => [...prevFiles, file]);

      router.push(ROUTES.dashboard.detail(file.id));
      toast.success('Successfully created new file!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create new file. Please try again later.');
    }
  };

  const createFolder = async (request: CreateFileRequest) => {
    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const folder: CreateFileResponse = await response.json();
      setFiles((prevFiles) => [...prevFiles, folder]);

      toast.success('Successfully created new folder!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create new folder. Please try again later.');
    }
  };

  return (
    <FilesContext.Provider
      value={{
        files,
        tree: tree,
        createFile,
        createFolder,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
};

export const useFiles = () => {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error('useFiles must be used within a FilesProvider');
  }
  return context;
};
