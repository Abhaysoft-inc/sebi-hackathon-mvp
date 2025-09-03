import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, ctx: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const resolvedParams: { id: string } = typeof (ctx.params as any).then === 'function'
    ? await (ctx.params as Promise<{ id: string }>)
    : (ctx.params as { id: string })
  const idNum = Number(resolvedParams.id)
  if (Number.isNaN(idNum)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  try {
    const logs = await prisma.caseGenerationLog.findMany({ where: { caseStudyId: idNum }, orderBy: { id: 'asc' } })
    return NextResponse.json({ ok: true, logs })
  } catch (e:any) {
    return NextResponse.json({ error: 'Failed to fetch logs', details: e.message }, { status: 500 })
  }
}
