import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { Folder } from './folder';
import { FolderNode } from './folder-node';

const tree: FolderNode = {
  name: 'root',
  children: [
    {
      name: 'folder1',
      children: [{ name: 'file1.txt' }, { name: 'file2.txt' }],
    },
    {
      name: 'folder2',
      children: [
        {
          name: 'subfolder1',
          children: [{ name: 'file3.txt' }],
        },
      ],
    },
    { name: 'file4.txt' },
  ],
};

export interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <SidebarComponent className={className}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Folder node={tree} path={null} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
}
