import '@/app/ui/globals.css';
import type { Metadata } from "next";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
