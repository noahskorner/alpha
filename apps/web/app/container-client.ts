import {
  BlobServiceClient,
  ContainerClient,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';

const endpoint = process.env.AZURITE_ENDPOINT!;
const account = process.env.AZURITE_ACCOUNT!;
const accountKey = process.env.AZURITE_KEY!;

const credential = new StorageSharedKeyCredential(account, accountKey);

let containerClient: ContainerClient | null = null;
export async function getContainerClient(): Promise<ContainerClient> {
  const blobServiceClient = new BlobServiceClient(endpoint, credential);
  containerClient = blobServiceClient.getContainerClient('files');
  await containerClient.createIfNotExists();

  return containerClient;
}
