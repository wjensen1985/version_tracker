import { neonAuthMiddleware } from "@neondatabase/auth/next/server";

export default neonAuthMiddleware({
  // Redirects unauthenticated users to sign-in page
  loginUrl: "/auth/sign-in",
});

export const config = {
  matcher: [
    // Protected routes requiring authentication
    '/dashboard/:path*',

    // exclude static resources:
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};