'use client';

import { useState, useCallback } from 'react';
import { useLoading } from '../contexts/LoadingContext';

interface UseAsyncLoadingReturn {
    loading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
    withLoading: <T>(asyncFn: () => Promise<T>) => Promise<T>;
}

export const useAsyncLoading = (): UseAsyncLoadingReturn => {
    const { setLoading } = useLoading();
    const [localLoading, setLocalLoading] = useState(false);

    const startLoading = useCallback(() => {
        setLocalLoading(true);
        setLoading(true);
    }, [setLoading]);

    const stopLoading = useCallback(() => {
        setLocalLoading(false);
        setLoading(false);
    }, [setLoading]);

    const withLoading = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T> => {
        try {
            startLoading();
            const result = await asyncFn();
            return result;
        } finally {
            stopLoading();
        }
    }, [startLoading, stopLoading]);

    return {
        loading: localLoading,
        startLoading,
        stopLoading,
        withLoading,
    };
};
