'use client';

import {
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Folder } from './folder';
import { FileNode } from '../utils/build-file-tree';

export interface FileTreeProps {
  node: FileNode;
  path: string | null;
}

export function FileTree({ node, path }: FileTreeProps) {
  const currentPath = path ? `${path}/${node.name}` : node.name;

  if (!node.children) {
    return path ? (
      <SidebarMenuSubItem key={node.name}>
        <SidebarMenuSubButton size="sm">{node.name}</SidebarMenuSubButton>
      </SidebarMenuSubItem>
    ) : (
      <SidebarMenuItem key={node.name}>
        <SidebarMenuButton size="sm">{node.name}</SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return <Folder node={node} path={currentPath} />;
}
