import { cookies } from 'next/headers';
import { Sidebar } from './sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Navbar } from './navbar';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Navbar className="top-0 h-10" />
      <Sidebar className="top-10" />
      <main className="w-full pt-10">{children}</main>
    </SidebarProvider>
  );
}
