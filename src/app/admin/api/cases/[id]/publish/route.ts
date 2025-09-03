import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Ctx = { params: { id: string } } | { params: Promise<{ id: string }> }

export async function POST(_req: Request, ctx: Ctx) {
  const raw = (ctx.params as any)
  const resolved = typeof raw.then === 'function' ? await raw : raw
  const id = Number(resolved.id)
  if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  const caseStudy = await prisma.caseStudy.findUnique({ where: { id }, include: { quizQuestions: true } })
  if (!caseStudy) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!caseStudy.fullNarrative || caseStudy.quizQuestions.length === 0) {
    return NextResponse.json({ error: 'Cannot publish incomplete case' }, { status: 400 })
  }
  const updated = await prisma.caseStudy.update({ where: { id }, data: { status: 'PUBLISHED' } })
  return NextResponse.json({ ok: true, caseStudy: updated })
}
