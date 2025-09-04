'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useDrawer } from './LayoutWrapper';

export function Header() {
    // Try to get drawer context, fallback to null if not available
    let setDrawerOpen: ((open: boolean) => void) | null = null;
    try {
        const drawerContext = useDrawer();
        setDrawerOpen = drawerContext.setDrawerOpen;
    } catch {
        // Context not available on excluded pages
    }

    return (
        <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Hamburger Menu Button - show on all screen sizes when drawer context is available */}
                    {setDrawerOpen && (
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
                            aria-label="Open navigation menu"
                        >
                            <Menu className="w-6 h-6 text-gray-600" />
                        </button>
                    )}

                    <Link href="/" className="text-base font-semibold tracking-tight text-gray-900 flex items-center gap-3 min-w-0">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-bold flex-shrink-0">EX</span>
                        <span className="hidden sm:inline truncate">EduFinX</span>
                    </Link>
                </div>

                {/* Desktop Navigation - hidden on mobile */}
                <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
                    <Link href="/cases" className="px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 aria-[current=page]:bg-gray-900 aria-[current=page]:text-white transition-colors">Cases</Link>
                    <Link href="/feed" className="px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">Feed</Link>
                    <Link href="/leaderboard" className="px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">Leaderboard</Link>
                    <Link href="/admin" className="px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">Admin</Link>
                </nav>

                {/* Right side content */}
                <div className="flex items-center gap-4">
                    <form action="/api/auth/signout" method="post" className="hidden">
                        <button className="btn-xs btn-surface" type="submit">Sign out</button>
                    </form>
                </div>
            </div>
        </header>
    );
}
