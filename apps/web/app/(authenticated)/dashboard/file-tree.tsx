'use client';

import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Folder } from './folder';
import { FileNode } from '../../utils/build-file-tree';
import Link from 'next/link';
import { ROUTES } from '@/app/routes';

export interface FileTreeProps {
  file: FileNode;
}

export function FileTree({ file }: FileTreeProps) {
  return file.isFolder ? (
    <Folder file={file} />
  ) : (
    <SidebarMenuItem key={file.name}>
      <SidebarMenuButton size="sm" asChild>
        <Link href={ROUTES.dashboard.detail(file.id)}>{file.name}</Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
