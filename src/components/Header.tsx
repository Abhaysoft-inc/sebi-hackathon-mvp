'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Menu, User, LogOut, ChevronDown } from 'lucide-react';
import { useDrawer } from './LayoutWrapper';
import { StoriesModal } from './StoriesModal';
import LanguageSelector from './LanguageSelector';
import { useI18n } from '../contexts/I18nContext';

export function Header() {
    const [isStoriesOpen, setIsStoriesOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const { t } = useI18n();

    // Try to get drawer context, fallback to null if not available
    let setDrawerOpen: ((open: boolean) => void) | null = null;
    try {
        const drawerContext = useDrawer();
        setDrawerOpen = drawerContext.setDrawerOpen;
    } catch {
        // Context not available on excluded pages
    }

    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsStoriesOpen(true);
    };

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
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

                        <button
                            onClick={handleLogoClick}
                            className="text-base font-semibold tracking-tight text-gray-900 flex items-center gap-3 min-w-0  transition-transform duration-200 cursor-pointer"
                        >
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-bold flex-shrink-0 relative">
                                <img src="/flat.jpeg" alt="" />
                                {/* Stories indicator ring */}
                                <div className="absolute -inset-1 rounded-full border-2 border-orange-400 animate-pulse opacity-75"></div>
                            </span>

                        </button>
                        <Link href='/' className="hidden sm:inline truncate">EduFinX</Link>
                    </div>

                    {/* Desktop Navigation - hidden on mobile */}
                    {/* <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
                        <Link href="/feed" className="px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">{t('nav.feed', 'Feed')}</Link>
                        <Link href="/cases" className="px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 aria-[current=page]:bg-gray-900 aria-[current=page]:text-white transition-colors">{t('nav.cases', 'Cases')}</Link>
                        <Link href="/ipos" className="px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 aria-[current=page]:bg-gray-900 aria-[current=page]:text-white transition-colors">{t('nav.IPO', 'IPO')}</Link>

                        <Link href="/leaderboard" className="px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">{t('nav.leaderboard', 'Leaderboard')}</Link>
                        <Link href="/admin" className="px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">{t('nav.admin', 'Admin')}</Link>
                    </nav> */}

                    {/* Right side content */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Language Selector - now visible on all screen sizes */}
                        <LanguageSelector compact />

                        {/* Profile Button */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none "
                                aria-label="User profile menu"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                    <img src="https://avatars.githubusercontent.com/u/57512017?v=4" alt="" className='rounded-full' />
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">Abhay Vishwakarma</p>
                                        <p className="text-sm text-gray-500">abhay@example.com</p>
                                    </div>

                                    <div className="py-1">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <User className="w-4 h-4" />
                                            {t('user.viewProfile', 'View Profile')}
                                        </Link>

                                        {/* <Link
                                            href="/settings"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </Link> */}

                                        <div className="border-t border-gray-100 mt-1 pt-1">
                                            <button
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    // Handle sign out logic here
                                                    console.log('Sign out clicked');
                                                }}
                                            >
                                                <LogOut className="w-4 h-4" />
                                                {t('user.signOut', 'Sign Out')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <form action="/api/auth/signout" method="post" className="hidden">
                            <button className="btn-xs btn-surface" type="submit">Sign out</button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Stories Modal - positioned outside header for proper z-index stacking */}
            <StoriesModal
                isOpen={isStoriesOpen}
                onClose={() => setIsStoriesOpen(false)}
            />
        </>
    );
}
