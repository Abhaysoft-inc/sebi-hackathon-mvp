import { Pool } from 'pg'
import CaseStudyCard from '@/components/CaseStudyCard'
import Link from 'next/link'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function getCaseStudies() {
  try {
    const res = await pool.query(`
      SELECT id, COALESCE("refinedTitle", title) AS title, COALESCE("fullNarrative", narrative) AS narrative,
        "challengeQuestion", options, "correctOptionIndex", explanation, slug, "createdAt"
      FROM "CaseStudy"
      ORDER BY "createdAt" DESC
    `)
    return res.rows.map((row: any) => ({
      id: row.id,
      createdAt: row.createdAt,
      slug: row.slug,
      title: row.title,
      narrative: row.narrative,
      challengeQuestion: row.challengeQuestion,
      options: Array.isArray(row.options) ? row.options : (Object.values(row.options) as string[]),
      correctOptionIndex: row.correctOptionIndex,
      explanation: row.explanation
    }))
  } catch (e) {
    return []
  }
}

export default async function CasesPage() {
  const caseStudies = await getCaseStudies()

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-3">
        <h1 className="heading-page">Case Library</h1>
        <p className="muted max-w-2xl">Investigative scenarios and structured analytical exercises. Each case includes a narrative and quiz prompts to test detection and reasoning skills.</p>
      </header>

      <div className="toolbar">
        <span className="text-gray-500">Sort:</span>
        <button className="btn-xs bg-gray-900 text-white">Newest</button>
        <button className="btn-xs text-gray-600 hover:text-gray-900">Oldest</button>
        <span className="ml-4 h-4 w-px bg-gray-200" />
        <span className="text-gray-500">Filter:</span>
        <button className="btn-xs text-gray-600 hover:text-gray-900">All</button>
        <button className="btn-xs text-gray-600 hover:text-gray-900">Fraud</button>
        <button className="btn-xs text-gray-600 hover:text-gray-900">Market</button>
        <span className="ml-auto text-gray-400">{caseStudies.length} total</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {caseStudies.length > 0 ? (
          caseStudies.map(cs => (
            <CaseStudyCard key={cs.id} caseStudy={cs} />
          ))
        ) : (
          <div className="col-span-full rounded-lg border border-dashed border-gray-300 p-16 text-center">
            <p className="text-gray-500">No cases yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
