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
import { cn } from '../../../lib/utils';

export interface SidebarProps {
  email: string;
  className?: string;
}

export async function Sidebar({ email, className }: SidebarProps) {
  return (
    <SidebarComponent className={cn('border-r-none', className)}>
      <SidebarHeader className="p-0">
        <Navbar className="w-sidebar rounded-t-lg" />
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
