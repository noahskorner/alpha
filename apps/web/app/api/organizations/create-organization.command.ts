import { CreateOrganizationRequest } from './create-organization.request';

export interface CreateOrganizationCommand extends CreateOrganizationRequest {
  userId: string;
}
