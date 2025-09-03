import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// Open (unauthenticated) endpoint per user request
export async function POST(req: Request) {

  try {
    const body = await req.json()
    const { companyName, ticker, periodStart, periodEnd, shortSummary, seedTitle } = body

    if (!(companyName || seedTitle) || !shortSummary) {
      return NextResponse.json({ error: 'Provide a title (companyName or seedTitle) and shortSummary' }, { status: 400 })
    }

    // Support non-company topics (e.g., "Harshad Mehta Scam") by normalizing to companyName for search reuse
    const normalizedCompany = companyName || seedTitle

    let caseStudy
    try {
      caseStudy = await prisma.caseStudy.create({
        data: {
          title: seedTitle || normalizedCompany,
          narrative: shortSummary,
          challengeQuestion: 'Pending generation',
          explanation: 'Pending generation',
          options: [],
          correctOptionIndex: 0,
          companyName: normalizedCompany,
          ticker,
          periodStart: periodStart ? new Date(periodStart) : null,
          periodEnd: periodEnd ? new Date(periodEnd) : null,
          shortSummary,
          status: 'DRAFT'
        }
      })
      return NextResponse.json({ ok: true, caseStudy, storage: 'database' })
    } catch (err: any) {
      if (err.code === 'P1001') {
        // In-memory fallback so user can proceed while DB is unreachable.
        const g = globalThis as any
        if (!g.__inMemoryCases) {
          g.__inMemoryCases = []
          g.__inMemoryCaseSeq = 1
        }
        caseStudy = {
          id: g.__inMemoryCaseSeq++,
            title: seedTitle || normalizedCompany,
            narrative: shortSummary,
            challengeQuestion: 'Pending generation',
            explanation: 'Pending generation',
            options: [],
            correctOptionIndex: 0,
            createdAt: new Date(),
            companyName: normalizedCompany,
            ticker: ticker || null,
            periodStart: periodStart ? new Date(periodStart) : null,
            periodEnd: periodEnd ? new Date(periodEnd) : null,
            shortSummary,
            fullNarrative: null,
            sources: null,
            status: 'DRAFT'
        }
        g.__inMemoryCases.push(caseStudy)
        return NextResponse.json({ ok: true, caseStudy, storage: 'in-memory', warning: 'Database unreachable (P1001). Persisting only in memory until DB connectivity is restored.' }, { status: 202 })
      }
      throw err
    }
  } catch (e: any) {
    if (e.code === 'P1001') {
      return NextResponse.json({ error: 'Database unreachable (P1001)', hint: 'Verify DATABASE_URL, network access, Neon project not suspended, and that you are not blocked by IPv6-only connectivity. Try removing channel_binding param and ensure sslmode=require is present.' }, { status: 503 })
    }
    console.error('Create case error', e)
    return NextResponse.json({ error: 'Internal error', details: e.message }, { status: 500 })
  }
}
