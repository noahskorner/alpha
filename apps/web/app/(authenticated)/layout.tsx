import { cookies } from 'next/headers';
import { Sidebar } from './sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getServerSession } from 'next-auth';
import { AUTH } from '@/app/auth';
import { redirect } from 'next/navigation';
import { routes } from '@/app/routes';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(AUTH);
  const email = session?.user?.email;
  if (email == null) {
    return redirect(routes.signIn);
  }

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar email={email} />
      <SidebarTrigger className="cursor-pointer relative top-2 left-2 z-10" />
      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
}
