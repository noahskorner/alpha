'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { FindFileResponse } from '../../api/files/find-files.response';
import { buildFileTree, FileNode } from '../../utils/build-file-tree';
import { CreateFileResponse } from '../../api/files/create-file.response';

type FilesContextType = {
  files: FindFileResponse[];
  tree: FileNode[];
  addFile: (file: CreateFileResponse) => void;
};

const FilesContext = createContext<FilesContextType>({
  files: [],
  tree: [],
  addFile: () => {},
});

export interface FilesProviderProps {
  children: ReactNode;
  files: FindFileResponse[];
}

export const FilesProvider = ({ files: initialFiles, children }: FilesProviderProps) => {
  const [files, setFiles] = useState<FindFileResponse[]>(initialFiles);
  const tree = useMemo(() => {
    return buildFileTree(files);
  }, [files]);

  const addFile = (file: CreateFileResponse) => {
    setFiles((prevFiles) => [...prevFiles, file]);
  };

  return (
    <FilesContext.Provider value={{ files, tree: tree, addFile }}>{children}</FilesContext.Provider>
  );
};

export const useFiles = () => {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error('useFiles must be used within a FilesProvider');
  }
  return context;
};
