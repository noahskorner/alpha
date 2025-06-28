'use server';

import { CreateNodeFacade } from '../api/nodes/create-node.facade';
import { CreateNodeRequest } from '../api/nodes/create-node.request';

export const createNodeAction = async () => {
  const facade = new CreateNodeFacade();

  return await facade.create({
    path: '/untitled',
    name: 'Untitled',
    isFolder: false,
  } satisfies CreateNodeRequest);
};
