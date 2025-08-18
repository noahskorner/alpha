'use client';

import { Form } from '@/app/api/upload/form';
import { Wizard } from './wizard';

// Example form data
const sampleForm: Form = {
  pages: [
    {
      name: 'Page 1',
      description: 'IRS Form W-9 (Rev. March 2024)',
      questions: [
        {
          name: 'legal_name',
          label: 'Name of entity/individual',
          description: '.',
          type: 'short_text',
          required: false,
          readOnly: false,
          placeholder: '.',
          defaultValue: null,
          options: null,
          validation: null,
          dependency: null,
          group: '.',
          anchors: [
            {
              keyId: 'keys/0',
              valueId: '',
              selectionMarkId: '',
              lineId: '',
            },
          ],
        },
        {
          name: 'business_name',
          label: 'Business name/disregarded entity name (if different from above)',
          description: '.',
          type: 'short_text',
          required: false,
          readOnly: false,
          placeholder: '.',
          defaultValue: null,
          options: null,
          validation: null,
          dependency: null,
          group: '.',
          anchors: [
            {
              keyId: 'keys/1',
              valueId: '',
              selectionMarkId: '',
              lineId: '',
            },
          ],
        },
        {
          name: 'federal_tax_classification',
          label: 'Federal tax classification (check only one)',
          description:
            '3a Check the appropriate box for federal tax classification of the entity/individual whose name is entered on line 1. Check only one of the following seven boxes.',
          type: 'select_one',
          required: false,
          readOnly: false,
          placeholder: '.',
          defaultValue: null,
          options: [
            {
              value: 'individual_sole_proprietor',
              label: 'Individual/sole proprietor',
              exportValue: '.',
              anchors: [
                {
                  keyId: 'keys/2',
                  valueId: 'values/2',
                  selectionMarkId: '',
                  lineId: '',
                },
              ],
            },
            {
              value: 'c_corporation',
              label: 'C corporation',
              exportValue: '.',
              anchors: [
                {
                  keyId: 'keys/3',
                  valueId: 'values/3',
                  selectionMarkId: '',
                  lineId: '',
                },
              ],
            },
            {
              value: 's_corporation',
              label: 'S corporation',
              exportValue: '.',
              anchors: [
                {
                  keyId: 'keys/4',
                  valueId: 'values/4',
                  selectionMarkId: '',
                  lineId: '',
                },
              ],
            },
            {
              value: 'partnership',
              label: 'Partnership',
              exportValue: '.',
              anchors: [
                {
                  keyId: 'keys/5',
                  valueId: 'values/5',
                  selectionMarkId: '',
                  lineId: '',
                },
              ],
            },
            {
              value: 'trust_estate',
              label: 'Trust/estate',
              exportValue: '.',
              anchors: [
                {
                  keyId: 'keys/6',
                  valueId: 'values/6',
                  selectionMarkId: '',
                  lineId: '',
                },
              ],
            },
            {
              value: 'llc',
              label: 'LLC',
              exportValue: '.',
              anchors: [
                {
                  keyId: 'keys/7',
                  valueId: 'values/7',
                  selectionMarkId: '',
                  lineId: '',
                },
              ],
            },
            {
              value: 'other',
              label: 'Other (see instructions)',
              exportValue: '.',
              anchors: [
                {
                  keyId: 'keys/8',
                  valueId: 'values/8',
                  selectionMarkId: '',
                  lineId: '',
                },
              ],
            },
          ],
          validation: null,
          dependency: null,
          group: '.',
          anchors: [
            {
              keyId: '',
              valueId: '',
              selectionMarkId: '',
              lineId: 'pages/0/lines/16',
            },
            {
              keyId: '',
              valueId: '',
              selectionMarkId: '',
              lineId: 'pages/0/lines/17',
            },
          ],
        },
        {
          name: 'llc_tax_classification_code',
          label: 'LLC tax classification code',
          description:
            'Enter the tax classification (C = C corporation, S = S corporation, P = Partnership).',
          type: 'short_text',
          required: false,
          readOnly: false,
          placeholder: 'C, S, or P',
          defaultValue: null,
          options: null,
          validation: {
            pattern: '.*',
            minLength: 0,
            maxLength: 0,
            min: null,
            max: null,
            allowedValues: ['C', 'S', 'P'],
          },
          dependency: {
            all: [
              {
                questionId: 'federal_tax_classification',
                equals: 'llc',
                in: null,
                not: false,
              },
            ],
            any: null,
          },
          group: '.',
          anchors: [
            {
              keyId: 'keys/7',
              valueId: '',
              selectionMarkId: '',
              lineId: '',
            },
          ],
        },
        {
          name: 'has_foreign_owners',
          label: '3b: Any foreign partners, owners, or beneficiaries (see instructions)',
          description: '.',
          type: 'boolean',
          required: false,
          readOnly: false,
          placeholder: '.',
          defaultValue: null,
          options: null,
          validation: null,
          dependency: null,
          group: '.',
          anchors: [
            {
              keyId: 'keys/10',
              valueId: 'values/10',
              selectionMarkId: '',
              lineId: 'pages/0/lines/32',
            },
          ],
        },
        {
          name: 'requester_name_address',
          label: "Requester's name and address (optional)",
          description: '.',
          type: 'long_text',
          required: false,
          readOnly: false,
          placeholder: '.',
          defaultValue: null,
          options: null,
          validation: null,
          dependency: null,
          group: '.',
          anchors: [
            {
              keyId: 'keys/11',
              valueId: '',
              selectionMarkId: '',
              lineId: '',
            },
          ],
        },
        {
          name: 'address_line1',
          label: 'Address (number, street, and apt. or suite no.)',
          description: '.',
          type: 'short_text',
          required: false,
          readOnly: false,
          placeholder: '.',
          defaultValue: null,
          options: null,
          validation: null,
          dependency: null,
          group: '.',
          anchors: [
            {
              keyId: 'keys/12',
              valueId: '',
              selectionMarkId: '',
              lineId: 'pages/0/lines/44',
            },
          ],
        },
        {
          name: 'city_state_zip',
          label: 'City, state, and ZIP code',
          description: '.',
          type: 'short_text',
          required: false,
          readOnly: false,
          placeholder: '.',
          defaultValue: null,
          options: null,
          validation: null,
          dependency: null,
          group: '.',
          anchors: [
            {
              keyId: 'keys/13',
              valueId: '',
              selectionMarkId: '',
              lineId: 'pages/0/lines/46',
            },
          ],
        },
        {
          name: 'account_numbers',
          label: 'List account number(s) here (optional)',
          description: '.',
          type: 'long_text',
          required: false,
          readOnly: false,
          placeholder: '.',
          defaultValue: null,
          options: null,
          validation: null,
          dependency: null,
          group: '.',
          anchors: [
            {
              keyId: 'keys/14',
              valueId: '',
              selectionMarkId: '',
              lineId: 'pages/0/lines/48',
            },
          ],
        },
        {
          name: 'exempt_payee_code',
          label: 'Exempt payee code (if any)',
          description: '.',
          type: 'short_text',
          required: false,
          readOnly: false,
          placeholder: '.',
          defaultValue: null,
          options: null,
          validation: null,
          dependency: null,
          group: '.',
          anchors: [
            {
              keyId: 'keys/15',
              valueId: '',
              selectionMarkId: '',
              lineId: 'pages/0/lines/52',
            },
          ],
        },
        {
          name: 'fatca_code',
          label: 'Exemption from FATCA reporting code (if any)',
          description: '.',
          type: 'short_text',
          required: false,
          readOnly: false,
          placeholder: '.',
          defaultValue: null,
          options: null,
          validation: null,
          dependency: null,
          group: '.',
          anchors: [
            {
              keyId: 'keys/16',
              valueId: '',
              selectionMarkId: '',
              lineId: 'pages/0/lines/53',
            },
            {
              keyId: '',
              valueId: '',
              selectionMarkId: '',
              lineId: 'pages/0/lines/54',
            },
            {
              keyId: '',
              valueId: '',
              selectionMarkId: '',
              lineId: 'pages/0/lines/55',
            },
            {
              keyId: '',
              valueId: '',
              selectionMarkId: '',
              lineId: 'pages/0/lines/56',
            },
            {
              keyId: '',
              valueId: '',
              selectionMarkId: '',
              lineId: 'pages/0/lines/57',
            },
          ],
        },
        {
          name: 'ssn',
          label: 'Social security number',
          description: '.',
          type: 'short_text',
          required: false,
          readOnly: false,
          placeholder: 'XXX-XX-XXXX',
          defaultValue: null,
          options: null,
          validation: null,
          dependency: null,
          group: 'part_i_tin',
          anchors: [
            {
              keyId: 'keys/17',
              valueId: '',
              selectionMarkId: '',
              lineId: 'pages/0/lines/67',
            },
          ],
        },
        {
          name: 'ein',
          label: 'Employer identification number',
          description: '.',
          type: 'short_text',
          required: false,
          readOnly: false,
          placeholder: 'XX-XXXXXXX',
          defaultValue: null,
          options: null,
          validation: null,
          dependency: null,
          group: 'part_i_tin',
          anchors: [
            {
              keyId: 'keys/18',
              valueId: '',
              selectionMarkId: '',
              lineId: 'pages/0/lines/71',
            },
          ],
        },
        {
          name: 'signature',
          label: 'Signature of U.S. person',
          description: '.',
          type: 'signature',
          required: false,
          readOnly: false,
          placeholder: '.',
          defaultValue: null,
          options: null,
          validation: null,
          dependency: null,
          group: 'part_ii_certification',
          anchors: [
            {
              keyId: 'keys/19',
              valueId: '',
              selectionMarkId: '',
              lineId: 'pages/0/lines/89',
            },
          ],
        },
        {
          name: 'signature_date',
          label: 'Date',
          description: '.',
          type: 'date',
          required: false,
          readOnly: false,
          placeholder: '.',
          defaultValue: null,
          options: null,
          validation: null,
          dependency: null,
          group: 'part_ii_certification',
          anchors: [
            {
              keyId: 'keys/20',
              valueId: '',
              selectionMarkId: '',
              lineId: 'pages/0/lines/90',
            },
          ],
        },
      ],
    },
    {
      name: 'page_2',
      description:
        'Form W-9 (Rev. 3-2024) instructions page; no form fields detected on this page.',
      questions: [
        {
          name: 'acknowledgement_instructions_only',
          label: 'This page contains instructions only and has no fillable fields',
          description:
            'Provided text is informational (Form W-9 instructions) without any detectable form inputs on this page.',
          type: 'boolean',
          required: false,
          readOnly: true,
          placeholder: '',
          defaultValue: false,
          options: null,
          validation: null,
          dependency: null,
          group: '',
          anchors: [
            {
              keyId: '',
              valueId: '',
              selectionMarkId: '',
              lineId: 'pages/1/lines/1',
            },
            {
              keyId: '',
              valueId: '',
              selectionMarkId: '',
              lineId: 'pages/1/lines/28',
            },
            {
              keyId: '',
              valueId: '',
              selectionMarkId: '',
              lineId: 'pages/1/lines/115',
            },
          ],
        },
      ],
    },
  ],
};

export default function FormPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = (answers: Record<string, any>) => {
    console.log('Form submitted with answers:', answers);
    alert('Form submitted successfully! Check the console for details.');
  };

  const handleFormCancel = () => {
    console.log('Form cancelled');
    alert('Form cancelled');
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto py-8">
        <Wizard form={sampleForm} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
      </div>
    </main>
  );
}
