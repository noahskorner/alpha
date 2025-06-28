import { FileFileResponse } from '../api/files/find-files.response';

export interface FileNode {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isFolder: boolean;
  path: string;
  name: string;
  children?: FileNode[];
}

export function buildFileTree(files: FileFileResponse[]): FileNode[] {
  // Sort files so folders come first, then by path length
  files.sort((a, b) => {
    if (a.isFolder !== b.isFolder) {
      return a.isFolder ? -1 : 1;
    }
    return a.path.length - b.path.length;
  });

  const pathMap = new Map<string, FileNode>();

  // Create nodes and populate the map
  for (const file of files) {
    const node: FileNode = {
      id: file.id,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      isFolder: file.isFolder,
      path: file.path,
      name: file.path.split('/').filter(Boolean).pop() || '',
      children: file.isFolder ? [] : undefined,
    };

    pathMap.set(file.path, node);

    const parentPath = file.path.split('/').slice(0, -1).join('/');
    if (parentPath && pathMap.has(parentPath)) {
      const parent = pathMap.get(parentPath)!;
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(node);
    }
  }

  // Return top-level nodes (those without a parent)
  return Array.from(pathMap.values()).filter((node) => {
    const parentPath = node.path.split('/').slice(0, -1).join('/');
    return !parentPath || !pathMap.has(parentPath);
  });
}
