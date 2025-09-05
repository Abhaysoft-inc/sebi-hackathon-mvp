import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Returns minimal IPO list for voice command mapping
export async function GET() {
  try {
    const ipos = await prisma.iPO.findMany({
      select: { id: true, companyName: true }
    })
    return NextResponse.json({ ipos })
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to fetch IPO voice index', detail: e.message }, { status: 500 })
  }
}
