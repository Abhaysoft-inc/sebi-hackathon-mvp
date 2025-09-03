import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { enrichCase, storeEnrichment, logGeneration } from '@/lib/enrichment'

// Open (unauthenticated) enrichment trigger per user request
export async function POST(_req: Request, ctx: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  // Next.js 15 may provide params as a Promise that must be awaited
  // Support both sync and async forms for forward compatibility
  const resolvedParams: { id: string } = typeof (ctx.params as any).then === 'function'
    ? await (ctx.params as Promise<{ id: string }>)
    : (ctx.params as { id: string })

  const idNum = Number(resolvedParams.id)
  if (Number.isNaN(idNum)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  let caseRecord: any
  try {
    caseRecord = await prisma.caseStudy.findUnique({ where: { id: idNum } })
  } catch (e) {
    return NextResponse.json({ error: 'Case lookup failed' }, { status: 500 })
  }
  if (!caseRecord) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await logGeneration(idNum, 'enrichment:start', { companyName: caseRecord.companyName, ticker: caseRecord.ticker })
  const started = Date.now()
  try {
    const topic = caseRecord.companyName || caseRecord.title
    const result = await enrichCase({
      companyName: topic,
      ticker: caseRecord.ticker || undefined,
      shortSummary: caseRecord.shortSummary || caseRecord.narrative,
      periodStart: caseRecord.periodStart ? new Date(caseRecord.periodStart) : null,
      periodEnd: caseRecord.periodEnd ? new Date(caseRecord.periodEnd) : null
    })
    await storeEnrichment(idNum, result.sources)
    await logGeneration(idNum, 'enrichment:complete', { durationMs: Date.now() - started }, { stats: result.stats, count: result.sources.length })
    return NextResponse.json({ ok: true, sources: result.sources, stats: result.stats })
  } catch (e: any) {
    await logGeneration(idNum, 'enrichment:error', undefined, undefined, e.message)
    return NextResponse.json({ error: 'Enrichment failed', details: e.message }, { status: 500 })
  }
}
