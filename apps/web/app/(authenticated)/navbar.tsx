'use client';

import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { FolderOpen, SquarePen } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { CreateFileRequest } from '../api/files/create-file.request';
import { CreateFileResponse } from '../api/files/create-file.response';
import { useFiles } from './file-context';

export interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const router = useRouter();
  const { addFile } = useFiles();

  const onCreateFileClick = async () => {
    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: 'untitled.md',
          isFolder: false,
        } satisfies CreateFileRequest),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const file: CreateFileResponse = await response.json();
      addFile(file);

      router.push(file.id);
      toast.success('Successfully created new file!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create new file. Please try again later.');
    }
  };

  const onCreateFolderClick = async () => {
    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: 'untitled',
          isFolder: true,
        } satisfies CreateFileRequest),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const folder: CreateFileResponse = await response.json();
      addFile(folder);

      toast.success('Successfully created new folder!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create new folder. Please try again later.');
    }
  };

  return (
    <nav className={`bg-sidebar p-2 flex items-center ${className ?? ''}`}>
      <Button onClick={onCreateFileClick} variant="ghost" size={'icon'} className="size-7">
        <SquarePen />
      </Button>
      <Button onClick={onCreateFolderClick} variant="ghost" size={'icon'} className="size-7">
        <FolderOpen />
      </Button>
      <ThemeSwitcher />
    </nav>
  );
}
