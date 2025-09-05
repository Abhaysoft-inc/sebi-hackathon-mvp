import { NextRequest, NextResponse } from 'next/server';
import { resolveLanguageCode, ACTIVE_TRANSLATION_LANGUAGES, LEGACY_NLLB_TO_MBART } from '@/lib/translationLanguages';

// Switch to mBART-50 many-to-many model
const HF_MODEL = 'facebook/mbart-large-50-many-to-many-mmt';
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

export async function POST(req: NextRequest) {
  try {
    const hfKey = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_KEY;
    if (!hfKey) {
      return NextResponse.json(
        { error: 'Missing HUGGINGFACE_API_KEY (or HF_API_KEY) env variable' },
        { status: 500 }
      );
    }

  const { text, targetLanguage, sourceLanguage } = await req.json();

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }
    if (!targetLanguage) {
      return NextResponse.json(
        { error: 'targetLanguage is required' },
        { status: 400 }
      );
    }

    // Resolve / map legacy codes
    const normalizedTarget = LEGACY_NLLB_TO_MBART[targetLanguage] || targetLanguage;
    const targetCode = ACTIVE_TRANSLATION_LANGUAGES.find(l => l.code === normalizedTarget)?.code;
    if (!targetCode) {
      return NextResponse.json(
        { error: `Unsupported or disabled target language: ${targetLanguage}` },
        { status: 400 }
      );
    }

    const normalizedSourceInput = sourceLanguage ? (LEGACY_NLLB_TO_MBART[sourceLanguage] || sourceLanguage) : 'en_XX';
    const sourceCode = ACTIVE_TRANSLATION_LANGUAGES.find(l => l.code === normalizedSourceInput)?.code || 'en_XX';

    // NLLB 3.3B sync mode 256 token limit: implement naive chunking by paragraphs / sentences
  const MAX_CHUNK_CHARS = 800; // keep small for distilled model latency
    const paragraphs = text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
    const chunks: string[] = [];
    let current = '';
    for (const p of paragraphs) {
      if ((current + '\n\n' + p).length > MAX_CHUNK_CHARS && current) {
        chunks.push(current);
        current = p;
      } else {
        current = current ? current + '\n\n' + p : p;
      }
    }
    if (current) chunks.push(current);

    const translatedParts: string[] = [];
    for (const chunk of chunks) {
      const payload = {
        inputs: chunk,
        parameters: {
          src_lang: sourceCode,
          tgt_lang: targetCode
        }
      } as any;

      const response = await fetch(HF_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 503) {
        // Model cold start – simple retry after short delay
        await new Promise(r => setTimeout(r, 1500));
        const warmResp = await fetch(HF_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${hfKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!warmResp.ok) {
          const warmErr = await warmResp.text();
          return NextResponse.json({ error: 'Model warming failed', details: warmErr }, { status: 502 });
        }
        const warmData = await warmResp.json();
  // mBART returns either an array with {translation_text} or a string; normalize
  translatedParts.push(Array.isArray(warmData) ? (warmData[0]?.translation_text || '') : (warmData.translation_text || warmData[0]?.generated_text || ''));
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        return NextResponse.json({ error: 'HF translation failed', details: errText }, { status: 502 });
      }
  const data = await response.json();
  translatedParts.push(Array.isArray(data) ? (data[0]?.translation_text || '') : (data.translation_text || data[0]?.generated_text || ''));
    }

  return NextResponse.json({ translation: translatedParts.join('\n\n'), model: HF_MODEL, source: sourceCode, target: targetCode });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Unexpected error' }, { status: 500 });
  }
}
