'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage as SchadcnFormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});
type LoginFormSchema = z.infer<typeof schema>;

export default function Login() {
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async ({ email }: LoginFormSchema) => {
    signIn('email', { email: email });
  };

  return (
    <div className="w-full flex items-center justify-center h-full pt-8">
      <Form {...form}>
        <form
          className="flex-1 flex flex-col w-full max-w-lg"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h1 className="text-2xl font-medium">Sign in</h1>
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <SchadcnFormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Email me a magic link ✨</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
