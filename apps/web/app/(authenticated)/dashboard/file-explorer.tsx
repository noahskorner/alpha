'use client';

import { SidebarMenu } from '@/components/ui/sidebar';
import { useFiles } from './file-context';
import { FileTree } from './file-tree';

export function FileExplorer() {
  const { tree } = useFiles();

  return (
    <SidebarMenu>
      {tree.map((file) => (
        <FileTree key={file.id} file={file} />
      ))}
    </SidebarMenu>
  );
}
