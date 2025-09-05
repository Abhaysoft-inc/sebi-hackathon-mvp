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

// Static translations for the entire app
const translations: Record<string, Record<string, string>> = {
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
    'nav.IPO': {
        hi: 'IPO',
        mr: 'IPO',
        gu: 'IPO',
        bn: 'IPO',
        ta: 'வழக்குகள்',
        te: 'కేసులు',
        kn: 'ಪ್ರಕರಣಗಳು',
        ml: 'കേസുകൾ',
        pa: 'ਮਾਮਲੇ'
    },

    'nav.leaderboard': {
        hi: 'लीडरबोर्ड',
        mr: 'लीडरबोर्ड',
        gu: 'લીડરબોર્ડ',
        bn: 'লিডারবোর্ড',
        ta: 'தலைமை பலकै',
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
        ta: 'சுற்றுமुகம்',
        te: 'సర్క్యులర్లు',
        kn: 'ವೃತ್ತಪತ್ರಗಳು',
        ml: 'സർക്കുലറുകൾ',
        pa: 'ਸਰਕੂਲਰ'
    },
    'nav.admin': {
        hi: 'प्रशासन',
        mr: 'प्रशासन',
        gu: 'વહીવટ',
        bn: 'প্রশাসন',
        ta: 'நிர्वाहम्',
        te: 'నిర్వహణ',
        kn: 'ನಿರ್ವಹಣೆ',
        ml: 'അഡ്മിൻ',
        pa: 'ਪ੍ਰਸ਼ਾਸਨ'
    },
    'nav.profile': {
        hi: 'प्रोफ़ाइल',
        mr: 'प्रोफाईल',
        gu: 'પ્રોફાઇલ',
        bn: 'প্রোফাইল',
        ta: 'சुयविवरम्',
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
        ta: 'তেडल्',
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
        ta: 'ऐऱ्ऱుकिறदु...',
        te: 'లోడ్ అవుతోంది...',
        kn: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
        ml: 'ലോഡ് ചെയ്യുന്നു...',
        pa: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...'
    },
    'common.save': {
        hi: 'सहेजें',
        mr: 'जतन करा',
        gu: 'સેવ કરો',
        bn: 'সেভ করুন',
        ta: 'सेमिक्कवुम्',
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
        ta: 'रऽदु सेय',
        te: 'రద్దు చేయండి',
        kn: 'ರದ್ದುಮಾಡಿ',
        ml: 'റദ്ദാക്കുക',
        pa: 'ਰੱਦ ਕਰੋ'
    },
    'common.submit': {
        hi: 'जमा करें',
        mr: 'सबमिट करा',
        gu: 'સબમિટ કરો',
        bn: 'জমা দিন',
        ta: 'समर्पिक्कवुम्',
        te: 'సబ్మిట్ చేయండి',
        kn: 'ಸಲ್ಲಿಸಿ',
        ml: 'സമർപ്പിക്കുക',
        pa: 'ਜਮ੍ਹਾ ਕਰੋ'
    },
    'common.close': {
        hi: 'बंद करें',
        mr: 'बंद करा',
        gu: 'બંધ કરો',
        bn: 'বন্ধ করুন',
        ta: 'मूदु',
        te: 'మూసివేయండి',
        kn: 'ಮುಚ್ಚಿ',
        ml: 'അടയ്ക്കുക',
        pa: 'ਬੰਦ ਕਰੋ'
    },

    // User actions
    'user.viewProfile': {
        hi: 'प्रोफ़ाइल देखें',
        mr: 'प्रोफाईल पहा',
        gu: 'પ્રોફાઇલ જુઓ',
        bn: 'প্রোফাইল দেখুন',
        ta: 'सुयविवरम् कानवुम्',
        te: 'ప్రొఫైల్ చూడండి',
        kn: 'ಪ್ರೊಫೈಲ್ ನೋಡಿ',
        ml: 'പ്രൊഫൈൽ കാണുക',
        pa: 'ਪ੍ਰੋਫਾਈਲ ਦੇਖੋ'
    },
    'user.signOut': {
        hi: 'साइन आउट',
        mr: 'साइन आऊट',
        gu: 'સાઇન આઉટ',
        bn: 'সাইন আউট',
        ta: 'वेळियेऱु',
        te: 'సైన్ అవుట్',
        kn: 'ಸೈನ್ ಔಟ್',
        ml: 'സൈൻ ഔട്ട്',
        pa: 'ਸਾਇਨ ਆਉਟ'
    },

    // Accessibility labels
    'aria.openMenu': {
        hi: 'मेनू खोलें',
        mr: 'मेनू उघडा',
        gu: 'મેનુ ખોલો',
        bn: 'মেনু খুলুন',
        ta: 'मेनुवै दिऱक्कवुम्',
        te: 'మెనుని తెరవండి',
        kn: 'ಮೆನು ತೆರೆಯಿರಿ',
        ml: 'മെനു തുറക്കുക',
        pa: 'ਮੇਨੂ ਖੋਲ੍ਹੋ'
    },
    'aria.closeMenu': {
        hi: 'मेनू बंद करें',
        mr: 'मेनू बंद करा',
        gu: 'મેનુ બંધ કરો',
        bn: 'মেনু বন্ধ করুন',
        ta: 'मेनुवै मूदु',
        te: 'మెనుని మూసివేయండి',
        kn: 'ಮೆನು ಮುಚ್ಚಿ',
        ml: 'മെനു അടയ്ക്കുক',
        pa: 'ਮੇਨੂ ਬੰਦ ਕਰੋ'
    },
    'aria.userProfile': {
        hi: 'उपयोगकर्ता प्रोफ़ाइल मेनू',
        mr: 'वापरकर्ता प्रोफाईल मेनू',
        gu: 'વપરાશકર્તા પ્રોફાઇલ મેનુ',
        bn: 'ব্যবহারকারী প্রোফাইল মেনু',
        ta: 'पयनर् सुयविवर मेनु',
        te: 'వినియోగదారు ప్రొఫైల్ మెను',
        kn: 'ಬಳಕೆದಾರ ಪ್ರೊಫೈಲ್ ಮೆನು',
        ml: 'ഉപയോക്താവിന്റെ പ്രൊഫൈൽ മെനു',
        pa: 'ਯੂਜ਼ਰ ਪ੍ਰੋਫਾਈਲ ਮੇਨੂ'
    },
    'aria.selectLanguage': {
        hi: 'भाषा चुनें',
        mr: 'भाषा निवडा',
        gu: 'ભાષા પસંદ કરો',
        bn: 'ভাষা নির্বাচন করুন',
        ta: 'मोळियै देर्न्देडुक्कवुम्',
        te: 'భాషను ఎంచుకోండి',
        kn: 'ಭಾಷೆಯನ್ನು ಆರಿಸಿ',
        ml: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
        pa: 'ਭਾਸ਼ਾ ਚੁਣੋ'
    },

    // AI Summary translations
    'ai.summary.title': {
        en: 'AI Analysis',
        hi: 'AI सारांश',
        mr: 'AI सारांश',
        gu: 'AI સાર',
        bn: 'AI সারসংক্ষেপ',
        ta: 'AI सुरुक्कम्',
        te: 'AI సారాంశం',
        kn: 'AI ಸಾರಾಂಶ',
        ml: 'AI സാരാംശം',
        pa: 'AI ਸਾਰ'
    },
    'ai.summary.keyInsights': {
        en: 'Key Insights',
        hi: 'मुख्य अंतर्दृष्टि',
        mr: 'मुख्य अंतर्दृष्टि',
        gu: 'મુખ્ય આંતરદૃષ્ટિ',
        bn: 'মূল অন্তর্দৃষ্টি',
        ta: 'मुक्किय नुण्णडिवुगळ्',
        te: 'ముఖ్య అంతర్దృష్టులు',
        kn: 'ಮುಖ್ಯ ಒಳನೋಟಗಳು',
        ml: 'പ്രധാന ഉൾക്കാഴ്ചകൾ',
        pa: 'ਮੁੱਖ ਸੂਝਬੂਝ'
    },
    'ai.summary.recommendedActions': {
        en: 'Recommended Actions',
        hi: 'सुझाए गए कार्य',
        mr: 'शिफारस केलेल्या कृती',
        gu: 'ભલામણ કરેલ ક્રિયાઓ',
        bn: 'প্রস্তাবিত ক্রিয়া',
        ta: 'पडिन्दुरैक्कप्पट्ट सेयल्गळ्',
        te: 'సిఫార్సు చేయబడిన చర్యలు',
        kn: 'ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಿಯೆಗಳು',
        ml: 'ശുപാർശ ചെയ്യുന്ന പ്രവർത്തനങ്ങൾ',
        pa: 'ਸਿਫਾਰਸ਼ ਕੀਤੇ ਕਾਰਜ'
    },
    'ai.summary.disclaimer': {
        en: 'AI-generated analysis. Please verify information and consult financial advisors for investment decisions.',
        hi: 'AI-जनरेटेड विश्लेषण। कृपया जानकारी सत्यापित करें और निवेश निर्णयों के लिए वित्तीय सलाहकारों से सलाह लें।',
        mr: 'AI-व्युत्पन्न विश्लेषण। कृपया माहिती सत्यापित करा आणि गुंतवणूक निर्णयांसाठी वित्तीय सल्लागारांचा सल्ला घ्या।',
        gu: 'AI-જનરેટેડ વિશ્લેષણ. કૃપા કરીને માહિતી ચકાસો અને રોકાણ નિર્ણયો માટે નાણાકીય સલાહકારોની સલાહ લો.',
        bn: 'AI-উৎপন্ন বিশ্লেষণ। তথ্য যাচাই করুন এবং বিনিয়োগের সিদ্ধান্তের জন্য আর্থিক উপদেষ্টাদের পরামর্শ নিন।',
        ta: 'AI-उरुवाक्कप्पट्ट पगुप्पाय्वु। दगवलै सडिपार्त्दु मुदलीट्टु मुडिवुगळुक्कु निदि आলोसगर्गळै अणुगवुम्।',
        te: 'AI-ఉత్పత్తి చేసిన విశ్లేషణ। దయచేసి సమాచారాన్ని ధృవీకరించండి మరియు పెట్టుబడి నిర్ణయాల కోసం ఆర్థిక సలహాదారులను సంప్రదించండి।',
        kn: 'AI-ಉತ್ಪತ್ತಿ ವಿಶ್ಲೇಷಣೆ। ದಯವಿಟ್ಟು ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಹೂಡಿಕೆ ನಿರ್ಧಾರಗಳಿಗಾಗಿ ಹಣಕಾಸು ಸಲಹೆಗಾರರನ್ನು ಸಂಪರ್ಕಿಸಿ।',
        ml: 'AI-ജനറേറ്റഡ് വിശകലനം। വിവരങ്ങൾ പരിശോധിക്കുകയും നിക്ഷേപ തീരുമാനങ്ങൾക്ക് സാമ്പത്തിക ഉപദേശകരെ സമീപിക്കുകയും ചെയ്യുക।',
        pa: 'AI-ਜਨਰੇਟੇਡ ਵਿਸ਼ਲੇਸ਼ਣ। ਕਿਰਪਾ ਕਰਕੇ ਜਾਣਕਾਰੀ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਨਿਵੇਸ਼ ਫੈਸਲਿਆਂ ਲਈ ਵਿੱਤੀ ਸਲਾਹਕਾਰਾਂ ਨਾਲ ਸਲਾਹ ਲਓ।'
    },
    'ai.summary.closeAnalysis': {
        en: 'Close AI Analysis',
        hi: 'AI विश्लेषण बंद करें',
        mr: 'AI विश्लेषण बंद करा',
        gu: 'AI વિશ્લેષણ બંધ કરો',
        bn: 'AI বিশ্লেষণ বন্ধ করুন',
        ta: 'AI पगुप्पाय्वै मूदु',
        te: 'AI విశ్లేషణను మూసివేయండి',
        kn: 'AI ವಿಶ್ಲೇಷಣೆಯನ್ನು ಮುಚ್ಚಿ',
        ml: 'AI വിശകലനം അടയ്ക്കുക',
        pa: 'AI ਵਿਸ਼ਲੇਸ਼ਣ ਬੰਦ ਕਰੋ'
    },

    // Sentiment translations
    'sentiment.positive': {
        hi: 'सकारात्मक',
        mr: 'सकारात्मक',
        gu: 'સકારાત્મક',
        bn: 'ইতিবাচক',
        ta: 'नेर्मडै',
        te: 'సానుకూల',
        kn: 'ಧನಾತ್ಮಕ',
        ml: 'പോസിറ്റീവ്',
        pa: 'ਸਕਾਰਾਤਮਕ'
    },
    'sentiment.negative': {
        hi: 'नकारात्मक',
        mr: 'नकारात्मक',
        gu: 'નકારાત્મક',
        bn: 'নেতিবাচক',
        ta: 'एदिर्मडै',
        te: 'ప్రతికూల',
        kn: 'ಋಣಾತ್ಮಕ',
        ml: 'നെഗറ്റീവ്',
        pa: 'ਨਕਾਰਾਤਮਕ'
    },
    'sentiment.neutral': {
        hi: 'तटस्थ',
        mr: 'तटस्थ',
        gu: 'તટસ્થ',
        bn: 'নিরপেক্ষ',
        ta: 'नडुनिळै',
        te: 'తటస్థ',
        kn: 'ತಟಸ್ಥ',
        ml: 'ന്യൂട്രൽ',
        pa: 'ਨਿਰਪੱਖ'
    }
};

interface I18nContextType {
    currentLanguage: Language;
    setLanguage: (languageCode: string) => void;
    t: (key: string, fallback?: string) => string;
    getSupportedLanguages: () => Language[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
    children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
    const [currentLanguageCode, setCurrentLanguageCode] = useState<string>('en');

    const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguageCode) || SUPPORTED_LANGUAGES[0];

    // Load saved language preference from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
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
        }
    }, []);

    // Update document language and direction
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = currentLanguageCode;
            document.documentElement.dir = currentLanguage.direction;
        }
    }, [currentLanguageCode, currentLanguage.direction]);

    const setLanguage = (languageCode: string) => {
        setCurrentLanguageCode(languageCode);
        if (typeof window !== 'undefined') {
            localStorage.setItem('preferred-language', languageCode);
        }
    };

    const t = (key: string, fallback?: string): string => {
        // Check translations first for all languages including English
        const translation = translations[key]?.[currentLanguageCode];
        if (translation) {
            return translation;
        }

        // For English, return the fallback or key if no translation found
        if (currentLanguageCode === 'en') {
            return fallback || key;
        }

        // For other languages, try English fallback first
        const englishTranslation = translations[key]?.['en'];
        if (englishTranslation) {
            return englishTranslation;
        }

        // Return fallback or key if no translation found
        return fallback || key;
    };

    const getSupportedLanguages = (): Language[] => {
        return SUPPORTED_LANGUAGES;
    };

    return (
        <I18nContext.Provider
            value={{
                currentLanguage,
                setLanguage,
                t,
                getSupportedLanguages,
            }}
        >
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = (): I18nContextType => {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
};

export default I18nProvider;
