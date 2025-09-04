import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Params { id: string }

export async function GET(_req: Request, context: { params: Params }) {
  const idNum = Number(context.params.id)
  if (Number.isNaN(idNum)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }
  try {
  const ipo = await prisma.iPO.findUnique({ where: { id: idNum }, include: { opinions: true } })
    if (!ipo) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(ipo)
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to fetch IPO', detail: e.message }, { status: 500 })
  }
}