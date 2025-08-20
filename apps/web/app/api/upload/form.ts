/** ---------- Zod schemas ---------- */

import { z } from '@/app/utils/zod';

const AnchorSchema = z.object({
  path: z.string(), // e.g., "pages/0/lines/12" or "keys/3"
});

export const FormFieldTypeEnum = z.enum([
  'short_text', // Single-line text input
  'long_text', // Multi-line/freeform text input
  'number', // Numeric input (integer or decimal)
  'date', // Date input (YYYY-MM-DD or localized format)
  'time', // Time input (HH:MM, 24h or 12h)
  'email', // Email address input
  'url', // Web address input
  'checkbox', // True/false or yes/no toggle
  'select_one', // Single-choice from a list
  'select_many', // Multi-choice from a list
  'signature', // Signature capture field
  'initial', // Initials capture field
]);

export const OptionSchema = z.object({
  value: z.string().describe('Machine-safe value for the option'),
  label: z.string().nullable().describe('Human-readable display label'),
  exportValue: z.string().nullable().describe('Optional alternate export value'),
  anchors: z
    .array(AnchorSchema)
    .nullable()
    .describe('Source anchors for this option (e.g., selection mark)'),
});

export const ValidationSchema = z.object({
  pattern: z.string().nullable().describe('Regex pattern the answer must match'),
  minLength: z.number().int().nullable().describe('Minimum allowed string length'),
  maxLength: z.number().int().nullable().describe('Maximum allowed string length'),
  min: z.union([z.number(), z.string()]).nullable().describe('Minimum numeric or date value'),
  max: z.union([z.number(), z.string()]).nullable().describe('Maximum numeric or date value'),
  allowedValues: z.array(z.string()).nullable().describe('Whitelist of valid values'),
});

export const ConditionSchema = z.object({
  fieldId: z.string().describe('ID of the form field this condition references'),
  equals: z
    .union([z.string(), z.number(), z.boolean()])
    .nullable()
    .describe('Match when value equals this'),
  in: z
    .array(z.union([z.string(), z.number(), z.boolean()]))
    .nullable()
    .describe('Match when value is in this list'),
  not: z.boolean().nullable().describe('Negate the condition result'),
});

export const DisplayRuleSchema = z.object({
  all: z.array(ConditionSchema).nullable().describe('All conditions must match'),
  any: z.array(ConditionSchema).nullable().describe('At least one condition must match'),
});

const DefaultScalar = z.union([z.string(), z.number(), z.boolean()]);

export const DefaultValueSchema = z
  .union([
    DefaultScalar,
    z.array(DefaultScalar),
    z.null(), // include null here instead of using .nullable() to avoid nested anyOf
  ])
  .describe('Default value(s) for the field, can be scalar, array, or null');

export const FormFieldSchema = z.object({
  name: z.string().describe('Machine-safe name, e.g., "first_name"'),
  label: z.string().describe('Human-readable label shown to the user'),
  description: z.string().nullable().describe('Optional helper text or tooltip'),
  type: FormFieldTypeEnum.describe('Type of the field'),
  required: z.boolean().nullable().describe('Whether this field must be answered'),
  readOnly: z.boolean().nullable().describe('Whether this field is non-editable'),
  placeholder: z.string().nullable().describe('Placeholder text for empty input'),
  defaultValue: DefaultValueSchema.describe('Default pre-filled value'),
  options: z.array(OptionSchema).nullable().describe('List of choices if applicable'),
  validation: ValidationSchema.nullable().describe('Validation rules for input'),
  dependency: DisplayRuleSchema.nullable().describe('Visibility or enablement rules'),
  group: z.string().nullable().describe('Optional grouping identifier'),
  anchors: z
    .array(AnchorSchema)
    .min(1)
    .nullable()
    .describe('One or more references to the originating key/value or selection mark'),
});

export const FormSchema = z.object({
  fields: z.array(FormFieldSchema).min(1).describe('A list of form fields.'),
});

/** ---------- Types inferred from schemas ---------- */
export type Anchor = z.infer<typeof AnchorSchema>;
export type FormFieldType = z.infer<typeof FormFieldTypeEnum>;
export type Option = z.infer<typeof OptionSchema>;
export type Validation = z.infer<typeof ValidationSchema>;
export type Condition = z.infer<typeof ConditionSchema>;
export type DisplayRule = z.infer<typeof DisplayRuleSchema>;
export type FormField = z.infer<typeof FormFieldSchema>;
export type Form = z.infer<typeof FormSchema>;
