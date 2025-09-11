import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navigation } from '@/components/navigation';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PostHog Kitchen Sink',
  description: 'A comprehensive Next.js app demonstrating PostHog analytics, feature flags, and server actions',
  keywords: ['Next.js', 'PostHog', 'Analytics', 'Feature Flags', 'Server Actions'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-background" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            <div className="relative flex min-h-screen flex-col">
              <Navigation />
              <main className="flex-1">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  {children}
                </div>
              </main>
              <footer className="border-t">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex h-14 items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      PostHog Kitchen Sink - Built with Next.js App Router
                    </p>
                  </div>
                </div>
              </footer>
            </div>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
