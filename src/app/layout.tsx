import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/landing/Footer";
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
        <Header />
        <div style={mainContainerStyle}>
          <main className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 space-y-10">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 h-14 flex items-center gap-6">
        <a href="/" className="text-sm font-semibold tracking-tight text-gray-900 flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white text-xs font-bold">EX</span>
          <span className="hidden sm:inline">EduFinX</span>
        </a>
        <nav className="flex items-center gap-1 text-xs font-medium">
          <a href="/cases" className="px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700 aria-[current=page]:bg-gray-900 aria-[current=page]:text-white">Cases</a>
          <a href="/feed" className="px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700">Feed</a>
          <a href="/leaderboard" className="px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700">Leaderboard</a>
          <a href="/admin" className="px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700">Admin</a>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <form action="/api/auth/signout" method="post" className="hidden">
            <button className="btn-xs btn-surface" type="submit">Sign out</button>
          </form>
        </div>
      </div>
    </header>
  )
}
