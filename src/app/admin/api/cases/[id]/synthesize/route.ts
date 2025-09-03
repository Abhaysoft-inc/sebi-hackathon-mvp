import { NextResponse } from 'next/server'
import { synthesizeCase } from '@/lib/synthesis'
import { logGeneration } from '@/lib/enrichment'

export async function POST(_req: Request, ctx: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const resolvedParams: { id: string } = typeof (ctx.params as any).then === 'function'
    ? await (ctx.params as Promise<{ id: string }>)
    : (ctx.params as { id: string })
  const idNum = Number(resolvedParams.id)
  if (Number.isNaN(idNum)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  await logGeneration(idNum, 'synthesis:start')
  const started = Date.now()
  try {
  const result = await synthesizeCase(idNum)
  await logGeneration(idNum, 'synthesis:complete', { durationMs: Date.now() - started }, { quiz: result.quiz.length, narrativeChars: result.fullNarrative.length })
  return NextResponse.json({ ok: true, ...result })
  } catch (e: any) {
    const code = e?.code || 'synthesis_error'
    const meta = e?.meta || undefined
    await logGeneration(idNum, 'synthesis:error', { code, meta }, undefined, e.message)
    return NextResponse.json({ error: 'Synthesis failed', code, details: e.message, meta }, { status: 500 })
  }
}
