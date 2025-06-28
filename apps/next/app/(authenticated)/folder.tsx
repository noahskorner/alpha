'use client';

import {
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { FolderNode } from './folder-node';
import { FolderGroup } from './folder-group';

export interface FolderProps {
  node: FolderNode;
  path: string | null;
}

export function Folder({ node, path }: FolderProps) {
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

  return <FolderGroup node={node} path={currentPath} />;
}
