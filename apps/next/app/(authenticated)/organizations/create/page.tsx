import CreateOrganizationForm from './create-organization-form';

export default async function CreateOrganizationPage() {
  return (
    <div className="w-full flex items-center justify-center p-8">
      <div className="w-full max-w-xl">
        <CreateOrganizationForm />
      </div>
    </div>
  );
}
