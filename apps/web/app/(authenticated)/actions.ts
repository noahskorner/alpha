'use server';

import { CreateFileFacade } from '../api/files/create-file.facade';
import { CreateFileRequest } from '../api/files/create-file.request';

export const createNodeAction = async () => {
  const facade = new CreateFileFacade();

  return await facade.create({
    path: '/untitled.md',
    isFolder: false,
  } satisfies CreateFileRequest);
};
