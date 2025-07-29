import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string; // 👈 your custom property
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string; // 👈 also needed on User type
  }
}
