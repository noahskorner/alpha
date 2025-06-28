'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar';
import { FileTree, FileTreeProps } from './file-tree';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export interface FolderProps extends FileTreeProps {}

export function Folder({ node, path }: FolderProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton size="sm">
            {isOpen ? (
              <ChevronDown className="text-muted-foreground" />
            ) : (
              <ChevronRight className="text-muted-foreground" />
            )}
            {node.name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="ml-1 mr-0 pl-1 pr-0">
            {node.children?.map((child) => (
              <FileTree key={child.name} node={child} path={path} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
