import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/landing/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Header } from "@/components/Header";
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

export const metadata: Metadata = {
  title: "EduFinX",
  description: "EduFinX – Social learning, regulated creator content, AI insights & gamified financial literacy.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const mainContainerStyle = {
    paddingTop: '1.5rem',
    paddingBottom: '2rem',
    minHeight: '100vh',
  };

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutWrapper>
          <Header />
          <div style={mainContainerStyle}>
            <main className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 space-y-10">
              {children}
            </main>
          </div>
          <Footer />
          <DevMountPing />
          {/* Global Voice Assistant (Phase 1: UI only) */}
          <VoiceAssistant />
        </LayoutWrapper>
      </body>
    </html>
  );
}
