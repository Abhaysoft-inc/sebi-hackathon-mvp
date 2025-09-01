'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className=" mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold  bg-clip-text text-black hover:scale-105 transition-transform duration-200">
                        FinFeed
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className="relative" ref={dropdownRef}>
                            <div
                                className="w-10 h-10  rounded-full flex items-center justify-center text-black font-semibold text-sm cursor-pointer hover:scale-110 transition-transform duration-200 shadow-lg border-black border"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                AV
                            </div>
                            {/* Desktop dropdown - hover */}
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 hidden md:block">
                                <div className="p-3">
                                    <div className="text-sm font-semibold text-gray-900">John Doe</div>
                                    <div className="text-xs text-gray-500">john@example.com</div>
                                </div>
                                <hr className="border-gray-100" />
                                <div className="p-2">
                                    <Link href="/profile" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">Profile</Link>
                                    <Link href="/settings" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">Settings</Link>
                                    <button className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">Sign out</button>
                                </div>
                            </div>
                            {/* Mobile dropdown - click */}
                            {showDropdown && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-10 md:hidden">
                                    <div className="p-3">
                                        <div className="text-sm font-semibold text-gray-900">John Doe</div>
                                        <div className="text-xs text-gray-500">john@example.com</div>
                                    </div>
                                    <hr className="border-gray-100" />
                                    <div className="p-2">
                                        <Link
                                            href="/profile"
                                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            Settings
                                        </Link>
                                        <button
                                            className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
