import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { FileExplorer } from './file-explorer';
import { Navbar } from './navbar';
import { AccountDropdown } from './account-dropdown';
import { cn } from '../../../lib/utils';

export interface SidebarProps {
  email: string;
  className?: string;
}

export async function Sidebar({ email, className }: SidebarProps) {
  return (
    <SidebarComponent className={cn(className)}>
      <SidebarHeader className="p-0">
        <Navbar className="w-sidebar rounded-t-lg" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarSeparator className="mx-0" />
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
