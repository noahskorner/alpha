export const ROUTES = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  auth: {
    callback: "/auth/callback",
  },
  dashboard: "/dashboard",
} as const;

export const PROTECTED_ROUTES: string[] = [ROUTES.dashboard] as const;
