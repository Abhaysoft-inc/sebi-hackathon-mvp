import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const ipos = await prisma.iPO.findMany({
      include: { opinions: true },
      orderBy: { issueOpenDate: 'asc' }
    })
    return NextResponse.json(ipos)
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to fetch IPOs', detail: e.message }, { status: 500 })
  }
}