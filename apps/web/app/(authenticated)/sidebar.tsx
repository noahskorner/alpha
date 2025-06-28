import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@/components/ui/sidebar';
import { FileExplorer } from './file-explorer';

export interface SidebarProps {
  className?: string;
}

export async function Sidebar({ className }: SidebarProps) {
  return (
    <SidebarComponent className={className}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <FileExplorer />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
}
