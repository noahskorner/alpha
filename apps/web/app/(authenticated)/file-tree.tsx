'use client';

import {
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Folder } from './folder';
import { FileNode } from '../utils/build-file-tree';
import Link from 'next/link';

export interface FileTreeProps {
  file: FileNode;
}

export function FileTree({ file }: FileTreeProps) {
  if (!file.children) {
    return file.children ? (
      <SidebarMenuSubItem key={file.name}>
        <SidebarMenuSubButton size="sm" asChild>
          <Link href={file.id}>{file.name}</Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    ) : (
      <SidebarMenuItem key={file.name}>
        <SidebarMenuButton size="sm" asChild>
          <Link href={file.id}>{file.name}</Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return <Folder file={file} />;
}
