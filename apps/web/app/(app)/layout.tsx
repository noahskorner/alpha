import { cookies } from 'next/headers';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getServerSession } from 'next-auth';
import { auth } from '@/app/auth';
import { redirect } from 'next/navigation';
import { routes } from '@/app/routes';
import { Sidebar } from './sidebar';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(auth);
  const email = session?.user?.email;
  if (email == null) {
    return redirect(routes.signIn);
  }

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar email={email} />
      <main className="w-full relative">
        <SidebarTrigger className="cursor-pointer absolute top-2 left-2 z-10" />
        {children}
      </main>
    </SidebarProvider>
  );
}
