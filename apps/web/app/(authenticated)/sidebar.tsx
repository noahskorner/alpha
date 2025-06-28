import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { FindFilesFacade } from '../api/files/find-files.facade';
import { buildFileTree } from '../utils/build-file-tree';
import { FileTree } from './file-tree';

export interface SidebarProps {
  className?: string;
}

export async function Sidebar({ className }: SidebarProps) {
  const facade = new FindFilesFacade();
  const response = await facade.find();
  const files = buildFileTree(response.files);

  return (
    <SidebarComponent className={className}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {files.map((node) => (
                <FileTree key={node.name} node={node} path={node.path} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
}
