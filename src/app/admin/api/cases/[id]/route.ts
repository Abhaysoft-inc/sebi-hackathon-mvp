import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Ctx = { params: { id: string } } | { params: Promise<{ id: string }> }

export async function GET(_req: Request, ctx: Ctx) {
  const raw = (ctx.params as any)
  const resolved = typeof raw.then === 'function' ? await raw : raw
  const id = Number(resolved.id)
  if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  const caseStudy = await prisma.caseStudy.findUnique({ where: { id }, include: { quizQuestions: { orderBy: { order: 'asc' } } } })
  if (!caseStudy) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const response = {
    ...caseStudy,
    // Provide fallback for clients if fullNarrative not yet migrated/persisted
    fullNarrative: caseStudy.fullNarrative || caseStudy.narrative || null
  }
  return NextResponse.json({ ok: true, caseStudy: response })
}
