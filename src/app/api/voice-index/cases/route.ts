import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Returns minimal CaseStudy list for voice command mapping
export async function GET() {
  try {
    const cases = await prisma.caseStudy.findMany({
      select: { id: true, title: true, refinedTitle: true, slug: true }
    })
    return NextResponse.json({ cases })
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to fetch case voice index', detail: e.message }, { status: 500 })
  }
}
