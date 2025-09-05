"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Language {
    code: string;
    name: string;
    nativeName: string;
    direction: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', direction: 'ltr' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', direction: 'ltr' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', direction: 'ltr' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', direction: 'ltr' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', direction: 'ltr' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', direction: 'ltr' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', direction: 'ltr' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', direction: 'ltr' },
];

interface LanguageContextType {
    currentLanguage: Language;
    setLanguage: (languageCode: string) => void;
    isTranslating: boolean;
    translateText: (text: string, skipCache?: boolean) => Promise<string>;
    getTranslation: (key: string, fallback?: string) => string;
    translations: Record<string, string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation cache for the entire app
const globalTranslationCache: Record<string, Record<string, string>> = {};

// Static translations for UI elements
const staticTranslations: Record<string, Record<string, string>> = {
    // Navigation
    'nav.home': {
        hi: 'होम',
        mr: 'मुख्यपृष्ठ',
        gu: 'ઘર',
        bn: 'হোম',
        ta: 'முகப்பு',
        te: 'హోమ్',
        kn: 'ಮುಖ್ಯಪುಟ',
        ml: 'ഹോം',
        pa: 'ਘਰ'
    },
    'nav.cases': {
        hi: 'मामले',
        mr: 'प्रकरणे',
        gu: 'કેસો',
        bn: 'মামলা',
        ta: 'வழக்குகள்',
        te: 'కేసులు',
        kn: 'ಪ್ರಕರಣಗಳು',
        ml: 'കേസുകൾ',
        pa: 'ਮਾਮਲੇ'
    },
    'nav.feed': {
        hi: 'फीड',
        mr: 'फीड',
        gu: 'ફીડ',
        bn: 'ফিড',
        ta: 'ஊட்டம்',
        te: 'ఫీడ్',
        kn: 'ಫೀಡ್',
        ml: 'ഫീഡ്',
        pa: 'ਫੀਡ'
    },
    'nav.leaderboard': {
        hi: 'लीडरबोर्ड',
        mr: 'लीडरबोर्ड',
        gu: 'લીડરબોર્ડ',
        bn: 'লিডারবোর্ড',
        ta: 'தலைமை பலகை',
        te: 'లీడర్‌బోర్డ్',
        kn: 'ಲೀಡರ್‌ಬೋರ್ಡ್',
        ml: 'ലീഡർബോർഡ്',
        pa: 'ਲੀਡਰਬੋਰਡ'
    },
    'nav.quiz': {
        hi: 'क्विज़',
        mr: 'क्विझ',
        gu: 'ક્વિઝ',
        bn: 'কুইজ',
        ta: 'வினாடி வினா',
        te: 'క్విజ్',
        kn: 'ಕ್ವಿಜ್',
        ml: 'ക്വിസ്',
        pa: 'ਕੁਇਜ਼'
    },
    'nav.circulars': {
        hi: 'परिपत्र',
        mr: 'परिपत्रके',
        gu: 'પરિપત્રો',
        bn: 'সার্কুলার',
        ta: 'சுற்றுமுகம்',
        te: 'సర్క్యులర్లు',
        kn: 'ವೃತ್ತಪತ್ರಗಳು',
        ml: 'സർക്കുലറുകൾ',
        pa: 'ਸਰਕੂਲਰ'
    },
    'nav.profile': {
        hi: 'प्रोफ़ाइल',
        mr: 'प्रोफाईल',
        gu: 'પ્રોફાઇલ',
        bn: 'প্রোফাইল',
        ta: 'சுயவிவரம்',
        te: 'ప్రొఫైల్',
        kn: 'ಪ್ರೊಫೈಲ್',
        ml: 'പ്രൊഫൈൽ',
        pa: 'ਪ੍ਰੋਫਾਈਲ'
    },

    // Common UI elements
    'common.search': {
        hi: 'खोजें',
        mr: 'शोधा',
        gu: 'શોધો',
        bn: 'অনুসন্ধান',
        ta: 'தேடல்',
        te: 'వెతకండి',
        kn: 'ಹುಡುಕಿ',
        ml: 'തിരയുക',
        pa: 'ਖੋਜੋ'
    },
    'common.loading': {
        hi: 'लोड हो रहा है...',
        mr: 'लोड होत आहे...',
        gu: 'લોડ થઈ રહ્યું છે...',
        bn: 'লোড হচ্ছে...',
        ta: 'ஏற்றுகிறது...',
        te: 'లోడ్ అవుతోంది...',
        kn: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
        ml: 'ലോഡ് ചെയ്യുന്നു...',
        pa: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...'
    },
    'common.error': {
        hi: 'त्रुटि',
        mr: 'त्रुटी',
        gu: 'ભૂલ',
        bn: 'ত্রুটি',
        ta: 'பிழை',
        te: 'లోపం',
        kn: 'ದೋಷ',
        ml: 'പിശക്',
        pa: 'ਗਲਤੀ'
    },
    'common.retry': {
        hi: 'पुनः प्रयास करें',
        mr: 'पुन्हा प्रयत्न करा',
        gu: 'ફરીથી પ્રયત્ન કરો',
        bn: 'আবার চেষ্টা করুন',
        ta: 'மீண்டும் முயற்சிக்கவும்',
        te: 'మళ్లీ ప్రయత్నించండి',
        kn: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
        ml: 'വീണ്ടും ശ്രമിക്കുക',
        pa: 'ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ'
    },
    'common.save': {
        hi: 'सेव करें',
        mr: 'जतन करा',
        gu: 'સેવ કરો',
        bn: 'সেভ করুন',
        ta: 'சேமிக்கவும்',
        te: 'సేవ్ చేయండి',
        kn: 'ಉಳಿಸಿ',
        ml: 'സേവ് ചെയ്യുക',
        pa: 'ਸੇਵ ਕਰੋ'
    },
    'common.cancel': {
        hi: 'रद्द करें',
        mr: 'रद्द करा',
        gu: 'રદ કરો',
        bn: 'বাতিল',
        ta: 'ரத்து செய்',
        te: 'రద్దు చేయండి',
        kn: 'ರದ್ದುಮಾಡಿ',
        ml: 'റദ്ദാക്കുക',
        pa: 'ਰੱਦ ਕਰੋ'
    },

    // Page titles
    'page.home.title': {
        hi: 'होम - EduFinX',
        mr: 'मुख्यपृष्ठ - EduFinX',
        gu: 'ઘર - EduFinX',
        bn: 'হোম - EduFinX',
        ta: 'முகப்பு - EduFinX',
        te: 'హోమ్ - EduFinX',
        kn: 'ಮುಖ್ಯಪುಟ - EduFinX',
        ml: 'ഹോം - EduFinX',
        pa: 'ਘਰ - EduFinX'
    },
    'page.circulars.title': {
        hi: 'सेबी परिपत्र',
        mr: 'सेबी परिपत्रके',
        gu: 'સેબી પરિપત્રો',
        bn: 'সেবি সার্কুলার',
        ta: 'சேபி சுற்றுமுகம்',
        te: 'సెబి సర్క్యులర్లు',
        kn: 'ಸೆಬಿ ವೃತ್ತಪತ್ರಗಳು',
        ml: 'സെബി സർക്കുലറുകൾ',
        pa: 'ਸੇਬੀ ਸਰਕੂਲਰ'
    },
    'page.circulars.subtitle': {
        hi: 'नवीनतम नियामक अपडेट और दिशानिर्देश',
        mr: 'नवीनतम नियामक अपडेट आणि मार्गदर्शक तत्त्वे',
        gu: 'નવીનતમ નિયામક અપડેટ્સ અને માર્ગદર્શિકા',
        bn: 'সর্বশেষ নিয়ন্ত্রক আপডেট এবং নির্দেশিকা',
        ta: 'சமீபத்திய ஒழுங்குமுறை புதுப்பிப்புகள் மற்றும் வழிகாட்டுதல்கள்',
        te: 'తాజా నియంత్రణ అప్‌డేట్‌లు మరియు మార్గదర్శకాలు',
        kn: 'ಇತ್ತೀಚಿನ ನಿಯಂತ್ರಕ ಅಪ್‌ಡೇಟ್‌ಗಳು ಮತ್ತು ಮಾರ್ಗದರ್ಶಿಗಳು',
        ml: 'ഏറ്റവും പുതിയ നിയന്ത്രണ അപ്‌ഡേറ്റുകളും മാർഗ്ഗനിർദ്ദേശങ്ങളും',
        pa: 'ਨਵੀਨਤਮ ਨਿਯੰਤਰਕ ਅਪਡੇਟ ਅਤੇ ਦਿਸ਼ਾਨਿਰਦੇਸ਼'
    }
};

const createCacheKey = (text: string): string => {
    return `${text.substring(0, 50)}_${text.length}`;
};

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [currentLanguageCode, setCurrentLanguageCode] = useState<string>('en');
    const [isTranslating, setIsTranslating] = useState<boolean>(false);
    const [translations, setTranslations] = useState<Record<string, string>>({});

    const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguageCode) || SUPPORTED_LANGUAGES[0];

    // Load saved language preference from localStorage
    useEffect(() => {
        const savedLanguage = localStorage.getItem('preferred-language');
        if (savedLanguage && SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage)) {
            setCurrentLanguageCode(savedLanguage);
        } else {
            // Auto-detect browser language
            const browserLang = navigator.language.split('-')[0];
            const supportedLang = SUPPORTED_LANGUAGES.find(lang => lang.code === browserLang);
            if (supportedLang) {
                setCurrentLanguageCode(browserLang);
            }
        }
    }, []);

    // Update document language and direction
    useEffect(() => {
        document.documentElement.lang = currentLanguageCode;
        document.documentElement.dir = currentLanguage.direction;
    }, [currentLanguageCode, currentLanguage.direction]);

    const setLanguage = (languageCode: string) => {
        setCurrentLanguageCode(languageCode);
        localStorage.setItem('preferred-language', languageCode);

        // Clear current translations to force re-translation
        setTranslations({});
    };

    const translateText = async (text: string, skipCache: boolean = false): Promise<string> => {
        // Return original text if target language is English
        if (currentLanguageCode === 'en') {
            return text;
        }

        const cacheKey = createCacheKey(text);

        // Check cache first (unless skipping cache)
        if (!skipCache && globalTranslationCache[cacheKey]?.[currentLanguageCode]) {
            return globalTranslationCache[cacheKey][currentLanguageCode];
        }

        setIsTranslating(true);

        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    targetLanguage: currentLanguageCode,
                    sourceLanguage: 'en',
                }),
            });

            if (!response.ok) {
                throw new Error(`Translation failed: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            const translatedText = data.translatedText || text;

            // Cache the translation
            if (!globalTranslationCache[cacheKey]) {
                globalTranslationCache[cacheKey] = {};
            }
            globalTranslationCache[cacheKey][currentLanguageCode] = translatedText;

            return translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return text; // Fallback to original text
        } finally {
            setIsTranslating(false);
        }
    };

    const getTranslation = (key: string, fallback?: string): string => {
        // For English, return the key or fallback
        if (currentLanguageCode === 'en') {
            return fallback || key;
        }

        // Check static translations first
        const staticTranslation = staticTranslations[key]?.[currentLanguageCode];
        if (staticTranslation) {
            return staticTranslation;
        }

        // Check dynamic translations
        const dynamicTranslation = translations[key];
        if (dynamicTranslation) {
            return dynamicTranslation;
        }

        // Return fallback or key
        return fallback || key;
    };

    return (
        <LanguageContext.Provider
            value={{
                currentLanguage,
                setLanguage,
                isTranslating,
                translateText,
                getTranslation,
                translations,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export default LanguageProvider;
