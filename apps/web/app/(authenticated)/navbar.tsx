'use client';

import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { SquarePen } from 'lucide-react';
import { toast } from 'sonner';
import { createNodeAction } from './actions';
import { useRouter } from 'next/navigation';

export interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const router = useRouter();

  const onCreateFileClick = async () => {
    try {
      const node = await createNodeAction();

      router.push(node.id);
      toast.success('Successfully created new file!');
    } catch {
      toast.error('Failed to create new file. Please try again later.');
    }
  };

  return (
    <nav className={`w-full bg-sidebar border-b p-2 flex items-center fixed ${className ?? ''}`}>
      <SidebarTrigger className="cursor-pointer" />
      <Button onClick={onCreateFileClick} variant="ghost" size={'icon'} className="size-7">
        <SquarePen />
      </Button>
      <ThemeSwitcher />
    </nav>
  );
}
