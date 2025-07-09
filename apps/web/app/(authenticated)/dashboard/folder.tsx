'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar';
import { FileTree, FileTreeProps } from './file-tree';
import { useState } from 'react';
import {
  ChevronRight,
  FolderOpen,
  PencilLine,
  SquarePen,
  Trash,
} from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '../../../components/ui/context-menu';
import { useFiles } from './file-context';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FolderProps extends FileTreeProps {}

export function Folder({ file: node }: FolderProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { createFile, createFolder } = useFiles();

  const onCreateFileClick = () => {
    return createFile({
      path: `${node.path}/untitled.md`,
      isFolder: false,
    });
  };

  const onCreateFolderClick = () => {
    return createFolder({
      path: `${node.path}/untitled`,
      isFolder: true,
    });
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group/collapsible [&[data-state=open]>li>button>svg:first-child]:rotate-90"
    >
      <SidebarMenuItem>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton size="sm">
                <ChevronRight className="transition-transform" />
                {node.name}
              </SidebarMenuButton>
            </CollapsibleTrigger>
          </ContextMenuTrigger>

          <ContextMenuContent className="w-48">
            <ContextMenuItem onClick={onCreateFolderClick} className="text-xs">
              <FolderOpen /> New folder...
            </ContextMenuItem>
            <ContextMenuItem onClick={onCreateFileClick} className="text-xs">
              <SquarePen /> New file...
            </ContextMenuItem>
            <ContextMenuItem className="text-xs">
              <PencilLine /> Rename
            </ContextMenuItem>
            <ContextMenuItem variant="destructive" className="text-xs">
              <Trash /> Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        {(node.children?.length ?? 0) > 0 && (
          <CollapsibleContent>
            <SidebarMenuSub className="ml-1 mr-0 pl-1 pr-0">
              {node.children?.map((child) => (
                <FileTree key={child.name} file={child} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
}
