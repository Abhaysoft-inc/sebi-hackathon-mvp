import { prisma } from './prisma'

export interface SourceItem {
  type: 'wikipedia' | 'news' | 'finance'
  provider: string
  url?: string
  title?: string
  snippet?: string
  publishedAt?: string
  tickers?: string[]
  extra?: any
}

interface FetchContext {
  companyName?: string
  ticker?: string
  periodStart?: Date | null
  periodEnd?: Date | null
  shortSummary?: string
}

// Wikipedia: use MediaWiki action API for full plaintext extract (lead + body)
// We store full text in extra.full (optionally capped by env WIKIPEDIA_MAX_CHARS) and keep snippet for UI preview.
const MW_API = 'https://en.wikipedia.org/w/api.php'
export async function fetchWikipedia(companyName: string): Promise<SourceItem | null> {
  try {
    const title = companyName.trim()
    // Get full HTML of article
    const url = `${MW_API}?action=parse&page=${encodeURIComponent(title)}&prop=text|sections&format=json&redirects=1`
    const res = await fetch(url, { headers: { 'accept': 'application/json' } })
    if (!res.ok) return null
    const data = await res.json() as any
    const html: string | undefined = data?.parse?.text?.['*']
    if (!html) return null
    // Convert HTML to plaintext (preserve headings)
    let text = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<table[\s\S]*?<\/table>/gi, ' ')
      .replace(/<sup[\s\S]*?<\/sup>/gi, ' ')
      .replace(/<span class="mw-editsection"[\s\S]*?<\/span>/gi, ' ')
      .replace(/<\/?(p|br|hr)>/gi, '\n')
      .replace(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi, '\n\n$2\n')
      .replace(/<li>(.*?)<\/li>/gi, '- $1\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\n{2,}/g, '\n\n')
      .trim()
    const cap = Number(process.env.WIKIPEDIA_MAX_CHARS || 20000)
    const trimmedFull = text.slice(0, cap)
    return {
      type: 'wikipedia',
      provider: 'wikipedia',
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
      title: title,
      snippet: trimmedFull.slice(0, 1200),
      extra: { full: trimmedFull, originalLength: text.length, truncated: text.length > cap }
    }
  } catch {
    return null
  }
}

interface GuardianOptions {
  requiredTokens?: string[]
  years?: number[]
}

async function guardianSingleQuery(rawQuery: string, key: string, requiredTokens?: string[], maxSnippet = 1200, maxBody = 8000, strict = true) {
  try {
    const url = new URL('https://content.guardianapis.com/search')
    url.searchParams.set('api-key', key)
    url.searchParams.set('q', rawQuery)
    url.searchParams.set('page-size', '10')
    url.searchParams.set('show-fields', 'bodyText')
    const res = await fetch(url.toString())
    if (!res.ok) return []
    const data = await res.json() as any
    const results = data.response?.results || []
    const loweredTokens = (requiredTokens || []).map(t => t.toLowerCase())
    return results.map((r: any) => {
      const body: string | undefined = r.fields?.bodyText
      const trimmedBody = body?.trim()
      const truncatedBody = trimmedBody ? trimmedBody.slice(0, maxBody) : undefined
      const snippet = truncatedBody ? truncatedBody.slice(0, maxSnippet) : r.webTitle
      const hay = (r.webTitle + ' ' + (truncatedBody || '')).toLowerCase()
      const tokenHits = loweredTokens.filter(t => hay.includes(t)).length
      const allTokens = loweredTokens.length > 0 && tokenHits === loweredTokens.length
      const score = tokenHits * 10 + (allTokens ? 5 : 0) + Math.min((truncatedBody || '').length / 500, 5)
      return {
        type: 'news',
        provider: 'guardian',
        url: r.webUrl,
        title: r.webTitle,
        snippet,
        publishedAt: r.webPublicationDate,
        extra: {
          section: r.sectionName,
          wordCount: trimmedBody ? trimmedBody.split(/\s+/).length : undefined,
          bodyText: truncatedBody,
          truncated: !!trimmedBody && trimmedBody.length > (truncatedBody?.length || 0),
          tokenHits,
          allTokens,
          score,
          rawQuery
        }
      } as SourceItem
    }).filter((item: any) => {
      if (!strict || loweredTokens.length === 0) return true
      // Require all tokens for specificity
      return (item as any).extra?.allTokens
    })
  } catch {
    return []
  }
}

export async function fetchGuardian(topic: string, opts?: GuardianOptions): Promise<SourceItem[]> {
  const key = process.env.GUARDIAN_API_KEY
  if (!key) return []
  const strict = (process.env.GUARDIAN_STRICT_FILTER || '1') !== '0'
  const MAX_SNIPPET = Number(process.env.GUARDIAN_SNIPPET_MAX || 1200)
  const MAX_BODY = Number(process.env.GUARDIAN_BODY_MAX || 8000)
  const requiredTokens = opts?.requiredTokens || []
  const years = opts?.years || []

  // Build prioritized queries (most specific first)
  const phrase = '"' + topic + '"'
  const base = topic
  const tokenJoin = requiredTokens.join(' ')
  const queries: string[] = []
  queries.push(phrase)
  if (years.length) queries.push(phrase + ' ' + years[0])
  queries.push(base + ' securities scam')
  queries.push(tokenJoin + ' fraud')

  const seenUrls = new Set<string>()
  const collected: SourceItem[] = []
  for (const q of queries) {
    const batch = await guardianSingleQuery(q, key, requiredTokens, MAX_SNIPPET, MAX_BODY, strict)
    for (const item of batch) {
      if (!item.url) continue
      if (seenUrls.has(item.url)) continue
      seenUrls.add(item.url)
      collected.push(item)
    }
    // Early stop if we already have some high scoring matches
    if (collected.length >= 5) break
  }
  // Sort by score if present
  collected.sort((a: any, b: any) => (b.extra?.score || 0) - (a.extra?.score || 0))
  return collected
}

// NewsAPI disabled (keeping only Guardian for now). If re-enabled, restore fetchNewsApi implementation here.

// Finance data: using unofficial Yahoo endpoints (basic price + summary) to avoid adding dependency now.
export async function fetchFinance(ticker: string): Promise<SourceItem | null> {
  if (!ticker) return null
  try {
    const summaryUrl = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(ticker)}?modules=price,summaryProfile`
    const res = await fetch(summaryUrl)
    if (!res.ok) return null
    const json = await res.json() as any
    const price = json?.quoteSummary?.result?.[0]?.price
    const profile = json?.quoteSummary?.result?.[0]?.summaryProfile
    return {
      type: 'finance',
      provider: 'yahoo-finance',
      title: ticker.toUpperCase(),
      snippet: price?.shortName || ticker,
      extra: {
        currency: price?.currency,
        marketPrice: price?.regularMarketPrice?.raw,
        marketChangePercent: price?.regularMarketChangePercent?.fmt,
        sector: profile?.sector,
        industry: profile?.industry,
        longBusinessSummary: profile?.longBusinessSummary?.slice(0, 1200)
      }
    }
  } catch {
    return null
  }
}

export interface EnrichmentResult {
  sources: SourceItem[]
  stats: { wikipedia: number; news: number; finance: number; guardian?: number; currents?: number; gemini?: number } & Record<string, any>
}

// Gemini-powered source enhancement when initial enrichment fails
async function enhanceWithGemini(context: FetchContext, existingSources: SourceItem[]): Promise<SourceItem[]> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return []

  const { companyName, ticker, shortSummary } = context
  const sourceCount = existingSources.length

  try {
    // Build a comprehensive prompt to get Gemini to suggest sources and provide additional context
    const prompt = `You are a financial research assistant. I need to find comprehensive information about a financial case study.

Company: ${companyName || 'Unknown'}
Ticker: ${ticker || 'Unknown'}
Summary: ${shortSummary || 'No summary provided'}

Current sources found: ${sourceCount}
${existingSources.map(s => `- ${s.provider}: ${s.title || 'Untitled'}`).join('\n')}

The current enrichment process found limited sources. Please help by:

1. Providing key facts about this company/case if it involves financial fraud, scams, or regulatory issues
2. Suggesting specific search terms that would help find more relevant sources
3. Providing any timeline or key events related to this case
4. Mentioning any regulatory bodies, documents, or reports that would be relevant

Please respond in this JSON format:
{
  "keyFacts": "Brief factual summary of the case/company",
  "searchTerms": ["term1", "term2", "term3"],
  "timeline": "Key dates and events if known",
  "regulatoryContext": "Relevant regulatory information",
  "additionalContext": "Any other relevant information"
}

Focus on factual, verifiable information. If this is a well-known financial case, provide accurate details.`

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
    const body = { contents: [{ parts: [{ text: prompt }] }] }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      console.warn('[Gemini] HTTP error:', res.status)
      return []
    }

    const data = await res.json()
    const text: string = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('\n') || ''

    if (!text) return []

    // Try to extract JSON from response
    let geminiData: any
    try {
      // Try direct JSON parse first
      geminiData = JSON.parse(text.trim())
    } catch {
      // Extract JSON from markdown code blocks or find JSON object
      const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || text.match(/(\{[\s\S]*?\})/)
      if (jsonMatch) {
        try {
          geminiData = JSON.parse(jsonMatch[1])
        } catch {
          console.warn('[Gemini] Failed to parse extracted JSON')
          return []
        }
      } else {
        console.warn('[Gemini] No JSON found in response')
        return []
      }
    }

    // Create enriched sources from Gemini data
    const geminiSources: SourceItem[] = []

    if (geminiData.keyFacts) {
      geminiSources.push({
        type: 'wikipedia',
        provider: 'gemini',
        title: `${companyName} - AI Research Summary`,
        snippet: geminiData.keyFacts.slice(0, 1200),
        extra: {
          full: geminiData.keyFacts,
          aiGenerated: true,
          searchTerms: geminiData.searchTerms || [],
          timeline: geminiData.timeline || '',
          regulatoryContext: geminiData.regulatoryContext || '',
          additionalContext: geminiData.additionalContext || ''
        }
      })
    }

    // If we have search terms, try to fetch additional sources with those terms
    if (geminiData.searchTerms && Array.isArray(geminiData.searchTerms)) {
      const hasGuardian = !!process.env.GUARDIAN_API_KEY
      if (hasGuardian) {
        for (const term of geminiData.searchTerms.slice(0, 2)) { // Limit to 2 additional searches
          try {
            const additionalSources = await fetchGuardian(term, {
              requiredTokens: [companyName || ''].filter(Boolean)
            })
            geminiSources.push(...additionalSources.slice(0, 2)) // Limit results per term
          } catch (error) {
            console.warn('[Gemini] Error fetching additional Guardian sources:', error)
          }
        }
      }
    }

    return geminiSources

  } catch (error) {
    console.warn('[Gemini] Error enhancing sources:', error)
    return []
  }
}

export async function enrichCase(context: FetchContext): Promise<EnrichmentResult> {
  const { companyName, ticker } = context
  const tasks: Promise<any>[] = []
  const trimmedTicker = (ticker || '').trim()

  if (companyName) tasks.push(fetchWikipedia(companyName))

  // Build expanded news query variants for broader recall (deduped later)
  const newsQueries = new Set<string>()
  const requiredTokens: string[] = []
  if (companyName) {
    const base = companyName.trim()
    newsQueries.add(base)
    // Add variants if not already containing the words
    if (!/scam/i.test(base)) newsQueries.add(base + ' scam')
    if (!/fraud/i.test(base)) newsQueries.add(base + ' fraud')
    // Derive required tokens from significant words (>2 chars)
    for (const part of base.split(/\s+/)) {
      const clean = part.replace(/[^a-zA-Z0-9]/g, '')
      if (clean.length > 2) requiredTokens.push(clean)
    }
  }

  // Launch guardian/newsapi tasks if API keys exist
  const hasGuardian = !!process.env.GUARDIAN_API_KEY
  if (hasGuardian) {
    // Include period year hints if available
    const years: number[] = []
    if (context.periodStart) years.push(new Date(context.periodStart).getFullYear())
    if (context.periodEnd) {
      const y = new Date(context.periodEnd).getFullYear()
      if (!years.includes(y)) years.push(y)
    }
    tasks.push(fetchGuardian(companyName || '', { requiredTokens, years }))
  }
  // Currents API (optional) - single focused query to conserve rate limit
  if (companyName && process.env.CURRENTS_API_KEY) {
    const dateRange = {
      start: context.periodStart ? context.periodStart.toISOString() : undefined,
      end: context.periodEnd ? context.periodEnd.toISOString() : undefined
    }
    tasks.push(fetchCurrents(companyName, { requiredTokens, ...(dateRange.start || dateRange.end ? { dateRange } : {}) } as any))
  }

  // Finance only if a non-empty ticker explicitly provided
  if (trimmedTicker.length > 0) tasks.push(fetchFinance(trimmedTicker))

  const settled = await Promise.allSettled(tasks)
  const collected: SourceItem[] = []
  for (const s of settled) {
    if (s.status === 'fulfilled') {
      const val = s.value
      if (!val) continue
      if (Array.isArray(val)) collected.push(...val)
      else collected.push(val)
    }
  }

  // De-dupe by url+title hash
  const seen = new Set<string>()
  const deduped: SourceItem[] = []
  for (const src of collected) {
    const key = (src.url || '') + '|' + (src.title || '')
    if (seen.has(key)) continue
    seen.add(key)
    deduped.push(src)
  }

  // Check if we need Gemini enhancement (if we have few sources or no news sources)
  const newsCount = deduped.filter(s => s.type === 'news').length
  const totalCount = deduped.length
  const needsEnhancement = totalCount < 3 || newsCount === 0

  let geminiSources: SourceItem[] = []
  if (needsEnhancement && process.env.GEMINI_API_KEY) {
    console.log(`[Enrichment] Sources found: ${totalCount}, news: ${newsCount}. Enhancing with Gemini...`)
    geminiSources = await enhanceWithGemini(context, deduped)

    // Add Gemini sources while avoiding duplicates
    for (const geminiSource of geminiSources) {
      const key = (geminiSource.url || '') + '|' + (geminiSource.title || '')
      if (!seen.has(key)) {
        seen.add(key)
        deduped.push(geminiSource)
      }
    }
  }

  const guardianCount = deduped.filter(s => s.provider === 'guardian').length
  const currentsCount = deduped.filter(s => s.provider === 'currents').length
  const geminiCount = deduped.filter(s => s.provider === 'gemini').length

  return {
    sources: deduped,
    stats: {
      wikipedia: deduped.filter(s => s.provider === 'wikipedia').length,
      news: deduped.filter(s => s.type === 'news').length,
      guardian: guardianCount,
      currents: currentsCount,
      gemini: geminiCount,
      finance: deduped.filter(s => s.type === 'finance').length,
      _guardianKey: process.env.GUARDIAN_API_KEY ? 1 : 0,
      _currentsKey: process.env.CURRENTS_API_KEY ? 1 : 0,
      _geminiKey: process.env.GEMINI_API_KEY ? 1 : 0,
      _queriesTried: Array.from(newsQueries).length,
      _requiredTokens: requiredTokens,
      _geminiEnhanced: geminiSources.length > 0
    }
  }
}

export async function storeEnrichment(caseId: number, sources: SourceItem[]) {
  // Attempt prisma update; fallback raw
  try {
    await prisma.caseStudy.update({ where: { id: caseId }, data: { sources: sources as any } as any })
  } catch (e) {
    await prisma.$queryRawUnsafe(`UPDATE "CaseStudy" SET sources = $1 WHERE id = $2`, JSON.stringify(sources), caseId)
  }
}

// -------------------- Currents API Integration --------------------

interface CurrentsOptions { requiredTokens?: string[]; dateRange?: { start?: string; end?: string } }

// Simple in-memory cache to avoid exceeding 20 req/day (keyed by topic)
const currentsCache: Map<string, { ts: number; items: SourceItem[] }> = new Map()
const CURRENTS_TTL_MS = 1000 * 60 * 60 * 6 // 6 hours

async function fetchCurrents(topic: string, opts?: CurrentsOptions): Promise<SourceItem[]> {
  const apiKey = process.env.CURRENTS_API_KEY
  if (!apiKey) return []
  const cacheKey = topic.toLowerCase()
  const cached = currentsCache.get(cacheKey)
  const now = Date.now()
  if (cached && (now - cached.ts) < CURRENTS_TTL_MS) {
    return cached.items
  }
  const country = process.env.CURRENTS_COUNTRY || 'IN'
  const language = process.env.CURRENTS_LANGUAGE || 'en'
  const page = process.env.CURRENTS_PAGE || '1'
  const limit = process.env.CURRENTS_LIMIT || '10'
  const primaryQuery = topic.trim()
  const buildUrl = (keywords: string | null) => {
    const u = new URL('https://api.currentsapi.services/v1/search')
    u.searchParams.set('country', country)
    u.searchParams.set('page_number', page)
    u.searchParams.set('language', language)
    u.searchParams.set('limit', limit)
    if (keywords && keywords.length > 0) u.searchParams.set('keywords', keywords)
    if (opts?.dateRange?.start) u.searchParams.set('start_date', opts.dateRange.start)
    if (opts?.dateRange?.end) u.searchParams.set('end_date', opts.dateRange.end)
    return u
  }
  let url = buildUrl(primaryQuery)
  try {
    const res = await fetch(url.toString(), { headers: { Authorization: apiKey } })
    if (!res.ok) return []
    const data = await res.json() as any
    const news: any[] = data.news || []
    const required = (opts?.requiredTokens || []).map(t => t.toLowerCase())
    const strict = (process.env.CURRENTS_STRICT_FILTER || '1') !== '0'
    const debug = process.env.CURRENTS_DEBUG === '1'
    const fetchHtml = process.env.CURRENTS_FETCH_HTML === '1'
    const articleCap = Number(process.env.CURRENTS_ARTICLE_MAX_CHARS || 20000)
    // Simple per-URL cache during this function run to avoid duplicate fetches if duplicates appear
    const urlContentCache: Record<string, string> = {}

    async function fetchFullArticle(u: string | undefined): Promise<string | undefined> {
      if (!fetchHtml || !u) return undefined
      if (urlContentCache[u]) return urlContentCache[u]
      try {
        const htmlRes = await fetch(u, { headers: { 'User-Agent': 'CaseStudyBot/1.0 (+https://example.com)' } })
        if (!htmlRes.ok) return undefined
        const html = await htmlRes.text()
        // crude extraction: remove scripts/styles, strip tags, collapse whitespace
        const cleaned = html
          .replace(/<script[\s\S]*?<\/script>/gi, ' ')
          .replace(/<style[\s\S]*?<\/style>/gi, ' ')
          .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
          .replace(/<header[\s\S]*?<\/header>/gi, ' ')
          .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
          .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
          .replace(/<[^>]+>/g, ' ') // strip tags
          .replace(/&nbsp;/g, ' ')
          .replace(/\s+/g, ' ')    // collapse
          .trim()
        const sliced = cleaned.slice(0, articleCap)
        urlContentCache[u] = sliced
        return sliced
      } catch {
        return undefined
      }
    }
    const mapItem = (n: any): SourceItem => {
      const body = n.description as string | undefined
      const base: SourceItem = {
        type: 'news',
        provider: 'currents',
        url: n.url as string | undefined,
        title: n.title as string | undefined,
        snippet: body ? body.slice(0, 1200) : (n.title as string | undefined),
        publishedAt: n.published as string | undefined,
        extra: {
          author: n.author,
          category: n.category,
          image: n.image,
          id: n.id,
          originalTotal: news.length,
          strictFilter: strict,
          requiredTokens: required
        }
      } satisfies SourceItem
      return base
    }
    let items = news.map(mapItem).filter((item: SourceItem) => {
      if (!strict || required.length === 0) return true
      const hay = ((item.title || '') + ' ' + (item.snippet || '')).toLowerCase()
      return required.every(tok => hay.includes(tok))
    })
    // If no items and we used keywords, try a fallback without keywords (broad country feed) to see if anything matches loosely
    if (items.length === 0 && news.length === 0) {
      if (debug) console.warn('[currents] No results with keywords, retrying without keywords for topic:', topic)
      url = buildUrl(null)
      const res2 = await fetch(url.toString(), { headers: { Authorization: apiKey } })
      if (res2.ok) {
        const data2 = await res2.json() as any
        const news2: any[] = data2.news || []
        const news2Items = news2.map(mapItem)
        if (news2Items.length > 0) {
          news2Items.forEach(i => { if (i.extra) i.extra.noKeywordFallback = true })
          items = news2Items
        }
      }
    }
    if (strict && required.length > 0 && news.length > 0 && items.length === 0) {
      if (debug) console.warn('[currents] strict filter removed all items; relaxing filter for topic:', topic)
      items = news.map(mapItem)
      items.forEach(i => { if (i.extra) i.extra.relaxedFallback = true })
    }
    // Enrich with full article content if enabled
    if (fetchHtml) {
      for (const it of items) {
        if (!it.extra) it.extra = {}
        const full = await fetchFullArticle(it.url)
        if (full) {
          it.extra.full = full
          it.extra.fullLength = full.length
        }
      }
    }
    currentsCache.set(cacheKey, { ts: now, items })
    return items
  } catch {
    return []
  }
}

export async function logGeneration(caseStudyId: number | null, phase: string, inputPayload?: any, outputPayload?: any, error?: string) {
  const safeInput = inputPayload === undefined ? null : inputPayload
  const safeOutput = outputPayload === undefined ? null : outputPayload
  const safeError = error === undefined ? null : error
  try {
    // Prefer prisma delegate only; raw fallback optional via env
    // @ts-ignore
    await prisma.caseGenerationLog.create({
      data: {
        caseStudyId: caseStudyId || undefined,
        phase,
        inputPayload: safeInput as any,
        outputPayload: safeOutput as any,
        error: safeError
      }
    })
    return
  } catch (e: any) {
    if (process.env.LOG_RAW_FALLBACK === '1') {
      try {
        await prisma.$queryRawUnsafe(
          `INSERT INTO "CaseGenerationLog" ("caseStudyId", phase, "inputPayload", "outputPayload", error) VALUES ($1,$2,$3,$4,$5)`,
          caseStudyId, phase, safeInput ? JSON.stringify(safeInput) : null, safeOutput ? JSON.stringify(safeOutput) : null, safeError || null
        )
      } catch { }
    }
    if (process.env.GENERATION_LOG_DEBUG === '1') {
      // eslint-disable-next-line no-console
      console.warn('[logGeneration] failed delegate insert', { phase, err: e?.message })
    }
  }
}
