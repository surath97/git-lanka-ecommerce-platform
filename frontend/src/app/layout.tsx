import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import ThemeInitializer from '@/components/ThemeInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShopHub - E-Commerce Platform',
  description: 'Your one-stop shop for amazing products',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeInitializer />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}