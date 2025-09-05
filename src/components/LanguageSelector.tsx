'use client';

import { useState, useRef, useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';

interface LanguageSelectorProps {
    className?: string;
    showIcon?: boolean;
    compact?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    className = '',
    showIcon = true,
    compact = false
}) => {
    const { currentLanguage, setLanguage, getSupportedLanguages, t } = useI18n();
    const supportedLanguages = getSupportedLanguages();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLanguageSelect = (languageCode: string) => {
        setLanguage(languageCode);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={t('aria.selectLanguage', 'Select language')}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                {showIcon && (
                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.105 0 2.1.033 3 .102M9 5.25V3a2.25 2.25 0 0 1 4.5 0v.793c.026.009.051.02.076.032L15.12 5.09M15 5.25v7.5c0 1.24-.806 2.25-1.8 2.25s-1.8-1.01-1.8-2.25v-7.5M9 8.25H5.25A2.25 2.25 0 0 0 3 10.5v.75a2.25 2.25 0 0 0 2.25 2.25H9M9 8.25V10.5a2.25 2.25 0 0 1-2.25 2.25H4.5M9 8.25v-1.5a2.25 2.25 0 0 1 4.5 0V8.25m0 0V10.5a2.25 2.25 0 0 1-2.25 2.25H9" />
                    </svg>
                )}
                {compact ? currentLanguage.code.toUpperCase() : currentLanguage.nativeName}
                <svg
                    className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {supportedLanguages.map((language) => (
                            <button
                                key={language.code}
                                onClick={() => handleLanguageSelect(language.code)}
                                className={`${currentLanguage.code === language.code
                                        ? 'bg-blue-50 text-blue-900 font-semibold'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                    } group flex w-full items-center px-4 py-2 text-sm transition-colors`}
                            >
                                <span className="flex-1 text-left">
                                    {language.nativeName}
                                </span>
                                <span className="text-xs text-gray-500 ml-2">
                                    {language.name}
                                </span>
                                {currentLanguage.code === language.code && (
                                    <span className="ml-2 text-blue-600">✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
