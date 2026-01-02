import '@/app/ui/globals.css';
import type { Metadata } from "next";
import { authClient } from './lib/auth/client';
import { AuthUIProvider, UserButton } from '@neondatabase/auth/react';
import { ThemeProvider } from "next-themes";
import ThemeToggle from "@/app/components/ThemeToggle";

export const metadata: Metadata = {
  title: {
    template: '%s | Version Tracker',
    default: 'Version Tracker'
  },
  description: 'Version Tracker application to track device firmware version by project',
  // metadataBase: new URL('');
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthUIProvider 
            authClient={authClient}
            redirectTo="/account/settings"
            emailOTP
            social={{ providers: ["google", "github"] }}
          >
              <header className='flex justify-end items-center p-4 gap-4 h-16'>
                <ThemeToggle />
                <div className="rounded-full border-2 border-gray-700 dark:border-gray-300">
                  <UserButton size="icon" />
                </div>
              </header>
              
              {children}
          
          </AuthUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
