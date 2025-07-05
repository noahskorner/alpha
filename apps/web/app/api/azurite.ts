import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';

const AZURITE_ENDPOINT = process.env.AZURITE_ENDPOINT!;
const AZURITE_ACCOUNT = process.env.AZURITE_ACCOUNT!;
const AZURITE_KEY = process.env.AZURITE_KEY!;

export const blobServiceClient = new BlobServiceClient(
  AZURITE_ENDPOINT,
  new StorageSharedKeyCredential(AZURITE_ACCOUNT, AZURITE_KEY)
);
