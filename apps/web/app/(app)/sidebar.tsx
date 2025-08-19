import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { AccountDropdown } from './account-dropdown';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { routes } from '../routes';

export interface SidebarProps {
  email: string;
  className?: string;
}

export async function Sidebar({ email, className }: SidebarProps) {
  return (
    <SidebarComponent className={cn('border-r-none', className)}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Data intelligence</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={routes.indexes.home}>
                    <span>Indexes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={routes.indexes.home}>
                    <span>Agents</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Document intelligence</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={routes.upload.home}>
                    <span>Upload</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={routes.forms.home}>
                    <span>Form</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={routes.forms.edit('example-id')}>
                    <span>Edit</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
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
