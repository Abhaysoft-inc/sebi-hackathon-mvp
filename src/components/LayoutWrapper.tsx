'use client';

import React, { useState, createContext, useContext, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NavDrawer from './NavDrawer';

interface LayoutWrapperProps {
    children: React.ReactNode;
}

// Create context for drawer state
interface DrawerContextType {
    isDrawerOpen: boolean;
    setDrawerOpen: (open: boolean) => void;
}

export const DrawerContext = createContext<DrawerContextType>({
    isDrawerOpen: false,
    setDrawerOpen: () => { },
});

export const useDrawer = () => useContext(DrawerContext);

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
    const pathname = usePathname();
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    // Set initial drawer state based on screen size
    useEffect(() => {
        const handleResize = () => {
            // Keep drawer closed by default on all screen sizes
            setDrawerOpen(false);
        };

        // Set initial state
        handleResize();

        // Listen for resize events
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [pathname]);

    // Pages that should NOT have the nav drawer
    const excludedPages: string[] = [
        // '/', // Landing page - removed to enable hamburger menu
    ];

    // Check if current path is a quiz playing page (dynamic routes like /quiz/ranked/[id])
    const isQuizPlayingPage = /^\/quiz\/ranked\/[^\/]+$/.test(pathname);

    // Check if current path should be excluded
    const shouldExclude = excludedPages.includes(pathname) || isQuizPlayingPage;

    if (shouldExclude) {
        return <>{children}</>;
    }

    return (
        <DrawerContext.Provider value={{ isDrawerOpen, setDrawerOpen }}>
            <div className="flex min-h-screen bg-transparent">
                <NavDrawer isOpen={isDrawerOpen} onOpenChange={setDrawerOpen} />
                <main className={`flex-1 transition-all duration-300 ease-in-out ${isDrawerOpen ? 'md:ml-64' : 'md:ml-0'}`}>
                    {children}
                </main>
            </div>
        </DrawerContext.Provider>
    );
};

export default LayoutWrapper;
