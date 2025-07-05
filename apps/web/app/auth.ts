import { PrismaAdapter } from '@next-auth/prisma-adapter';
import EmailProvider from 'next-auth/providers/email';
import { PRISMA } from './prisma';
import { AuthOptions } from 'next-auth';

export const AUTH: AuthOptions = {
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  adapter: PrismaAdapter(PRISMA),
  session: {
    strategy: 'database',
  },
};
