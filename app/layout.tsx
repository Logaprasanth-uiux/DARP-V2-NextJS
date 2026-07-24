import type { Metadata } from 'next';
import '@/styles/globals.css';
import { AppProviders } from '@/providers/AppProviders';
import { MainLayout } from '@/layouts/MainLayout';

export const metadata: Metadata = {
  title: 'DARP Enterprise v2',
  description: 'Enterprise Assessment and Review Portal',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <MainLayout>
            {children}
          </MainLayout>
        </AppProviders>
      </body>
    </html>
  );
}
