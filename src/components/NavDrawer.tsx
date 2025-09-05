'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    BookOpen,
    Trophy,
    BarChart3,
    Users,
    Settings,
    X,
    LogOut,
    User,
    FileText
} from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useI18n } from '../contexts/I18nContext'; interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
}

interface NavDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const NavDrawer: React.FC<NavDrawerProps> = ({ isOpen, onOpenChange }) => {
    const pathname = usePathname();
    const { t } = useI18n();

    const navItems: NavItem[] = [
        { href: '/feed', label: t('nav.feed', 'Feed'), icon: <Home className="w-5 h-5" /> },
        { href: '/cases', label: t('nav.cases', 'Case Studies'), icon: <BookOpen className="w-5 h-5" /> },
        { href: '/quiz/ranked', label: t('nav.quiz', 'Quizzes'), icon: <Trophy className="w-5 h-5" /> },
        { href: '/leaderboard', label: t('nav.leaderboard', 'Leaderboard'), icon: <BarChart3 className="w-5 h-5" /> },
        { href: '/circulars', label: t('nav.circulars', 'SEBI Circulars'), icon: <FileText className="w-5 h-5" /> },
        // { href: '/case-studies', label: 'Study Materials', icon: <Users className="w-5 h-5" /> },
    ];

    const isActivePath = (href: string) => {
        if (href === '/feed') {
            return pathname === '/feed';
        }
        return pathname.startsWith(href);
    };

    // Handle swipe gestures
    useEffect(() => {
        let startX = 0;
        let currentX = 0;
        let isTracking = false;

        const handleTouchStart = (e: TouchEvent) => {
            startX = e.touches[0].clientX;
            isTracking = true;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isTracking) return;
            currentX = e.touches[0].clientX;
        };

        const handleTouchEnd = () => {
            if (!isTracking) return;
            isTracking = false;

            const diffX = currentX - startX;

            // Swipe right to open (from left edge)
            if (startX < 50 && diffX > 100 && !isOpen) {
                onOpenChange(true);
            }
            // Swipe left to close
            else if (diffX < -100 && isOpen) {
                onOpenChange(false);
            }
        };

        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isOpen, onOpenChange]);

    return (
        <>
            {/* Overlay - only on mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => onOpenChange(false)}
                />
            )}

            {/* Drawer */}
            <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            EX
                        </div>
                        <span className="text-lg font-semibold text-gray-900">EduFinX</span>
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Close navigation menu"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={() => onOpenChange(false)}
                                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActivePath(item.href)
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {item.icon}
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Language Selector at bottom */}
                <div className="px-4 py-4 border-t border-gray-200">
                    <LanguageSelector className="w-full" />
                </div>

            </div>
        </>
    );
};

export default NavDrawer;
