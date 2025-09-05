'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from '../contexts/LoadingContext';
import { PageLoader } from './LoadingSpinner';

const NavigationLoaderCore: React.FC = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { isLoading, setLoading } = useLoading();
    const isInitialLoad = useRef(true);

    useEffect(() => {
        // Skip loading on initial page load
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            return;
        }

        // Start loading when route changes
        setLoading(true);

        // Set a timer to hide loading after a short delay
        // This ensures the loader shows even for fast navigations
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500); // Minimum loading time for better UX

        return () => {
            clearTimeout(timer);
        };
    }, [pathname, searchParams, setLoading]);

    // Handle link clicks to start loading immediately
    useEffect(() => {
        const handleLinkClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const link = target.closest('a[href]') as HTMLAnchorElement;

            if (link && link.href) {
                const url = new URL(link.href);
                const currentUrl = new URL(window.location.href);

                // Only show loader for internal navigation
                if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
                    setLoading(true);
                }
            }
        };

        // Add click listener to document
        document.addEventListener('click', handleLinkClick);

        return () => {
            document.removeEventListener('click', handleLinkClick);
        };
    }, [setLoading]);

    return isLoading ? <PageLoader /> : null;
};

export const NavigationLoader: React.FC = () => {
    return (
        <Suspense fallback={null}>
            <NavigationLoaderCore />
        </Suspense>
    );
};
