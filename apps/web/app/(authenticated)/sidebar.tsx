import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { FileExplorer } from './file-explorer';
import { Navbar } from './navbar';

export interface SidebarProps {
  className?: string;
}

export async function Sidebar({ className }: SidebarProps) {
  return (
    <SidebarComponent className={className}>
      <SidebarHeader className="p-0">
        <Navbar className="w-sidebar" />
      </SidebarHeader>
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
