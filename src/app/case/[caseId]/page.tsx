import { Pool } from 'pg'
import CaseStudyDetail from '@/components/CaseStudyDetail'
import Link from 'next/link'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

interface PublicCaseQuestion { prompt: string; options: string[]; correctOptionIndex: number; explanation: string }
interface PublicCase {
  id: number
  title: string
  narrative: string
  // Legacy single-question fallback fields
  challengeQuestion: string
  options: string[]
  correctOptionIndex: number | null
  explanation: string
  quiz?: PublicCaseQuestion[]
}

async function getCaseStudy(identifier: string): Promise<PublicCase | null> {
  // Determine if numeric id or slug
  const idNum = Number(identifier)
  const isNumeric = !Number.isNaN(idNum)
  try {
    const whereClause = isNumeric ? 'id = $1' : 'slug = $1'
    const res = await pool.query(
      `SELECT id, title, "refinedTitle", slug, narrative, "fullNarrative", "challengeQuestion", options, "correctOptionIndex", explanation FROM "CaseStudy" WHERE ${whereClause} AND status = 'PUBLISHED' LIMIT 1`,
      [identifier]
    )
    if (res.rows.length === 0) return null
    const row = res.rows[0]
    // Prefer refinedTitle then title
    const title = row.refinedTitle || row.title
    const narrative: string = row.fullNarrative || row.narrative || ''
    let options: string[] = []
    if (Array.isArray(row.options)) options = row.options
    else if (row.options && typeof row.options === 'object') options = Object.values(row.options)
    // If legacy single-question fields are empty, pull first quiz question
    // Fetch all quiz questions
    const quizRes = await pool.query(`SELECT prompt, options, "correctOptionIndex", explanation FROM "QuizQuestion" WHERE "caseStudyId" = $1 ORDER BY "order" ASC`, [row.id])
    const quiz: PublicCaseQuestion[] = quizRes.rows.map(r => ({
      prompt: r.prompt,
      options: Array.isArray(r.options) ? r.options : (typeof r.options === 'object' ? Object.values(r.options) : []),
      correctOptionIndex: r.correctOptionIndex,
      explanation: r.explanation
    })).filter(q => q.options.length === 4)
    let challengeQuestion = row.challengeQuestion
    let correctOptionIndex = row.correctOptionIndex
    let explanation = row.explanation
    let legacyOptions = options
    if (quiz.length) {
      // Use first quiz question for legacy-compatible surface while exposing full quiz array
      challengeQuestion = quiz[0].prompt
      legacyOptions = quiz[0].options
      correctOptionIndex = quiz[0].correctOptionIndex
      explanation = quiz[0].explanation
    }
    return {
      id: row.id,
      title,
      narrative,
      challengeQuestion: challengeQuestion || 'Answer the question below.',
      options: legacyOptions,
      correctOptionIndex: correctOptionIndex,
      explanation: explanation || '',
      quiz
    }
  } catch (e) {
    // swallow for now; could log
  }
  return null
}

interface PageProps { params: { caseId: string } }

export default async function CasePage({ params }: PageProps) {
  const caseStudy = await getCaseStudy(params.caseId)
  if (!caseStudy) {
    return (
      <div className="max-w-3xl mx-auto py-20">
        <div className="panel panel-spacious text-center space-y-6">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Case Not Found</h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto">This case is unavailable or may have been unpublished.</p>
          <Link href="/cases" className="btn-xs btn-primary-xs py-2 px-4 text-sm font-semibold">Back to Cases</Link>
        </div>
      </div>
    )
  }
  return (
    <div className="max-w-4xl mx-auto py-10">
      <CaseStudyDetail caseStudy={caseStudy} />
    </div>
  )
}
