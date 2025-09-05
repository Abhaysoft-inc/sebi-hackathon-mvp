'use client';

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/landing/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Header } from "@/components/Header";
import { I18nProvider } from "@/contexts/I18nContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { NavigationLoader } from "@/components/NavigationLoader";
// Voice assistant UI (client component). Importing directly creates a client boundary.
import VoiceAssistant from '@/components/VoiceAssistant';
import DevMountPing from '@/components/DevMountPing';
// Navbar & BottomBar removed for cleaner admin / case UI

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const mainContainerStyle = {
    paddingTop: '1.5rem',
    paddingBottom: '2rem',
    minHeight: '100vh',
  };

  // Pages that should NOT have the footer
  const pagesWithoutFooter = [
    // Quiz playing pages
    /^\/quiz\/ranked\/[^\/]+$/,
    // Add other patterns here if needed
  ];

  const shouldShowFooter = !pagesWithoutFooter.some(pattern => {
    if (pattern instanceof RegExp) {
      return pattern.test(pathname);
    }
    return pathname === pattern;
  });

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>EduFinX</title>
        <meta name="description" content="EduFinX – Social learning, regulated creator content, AI insights & gamified financial literacy." />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoadingProvider>
          <I18nProvider>
            <NavigationLoader />
            <LayoutWrapper>
              <Header />
              <div style={mainContainerStyle}>
                <main className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 space-y-10">
                  {children}
                </main>
              </div>
              {shouldShowFooter && <Footer />}
              <DevMountPing />
              {/* Global Voice Assistant (Phase 1: UI only) */}
              <VoiceAssistant />
            </LayoutWrapper>
          </I18nProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
