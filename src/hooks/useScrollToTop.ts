import { useEffect } from 'react';

/**
 * Custom hook to scroll to top when component mounts
 * @param behavior - Scroll behavior ('smooth' | 'instant' | 'auto')
 * @param delay - Optional delay in milliseconds before scrolling
 */
export const useScrollToTop = (
    behavior: ScrollBehavior = 'smooth',
    delay: number = 0
) => {
    useEffect(() => {
        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior
            });
        };

        if (delay > 0) {
            const timeoutId = setTimeout(scrollToTop, delay);
            return () => clearTimeout(timeoutId);
        } else {
            scrollToTop();
        }
    }, [behavior, delay]);
};
