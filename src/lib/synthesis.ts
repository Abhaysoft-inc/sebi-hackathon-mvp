import { prisma } from './prisma'
import { logGeneration } from './enrichment'
import { slugify } from './utils'

interface SourceLike { provider: string; title?: string; snippet?: string; url?: string; extra?: any }

export interface SynthesisResult {
  fullNarrative: string
  quiz: Array<{ order: number; prompt: string; options: string[]; correctOptionIndex: number; explanation: string; category?: string; difficulty?: string }>
  rawModelText?: string
  usedModel?: string
  mode?: 'model' | 'local'
  diagnostics?: Record<string, any>
}

class SynthesisError extends Error {
  code: string
  meta?: any
  constructor(message: string, code: string, meta?: any) {
    super(message)
    this.code = code
    this.meta = meta
  }
}

function getDesiredQuestions() {
  // Always require exactly 5 questions
  return 5
}

function scoreSource(s: SourceLike, topic: string, summary: string): number {
  const base = ((s.title || '') + ' ' + (s.snippet || '') + ' ' + (s.extra?.full || '')).toLowerCase()
  let score = 0
  const topicTokens = topic.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
  for (const t of topicTokens) if (base.includes(t)) score += 3
  const summaryTokens = summary.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
  for (const t of summaryTokens) if (base.includes(t)) score += 1
  if (s.provider === 'wikipedia') score += 2 // mild boost for encyclopedic context
  return score
}

function buildPrompt(topic: string, shortSummary: string | null, sources: SourceLike[], desiredQuestions = getDesiredQuestions()): string {
  const useFull = process.env.SOURCE_FULL_TEXT === '1'
  const perSourceCap = Number(process.env.SOURCE_PER_CAP || (useFull ? 20000 : 800))
  const totalCap = Number(process.env.SOURCE_TOTAL_CHAR_CAP || (useFull ? 60000 : 9000))
  const summary = shortSummary || ''
  // Re-rank sources by relevance
  const ranked = [...sources].map(s => ({ s, score: scoreSource(s, topic, summary) }))
    .sort((a, b) => b.score - a.score)
  let assembled = ''
  let index = 0
  for (const { s } of ranked) {
    const raw = useFull ? (s.extra?.full || s.snippet || '') : (s.snippet || s.extra?.full || '')
    const content = perSourceCap > 0 ? raw.slice(0, perSourceCap) : raw
    const block = `[S${++index}|${s.provider}] ${s.title || ''}\n${content}\nURL: ${s.url || ''}`.trim()
    if ((assembled + '\n\n' + block).length > totalCap) break
    assembled += (assembled ? '\n\n' : '') + block
  }
  return `You are a senior investigative financial forensic analyst. Produce an advanced, analytically rich case study.
Topic: ${topic}
Admin Seed Summary: ${shortSummary || 'N/A'}

Ranked Source Material (each block tagged S#):\n${assembled || '(none)'}

STRICT TASKS:
1. Craft a single cohesive narrative (~900-1400 words) ONLY with information grounded in sources or the admin seed summary. Start with a refined case title line (no markdown fences). Do NOT emit boilerplate or empty sections. Create/merge headings dynamically ONLY if content is substantive. Every material factual claim must cite at least one source tag like [S2]. If a commonly expected aspect (e.g. precise impact) lacks evidence, explicitly indicate uncertainty instead of inventing.
2. Ensure high information density: remove duplication, integrate mechanisms, flows, control failures, red flags, detection, regulatory aftermath, systemic impact, and lessons as flowing analytical paragraphs—not stub sections.
3. Generate EXACTLY ${desiredQuestions} challenging multiple choice questions (JSON field "questions"). This is MANDATORY - you must generate exactly ${desiredQuestions} questions, no more, no less. Each question object must have: prompt, options (4), correctOptionIndex, explanation, category, difficulty. Categories allowed: timeline, actor, mechanism, red_flag, regulatory_response, impact, lesson. Cover at least 5 distinct categories overall. Difficulty distribution: >=2 hard, >=2 medium, remainder easy/medium/hard. Prompts must test why/how/implication/sequencing—not superficial recall. Explanations must cite at least one source tag and (where relevant) contrast distractors briefly.
4. ABSOLUTE CONSTRAINTS: No hallucinated numbers, dates, institutions, or actors. No generic filler headings like "Impact" if zero evidence—either omit or label as uncertain with citation/absence note. Keep strictly relevant to the topic; exclude unrelated market history.
5. OUTPUT FORMAT: Return STRICT JSON ONLY (no pre/post text) exactly: {"narrative":"...","questions":[ { ... } ] } . Ensure valid JSON, escape quotes inside strings, no markdown fences.`
}

// Sanitize and shorten refined title extracted from first narrative line
function sanitizeRefinedTitle(raw: string, fallback: string): string {
  if (!raw) return fallback
  let t = raw
    .replace(/^#+\s*/, '') // remove heading markers
    .replace(/\[S\d+(?:,\s*S\d+)*\]/g, '') // remove source tags like [S2]
    .replace(/[`"'•*]+/g, '') // strip stray punctuation/bullets
    .replace(/[-–—]\s*analytical summary.*$/i, '') // drop trailing analytical summary descriptors
    .replace(/\(local heuristic synthesis[^)]*\)/i, '') // remove heuristic disclaimer
    .replace(/\bheuristic draft\b/i, '')
    .replace(/\bpreliminary case brief\b/i, '')
  t = t.replace(/\s+/g, ' ').trim()
  t = t.replace(/[\s\-–—_:;,\/]+$/, '').trim()
  // Remove redundant trailing 'Case Study' duplication
  t = t.replace(/(Case Study)(?:\s+Case Study)+$/i, '$1')
  // If it still contains leftover explanatory parentheses at end, strip them
  t = t.replace(/\([^)]{0,60}\)$/, '').trim()
  const MAX = 90
  if (t.length > MAX) {
    const cut = t.slice(0, MAX)
    const lastSpace = cut.lastIndexOf(' ')
    t = lastSpace > 50 ? cut.slice(0, lastSpace) : cut
  }
  if (t.length < 8) return fallback
  return t.charAt(0).toUpperCase() + t.slice(1)
}

async function callGemini(prompt: string, model: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new SynthesisError('GEMINI_API_KEY missing', 'missing_api_key')
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`
  const body = { contents: [{ parts: [{ text: prompt }] }] }
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) {
    const txt = await res.text()
    throw new SynthesisError(`Gemini HTTP ${res.status}: ${txt.slice(0, 300)}`, 'model_http')
  }
  const data = await res.json()
  const text: string = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('\n') || ''
  if (!text) throw new SynthesisError('Empty Gemini response', 'empty_response')
  return text
}

function extractJson(raw: string): any {
  const trimmed = raw.trim()
  // Attempt direct parse
  try { return JSON.parse(trimmed) } catch { }
  // Try to find first { ... } block
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start >= 0 && end > start) {
    const candidate = trimmed.slice(start, end + 1)
    try { return JSON.parse(candidate) } catch { }
    // Attempt a light repair: remove trailing commas before } or ]
    try {
      const repaired = candidate
        .replace(/,\s*([}\]])/g, '$1')
        .replace(/\n/g, '\n')
      return JSON.parse(repaired)
    } catch { }
  }
  throw new SynthesisError('Failed to parse model JSON', 'parse_error')
}

export async function synthesizeCase(caseId: number): Promise<SynthesisResult> {
  const caseStudy = await prisma.caseStudy.findUnique({ where: { id: caseId } })
  if (!caseStudy) throw new Error('Case not found')
  const sources: SourceLike[] = (caseStudy.sources as any) || []
  const topic = caseStudy.companyName || caseStudy.title
  const prompt = buildPrompt(topic, caseStudy.shortSummary || caseStudy.narrative, sources)
  await logGeneration(caseId, 'synthesis:prompt', { promptPreview: prompt.slice(0, 1200), sourceCount: sources.length })

  let modelText: string | undefined
  let parsed: any
  let usedModel: string | undefined
  async function persistResult(result: SynthesisResult, refinedBaseTitle?: string) {
    // caseStudy already verified non-null above but narrow for TS
    const cs = caseStudy as NonNullable<typeof caseStudy>
    // Derive refined title like main path does
    const narrative = result.fullNarrative
    const firstLine = narrative.split(/\n+/).find(l => l.trim().length > 0)?.trim() || ''
    const refinedTitle = sanitizeRefinedTitle(refinedBaseTitle || firstLine.slice(0, 140), cs.title)
    const slugBase = refinedTitle || cs.title
    const baseSlug = slugify(slugBase).slice(0, 60)
    try {
      await prisma.$transaction(async (tx) => {
        let slug = baseSlug
        if (slug) {
          const existing = await tx.caseStudy.findFirst({ where: { slug, NOT: { id: caseId } }, select: { id: true } })
          if (existing) slug = `${slug}-${caseId}`
        }
        await tx.caseStudy.update({ where: { id: caseId }, data: { fullNarrative: result.fullNarrative, challengeQuestion: result.quiz[0]?.prompt || 'N/A', explanation: result.quiz[0]?.explanation || 'N/A', refinedTitle: refinedTitle !== cs.title ? refinedTitle : cs.refinedTitle, slug: slug || cs.slug } })
        await tx.quizQuestion.deleteMany({ where: { caseStudyId: caseId } })
        for (const q of result.quiz) {
          await tx.quizQuestion.create({ data: { caseStudyId: caseId, order: q.order, prompt: q.prompt, options: q.options as any, correctOptionIndex: q.correctOptionIndex, explanation: q.explanation, category: q.category, difficulty: q.difficulty } })
        }
      })
      await logGeneration(caseId, 'synthesis:persistComplete', { mode: result.mode })
    } catch (e: any) {
      await logGeneration(caseId, 'synthesis:persistError', { mode: result.mode }, undefined, e.message)
    }
  }
  if (!process.env.GEMINI_API_KEY) {
    if (process.env.LOCAL_SYNTH_FALLBACK === '1') {
      const result = localHeuristicSynthesis(caseStudy, sources, { reason: 'missing_api_key' })
      await persistResult(result)
      return result
    }
    throw new SynthesisError('GEMINI_API_KEY missing', 'missing_api_key')
  }
  // Normalize provided model (handle older alias names)
  const requested = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
  const normalizeModel = (m: string) => {
    if (m === 'gemini-pro') return 'gemini-1.5-pro'
    if (m === 'gemini-2.5-flash') return 'gemini-1.5-flash' // fallback if user supplied future/invalid label
    return m
  }
  const primaryModel = normalizeModel(requested)
  const fallbackModels = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro']
  const tried: string[] = []
  let lastErr: any
  for (const model of [primaryModel, ...fallbackModels.filter(m => m !== primaryModel)]) {
    try {
      tried.push(model)
      modelText = await callGemini(prompt, model)
      await logGeneration(caseId, 'synthesis:modelRaw', { model }, { rawChars: modelText.length })
      parsed = extractJson(modelText)
      usedModel = model
      break
    } catch (e: any) {
      lastErr = e
      await logGeneration(caseId, 'synthesis:modelError', { model, message: e.message }, { rawSample: (modelText || '').slice(0, 300) })
    }
  }
  if (!parsed) {
    if (process.env.LOCAL_SYNTH_FALLBACK === '1') {
      const result = localHeuristicSynthesis(caseStudy, sources, { reason: 'model_error', tried, lastError: lastErr?.message })
      await persistResult(result)
      return result
    }
    throw new SynthesisError(`All model attempts failed: ${lastErr?.message || 'unknown'}`, 'model_error', { tried })
  }

  const narrative: string = typeof parsed?.narrative === 'string' ? parsed.narrative : (typeof parsed?.story === 'string' ? parsed.story : '')
  const questions: any[] = Array.isArray(parsed?.questions) ? parsed.questions : []
  if (!narrative) {
    await logGeneration(caseId, 'synthesis:validationFail', { reason: 'empty_narrative' })
    if (process.env.LOCAL_SYNTH_FALLBACK === '1') {
      const result = localHeuristicSynthesis(caseStudy, sources, { reason: 'empty_narrative', usedModel, tried })
      await persistResult(result)
      return result
    }
    throw new SynthesisError('Model produced empty narrative', 'empty_narrative', { usedModel, tried })
  }
  if (questions.length === 0) {
    await logGeneration(caseId, 'synthesis:validationFail', { reason: 'no_questions' })
    if (process.env.LOCAL_SYNTH_FALLBACK === '1') {
      const result = localHeuristicSynthesis(caseStudy, sources, { reason: 'no_questions', usedModel, tried })
      await persistResult(result)
      return result
    }
    throw new SynthesisError('Model produced no questions', 'no_questions', { usedModel, tried })
  }

  // Normalize quiz shape - exactly 5 questions are required
  const quiz = questions.slice(0, 12).map((q, idx) => {
    const opts = Array.isArray(q.options) ? q.options.slice(0, 4).map((o: any) => String(o).slice(0, 300)) : []
    const correct = typeof q.correctOptionIndex === 'number' && q.correctOptionIndex >= 0 && q.correctOptionIndex < opts.length ? q.correctOptionIndex : 0
    return {
      order: idx,
      prompt: String(q.prompt || q.question || '').slice(0, 800),
      options: opts,
      correctOptionIndex: correct,
      explanation: String(q.explanation || '').slice(0, 800),
      category: typeof q.category === 'string' ? q.category.slice(0, 40) : undefined,
      difficulty: typeof q.difficulty === 'string' ? q.difficulty.slice(0, 20) : undefined
    }
  }).filter(q => q.prompt && q.options.length === 4)

  // Validate that we have exactly 5 questions
  if (quiz.length !== 5) {
    await logGeneration(caseId, 'synthesis:validationFail', { reason: 'incorrect_question_count', expected: 5, actual: quiz.length })
    if (process.env.LOCAL_SYNTH_FALLBACK === '1') {
      const result = localHeuristicSynthesis(caseStudy, sources, { reason: 'incorrect_question_count', usedModel, tried, expected: 5, actual: quiz.length })
      await persistResult(result)
      return result
    }
    throw new SynthesisError(`Model must produce exactly 5 questions, but generated ${quiz.length}`, 'incorrect_question_count', { usedModel, tried, expected: 5, actual: quiz.length })
  }
  await logGeneration(caseId, 'synthesis:parsed', { qCount: questions.length }, { acceptedQuiz: quiz.length })

  // Extract first line as potential refined title (before newline)
  const firstLine = narrative.split(/\n+/).find(l => l.trim().length > 0)?.trim() || ''
  const refinedTitle = sanitizeRefinedTitle(firstLine.slice(0, 140), caseStudy.title)
  const slugBase = refinedTitle || caseStudy.title
  const baseSlug = slugify(slugBase).slice(0, 60)
  const result: SynthesisResult = { fullNarrative: narrative.slice(0, 12000), quiz, rawModelText: modelText, usedModel, mode: 'model' }

  // Persist; do quiz replace inside a single transaction with explicit steps for clearer failure surfaces
  try {
    await prisma.$transaction(async (tx) => {
      // Ensure slug uniqueness (fallback add -id if conflict)
      let slug = baseSlug
      if (slug) {
        const existing = await tx.caseStudy.findFirst({ where: { slug, NOT: { id: caseId } }, select: { id: true } })
        if (existing) slug = `${slug}-${caseId}`
      }
      await tx.caseStudy.update({ where: { id: caseId }, data: { fullNarrative: result.fullNarrative, challengeQuestion: quiz[0]?.prompt || 'N/A', explanation: quiz[0]?.explanation || 'N/A', refinedTitle: refinedTitle !== caseStudy.title ? refinedTitle : caseStudy.refinedTitle, slug: slug || caseStudy.slug } })
      await tx.quizQuestion.deleteMany({ where: { caseStudyId: caseId } })
      for (const q of quiz) {
        await tx.quizQuestion.create({ data: { caseStudyId: caseId, order: q.order, prompt: q.prompt, options: q.options as any, correctOptionIndex: q.correctOptionIndex, explanation: q.explanation, category: q.category, difficulty: q.difficulty } })
      }
    })
  } catch (e: any) {
    await logGeneration(caseId, 'synthesis:persistError', { message: e.message })
    if (process.env.LOCAL_SYNTH_FALLBACK === '1') {
      return { ...result, mode: 'local', diagnostics: { persistError: e.message } }
    }
    throw new SynthesisError(`Persistence error: ${e.message}`, 'persist_error')
  }

  return result
}

// ---------------- Local heuristic synthesis (non-placeholder) ----------------
function localHeuristicSynthesis(caseStudy: any, sources: SourceLike[], meta: Record<string, any>): SynthesisResult {
  const topic: string = caseStudy.companyName || caseStudy.title || 'Case'
  const fullSegments: string[] = []
  const seen = new Set<string>()
  for (const s of sources) {
    const raw: string = (s as any).extra?.full || s.snippet || ''
    if (!raw) continue
    for (const seg of raw.split(/(?<=[.!?])\s+/)) {
      const clean = seg.trim()
      if (clean.length < 40) continue
      const key = clean.slice(0, 90)
      if (seen.has(key)) continue
      seen.add(key)
      fullSegments.push(clean)
      if (fullSegments.length > 600) break
    }
    if (fullSegments.length > 600) break
  }
  const topicTokens = topic.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
  const relevant = fullSegments.filter(sentence => topicTokens.some(t => sentence.toLowerCase().includes(t)))
  const working = relevant.length ? relevant : fullSegments
  const compressed: string[] = []
  for (const sentence of working) {
    if (compressed.find(e => Math.abs(e.length - sentence.length) < 50 && e.includes(sentence.slice(0, 60)))) continue
    compressed.push(sentence)
  }
  // Provide a clean first line for refined title extraction; move disclaimer below
  const introTitle = `${topic} Case Study`
  const disclaimer = `(Heuristic auto-generated draft; may be less structured)`
  const intro = `${introTitle}\n\n${disclaimer}\n\n`
  const body = compressed.slice(0, 120).join(' ')
  const narrative = (intro + body).slice(0, 12000)
  const factLines = compressed.slice(0, 200)
  const joined = factLines.join(' ')
  const actors = Array.from(new Set(joined.match(/([A-Z][a-z]+\s+[A-Z][a-z]+)/g) || [])).slice(0, 10)
  const money = Array.from(new Set(joined.match(/₹\s?[0-9,.]+\s*(?:crore|billion|trillion)?/gi) || [])).slice(0, 6)
  const courts = factLines.filter(l => /court|tribunal|board|exchange/i.test(l)).slice(0, 8)
  const mechanism = factLines.filter(l => /manipulat|scheme|receipt|forward|loan|leverage|broker/i.test(l)).slice(0, 12)
  const impact = factLines.filter(l => /impact|exposed|loophole|regul|rule|reform|confidence/i.test(l)).slice(0, 10)
  function mcq(prompt: string, correct: string, distract: string[], category: string, difficulty: string) {
    const opts = [correct, ...distract.filter(d => d && d !== correct).slice(0, 6)]
    const uniq: string[] = []
    for (const o of opts) { const v = o.slice(0, 140); if (!uniq.includes(v)) uniq.push(v) }
    while (uniq.length < 4) uniq.push('Not Applicable ' + uniq.length)
    uniq.length = 4
    return {
      order: 0,
      prompt: prompt.slice(0, 800),
      options: uniq,
      correctOptionIndex: Math.max(0, uniq.indexOf(correct)),
      explanation: `Answer grounded in extracted facts: ${correct.slice(0, 100)}`,
      category,
      difficulty
    }
  }
  const quiz: any[] = []

  // Generate exactly 5 questions - this is mandatory
  const requiredQuestions = [
    { condition: () => mechanism.length > 0, question: 'What mechanism best explains how the scheme operated?', answer: mechanism[0], options: mechanism.slice(1, 5), category: 'mechanism', difficulty: 'hard' },
    { condition: () => money.length > 0, question: 'Which monetary magnitude is cited in relation to the case?', answer: money[0], options: money.slice(1, 5), category: 'impact', difficulty: 'medium' },
    { condition: () => actors.length >= 2, question: 'Which individual appears central among the named actors?', answer: actors[0], options: actors.slice(1, 5), category: 'actor', difficulty: 'medium' },
    { condition: () => courts.length > 0, question: 'Which institution features in enforcement or adjudication context?', answer: courts[0], options: courts.slice(1, 5), category: 'regulatory_response', difficulty: 'medium' },
    { condition: () => impact.length > 0, question: 'Which statement reflects a cited systemic impact or exposure?', answer: impact[0], options: impact.slice(1, 5), category: 'impact', difficulty: 'hard' }
  ]

  // Add fallback questions if we don't have enough data
  const fallbackQuestions = [
    { question: 'Primary topic focus?', answer: topic, options: actors.slice(0, 3), category: 'actor', difficulty: 'easy' },
    { question: 'Which element is LEAST related to the described modus operandi?', answer: 'Unrelated retail consumer loyalty program', options: mechanism.slice(0, 3), category: 'mechanism', difficulty: 'hard' },
    { question: 'What type of case study is this primarily classified as?', answer: 'Financial fraud case', options: ['Market manipulation', 'Insider trading', 'Corporate governance'], category: 'lesson', difficulty: 'easy' },
    { question: 'In what context would this case study be most relevant?', answer: 'Regulatory compliance training', options: ['Investment strategy', 'Marketing analysis', 'Product development'], category: 'lesson', difficulty: 'medium' },
    { question: 'What is the primary lesson from this case?', answer: 'Importance of regulatory oversight', options: ['Market efficiency', 'Product innovation', 'Customer satisfaction'], category: 'lesson', difficulty: 'medium' }
  ]

  // Try to use required questions first
  for (const qData of requiredQuestions) {
    if (quiz.length >= 5) break

    // Use the question if condition is met
    if (qData.condition()) {
      quiz.push(mcq(qData.question, qData.answer, qData.options, qData.category, qData.difficulty))
    }
  }

  // Add fallback questions if needed
  for (const qData of fallbackQuestions) {
    if (quiz.length >= 5) break
    quiz.push(mcq(qData.question, qData.answer, qData.options, qData.category, qData.difficulty))
  }

  // Ensure we always have exactly 5 questions by adding generic ones if needed
  while (quiz.length < 5) {
    const genericIndex = quiz.length
    quiz.push(mcq(
      `Question ${genericIndex + 1}: What aspect of this case is most relevant for analysis?`,
      'Regulatory compliance issues',
      ['Market timing', 'Product pricing', 'Customer demographics'],
      'lesson',
      'easy'
    ))
  }

  // Ensure exactly 5 questions
  quiz.length = 5
  quiz.forEach((q, i) => q.order = i)
  return { fullNarrative: narrative, quiz, mode: 'local', diagnostics: meta }
}
