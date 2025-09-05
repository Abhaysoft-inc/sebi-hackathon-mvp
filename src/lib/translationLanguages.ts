// Comprehensive language support & filtered Indian language subset for UI
// Source: NLP Cloud NLLB-200 supported codes (user provided list)

export interface TranslationLanguage {
  name: string;
  code: string; // NLLB language code
  scripts?: string[];
  isIndian?: boolean; // Flag for Indian (official + major regional) languages
}

// FULL list (only partial comments kept for brevity). If needed, extend similarly.
// We only export the subset for India in normal UI to keep dropdown concise.
export const FULL_LANGUAGES: TranslationLanguage[] = [
  { name: 'English', code: 'eng_Latn', isIndian: true },
  { name: 'Hindi', code: 'hin_Deva', isIndian: true },
  { name: 'Bengali', code: 'ben_Beng', isIndian: true },
  { name: 'Assamese', code: 'asm_Beng', isIndian: true },
  { name: 'Gujarati', code: 'guj_Gujr', isIndian: true },
  { name: 'Kannada', code: 'kan_Knda', isIndian: true },
  { name: 'Kashmiri (Arabic)', code: 'kas_Arab', isIndian: true },
  { name: 'Kashmiri (Devanagari)', code: 'kas_Deva', isIndian: true },
  { name: 'Malayalam', code: 'mal_Mlym', isIndian: true },
  { name: 'Marathi', code: 'mar_Deva', isIndian: true },
  { name: 'Meitei (Bengali script)', code: 'mni_Beng', isIndian: true },
  { name: 'Nepali', code: 'npi_Deva', isIndian: true }, // corrected code from npi_Deva (was nep_Deva)
  { name: 'Odia', code: 'ory_Orya', isIndian: true },
  { name: 'Eastern Panjabi (Gurmukhi)', code: 'pan_Guru', isIndian: true },
  { name: 'Sanskrit', code: 'san_Deva', isIndian: true },
  { name: 'Santali', code: 'sat_Olck', isIndian: true },
  { name: 'Sindhi', code: 'snd_Arab', isIndian: true },
  { name: 'Tamil', code: 'tam_Taml', isIndian: true },
  { name: 'Telugu', code: 'tel_Telu', isIndian: true },
  { name: 'Urdu', code: 'urd_Arab', isIndian: true },
  { name: 'Maithili', code: 'mai_Deva', isIndian: true },
  { name: 'Magahi', code: 'mag_Deva', isIndian: true },
  { name: 'Bhojpuri', code: 'bho_Deva', isIndian: true },
  { name: 'Awadhi', code: 'awa_Deva', isIndian: true },
  { name: 'Chhattisgarhi', code: 'hne_Deva', isIndian: true },
  { name: 'Mizo', code: 'lus_Latn', isIndian: true },
  { name: 'Standard Tibetan', code: 'bod_Tibt', isIndian: true },
  // Additional non-Indian languages (subset examples) – can be used later if you expose global mode
  { name: 'Spanish', code: 'spa_Latn' },
  { name: 'French', code: 'fra_Latn' },
  { name: 'German', code: 'deu_Latn' },
  { name: 'Portuguese', code: 'por_Latn' },
  { name: 'Russian', code: 'rus_Cyrl' },
  { name: 'Chinese (Simplified)', code: 'zho_Hans' },
  { name: 'Chinese (Traditional)', code: 'zho_Hant' },
  { name: 'Japanese', code: 'jpn_Jpan' },
  { name: 'Korean', code: 'kor_Hang' },
  { name: 'Arabic (Modern Standard)', code: 'arb_Arab' }
];

export const INDIAN_LANGUAGES: TranslationLanguage[] = FULL_LANGUAGES.filter(l => l.isIndian);

// Active subset (as per current requirement) now using mBART-50 (facebook/mbart-large-50-many-to-many-mmt)
// Active set now targets mBART-50 language codes (different from earlier NLLB codes)
export const ACTIVE_TRANSLATION_LANGUAGES: TranslationLanguage[] = [
  { name: 'English', code: 'en_XX', isIndian: true },
  { name: 'Hindi', code: 'hi_IN', isIndian: true },
  { name: 'Gujarati', code: 'gu_IN', isIndian: true },
  { name: 'Marathi', code: 'mr_IN', isIndian: true },
  { name: 'Bengali', code: 'bn_IN', isIndian: true },
  { name: 'Tamil', code: 'ta_IN', isIndian: true }
];

// Backward compatibility map from previously exposed NLLB codes to mBART codes (for saved user prefs)
export const LEGACY_NLLB_TO_MBART: Record<string, string> = {
  eng_Latn: 'en_XX',
  hin_Deva: 'hi_IN',
  guj_Gujr: 'gu_IN',
  mar_Deva: 'mr_IN',
  ben_Beng: 'bn_IN',
  tam_Taml: 'ta_IN'
};

export const languageNameToCode = Object.fromEntries(FULL_LANGUAGES.map(l => [l.name.toLowerCase(), l.code]));
export const languageCodeSet = new Set(FULL_LANGUAGES.map(l => l.code));

export function resolveLanguageCode(input: string): string | undefined {
  if (!input) return undefined;
  if (languageCodeSet.has(input)) return input;
  return languageNameToCode[input.toLowerCase()];
}

export function isIndianLanguage(codeOrName: string): boolean {
  const code = resolveLanguageCode(codeOrName) || codeOrName;
  return INDIAN_LANGUAGES.some(l => l.code === code || l.name.toLowerCase() === codeOrName.toLowerCase());
}
