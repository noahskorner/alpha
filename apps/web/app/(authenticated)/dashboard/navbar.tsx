'use client';

import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { FolderOpen, SquarePen } from 'lucide-react';
import { useFiles } from './file-context';

export interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const { createFile, createFolder } = useFiles();

  const onCreateFileClick = () => {
    return createFile({
      path: 'untitled.md',
      isFolder: false,
    });
  };

  const onCreateFolderClick = () => {
    return createFolder({
      path: 'untitled',
      isFolder: true,
    });
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
