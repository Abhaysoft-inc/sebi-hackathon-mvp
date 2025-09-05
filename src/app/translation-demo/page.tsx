"use client";

import { useState } from 'react';
import useTextTranslation from '@/hooks/useTextTranslation';

// Hardcoded sample SEBI circulars (placeholder). In real app fetch from DB or API.
const CIRCULARS = [
    {
        id: 'c1',
        title: 'Framework for Strengthening Investor Grievance Redressal',
        body: 'Sebi introduces an enhanced framework to streamline the resolution of investor complaints. Intermediaries must acknowledge grievances within 2 working days and provide a resolution within 21 days.'
    },
    {
        id: 'c2',
        title: 'Guidelines on ESG Disclosures',
        body: 'New disclosure norms have been introduced for top listed entities to standardize reporting on environmental, social, and governance metrics.'
    }
];

export default function TranslationDemoPage() {
    const { translate, isLoading, error, lastTranslation, languages } = useTextTranslation();
    const [selectedCircular, setSelectedCircular] = useState(CIRCULARS[0]);
    const [targetLang, setTargetLang] = useState('hin_Deva');

    const handleTranslate = async () => {
        await translate(selectedCircular.body, targetLang);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">SEBI Circular Translation</h1>
                <p className="text-gray-600 mb-8">Select a circular and target language to translate using NLP Cloud.</p>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800">Circulars</h2>
                        <ul className="space-y-2">
                            {CIRCULARS.map(c => (
                                <li key={c.id}>
                                    <button
                                        onClick={() => setSelectedCircular(c)}
                                        className={`w-full text-left px-3 py-2 rounded border transition ${selectedCircular.id === c.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white hover:bg-gray-100 border-gray-200'}`}
                                    >
                                        <span className="font-medium block">{c.title}</span>
                                        <span className="text-xs opacity-75 line-clamp-2">{c.body}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Target Language</label>
                            <select
                                value={targetLang}
                                onChange={e => setTargetLang(e.target.value)}
                                className="w-full rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {languages.map(l => (
                                    <option key={l.code} value={l.code}>{l.name}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleTranslate}
                            disabled={isLoading}
                            className="w-full inline-flex items-center justify-center px-4 py-2 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isLoading ? 'Translating...' : 'Translate'}
                        </button>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white border border-gray-200 rounded p-4 shadow-sm">
                            <h2 className="text-xl font-semibold mb-2">Original (English)</h2>
                            <p className="text-gray-800 whitespace-pre-wrap">{selectedCircular.body}</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded p-4 shadow-sm min-h-[160px]">
                            <h2 className="text-xl font-semibold mb-2">Translation</h2>
                            {!lastTranslation && !isLoading && (
                                <p className="text-gray-400 text-sm">No translation yet.</p>
                            )}
                            {lastTranslation && (
                                <p className="text-gray-800 whitespace-pre-wrap">{lastTranslation}</p>
                            )}
                            {isLoading && (
                                <p className="animate-pulse text-gray-500">Processing...</p>
                            )}
                        </div>
                        <div className="text-xs text-gray-500">
                            Ensure you have set <code>NLP_CLOUD_API_KEY</code> in your environment. Model: NLLB-200 3.3B.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

