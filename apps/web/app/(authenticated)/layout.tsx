import { cookies } from 'next/headers';
import { Sidebar } from './sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
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
        <Sidebar />
        <SidebarTrigger className="cursor-pointer relative top-2 left-2" />
        <main className="w-full pt-10">{children}</main>
      </FilesProvider>
    </SidebarProvider>
  );
}
