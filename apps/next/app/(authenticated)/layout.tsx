import { cookies } from 'next/headers';
import { Sidebar } from './sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar />
      <main className="w-full">
        <nav className="p-2">
          <SidebarTrigger className="cursor-pointer" />
          <ThemeSwitcher />
        </nav>
        {children}
      </main>
    </SidebarProvider>
  );
}
