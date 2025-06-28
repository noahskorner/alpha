import { cookies } from 'next/headers';
import { Sidebar } from './sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Navbar } from './navbar';
import { FilesProvider } from './file-context';
import { FindFilesFacade } from '../api/files/find-files.facade';
import { FindFileResponse } from '../api/files/find-files.response';

const loadFiles = async (): Promise<FindFileResponse[]> => {
  try {
    const facade = new FindFilesFacade();
    const response = await facade.find();
    return response.files;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  const files = await loadFiles();

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <FilesProvider files={files}>
        <Navbar className="top-0 h-10" />
        <Sidebar className="top-10" />
        <main className="w-full pt-10">{children}</main>
      </FilesProvider>
    </SidebarProvider>
  );
}
