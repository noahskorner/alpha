'use client';

import dynamic from 'next/dynamic';

const EditForm = dynamic(() => import('./edit-form'), {
  ssr: false,
});

export default function EditFormPage() {
  return <EditForm />;
}
