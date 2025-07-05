import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { FileExplorer } from './file-explorer';
import { Navbar } from './navbar';
import { AccountDropdown } from './account-dropdown';

export interface SidebarProps {
  email: string;
  className?: string;
}

export async function Sidebar({ email, className }: SidebarProps) {
  return (
    <SidebarComponent className={className}>
      <SidebarHeader className="p-0">
        <Navbar className="w-sidebar" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Files</SidebarGroupLabel>
          <SidebarGroupContent>
            <FileExplorer />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AccountDropdown
          user={{
            name: '',
            email: email,
            avatar: '',
          }}
        />
      </SidebarFooter>
    </SidebarComponent>
  );
}
