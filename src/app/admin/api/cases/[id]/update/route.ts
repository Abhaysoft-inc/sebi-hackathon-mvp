import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface QuizEdit { id?: number; order: number; prompt: string; options: string[]; correctOptionIndex: number; explanation: string; category?: string; difficulty?: string }

type Ctx = { params: { id: string } } | { params: Promise<{ id: string }> }

export async function POST(req: Request, ctx: Ctx) {
  const raw = (ctx.params as any)
  const resolved = typeof raw.then === 'function' ? await raw : raw
  const id = Number(resolved.id)
  if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  const body = await req.json()
  const { refinedTitle, fullNarrative, quiz }: { refinedTitle?: string; fullNarrative?: string; quiz?: QuizEdit[] } = body
  const cs = await prisma.caseStudy.findUnique({ where: { id } })
  if (!cs) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  try {
    const updated = await prisma.$transaction(async tx => {
      await tx.caseStudy.update({ where: { id }, data: { refinedTitle: refinedTitle?.slice(0,200) || cs.refinedTitle, fullNarrative: fullNarrative?.slice(0,12000) || cs.fullNarrative } })
      if (Array.isArray(quiz)) {
        await tx.quizQuestion.deleteMany({ where: { caseStudyId: id } })
        for (const q of quiz) {
          if (!q.prompt || !Array.isArray(q.options) || q.options.length !== 4) continue
          await tx.quizQuestion.create({ data: { caseStudyId: id, order: q.order, prompt: q.prompt.slice(0,800), options: q.options, correctOptionIndex: q.correctOptionIndex ?? 0, explanation: q.explanation?.slice(0,800) || '', category: q.category?.slice(0,40), difficulty: q.difficulty?.slice(0,20) } })
        }
      }
      return tx.caseStudy.findUnique({ where: { id }, include: { quizQuestions: { orderBy: { order: 'asc' } } } })
    })
    return NextResponse.json({ ok: true, caseStudy: updated })
  } catch (e: any) {
    return NextResponse.json({ error: 'Update failed', details: e.message }, { status: 500 })
  }
}
