import { useState, useCallback } from 'react';
import { ACTIVE_TRANSLATION_LANGUAGES } from '@/lib/translationLanguages';

export interface UseTextTranslationResult {
	translate: (text: string, targetLanguageCode: string) => Promise<string | undefined>;
	isLoading: boolean;
	error: string | null;
	lastTranslation: string;
	languages: typeof ACTIVE_TRANSLATION_LANGUAGES;
}

export function useTextTranslation(): UseTextTranslationResult {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [lastTranslation, setLastTranslation] = useState('');

	const translate = useCallback(async (text: string, targetLanguageCode: string) => {
		setIsLoading(true);
		setError(null);
		try {
				const res = await fetch('/api/translate', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ text, targetLanguage: targetLanguageCode })
				});
				let data: any = {};
				try { data = await res.json(); } catch { /* ignore parse error */ }
				if (!res.ok) {
					const msg = data.error || data.details || `Translation failed (HTTP ${res.status})`;
					throw new Error(msg);
				}
				if (!data.translation) {
					throw new Error('No translation returned');
				}
				setLastTranslation(data.translation);
				return data.translation as string;
			} catch (e: any) {
				setError(e.message || 'Unexpected translation error');
			} finally {
				setIsLoading(false);
			}
	}, []);

	return { translate, isLoading, error, lastTranslation, languages: ACTIVE_TRANSLATION_LANGUAGES };
}

export default useTextTranslation;

