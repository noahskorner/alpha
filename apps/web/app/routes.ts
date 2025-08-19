export const routes = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  auth: {
    callback: '/auth/callback',
  },
  organizations: {
    home: '/organizations',
  },
  indexes: {
    home: '/indexes',
    detail: (id: string) => `/indexes/${id}`,
  },
  upload: {
    home: '/upload',
  },
  forms: {
    home: '/forms',
    detail: (id: string) => `/forms/${id}`,
    edit: (id: string) => `/forms/${id}/edit`,
  },
} as const;
