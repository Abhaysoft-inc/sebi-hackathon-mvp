import { prisma } from '@/lib/prisma'
import CaseStudyDetail from '@/components/CaseStudyDetail'
import Link from 'next/link'

interface PublicCaseQuestion {
  prompt: string
  options: string[]
  correctOptionIndex: number
  explanation: string
}

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
  try {
    // Determine if numeric id or slug
    const idNum = Number(identifier)
    const isNumeric = !Number.isNaN(idNum)

    // Query using Prisma
    const caseStudy = await prisma.caseStudy.findFirst({
      where: isNumeric
        ? { id: idNum }
        : { slug: identifier },
      select: {
        id: true,
        title: true,
        refinedTitle: true,
        slug: true,
        narrative: true,
        fullNarrative: true,
        challengeQuestion: true,
        options: true,
        correctOptionIndex: true,
        explanation: true,
        status: true,
        quizQuestions: {
          select: {
            prompt: true,
            options: true,
            correctOptionIndex: true,
            explanation: true,
            order: true
          },
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!caseStudy) return null

    // Prefer refinedTitle then title
    const title = caseStudy.refinedTitle || caseStudy.title
    const narrative: string = caseStudy.fullNarrative || caseStudy.narrative || ''

    let options: string[] = []
    if (Array.isArray(caseStudy.options)) {
      options = caseStudy.options as string[]
    } else if (caseStudy.options && typeof caseStudy.options === 'object') {
      options = Object.values(caseStudy.options as object) as string[]
    }

    // Process quiz questions
    const quiz: PublicCaseQuestion[] = caseStudy.quizQuestions.map(q => ({
      prompt: q.prompt,
      options: Array.isArray(q.options)
        ? q.options as string[]
        : (typeof q.options === 'object' ? Object.values(q.options as object) as string[] : []),
      correctOptionIndex: q.correctOptionIndex || 0,
      explanation: q.explanation || ''
    })).filter(q => q.options.length === 4)

    let challengeQuestion = caseStudy.challengeQuestion
    let correctOptionIndex = caseStudy.correctOptionIndex
    let explanation = caseStudy.explanation
    let legacyOptions = options
    if (quiz.length) {
      // Use first quiz question for legacy-compatible surface while exposing full quiz array
      challengeQuestion = quiz[0].prompt
      legacyOptions = quiz[0].options
      correctOptionIndex = quiz[0].correctOptionIndex
      explanation = quiz[0].explanation
    }

    return {
      id: caseStudy.id,
      title,
      narrative,
      challengeQuestion: challengeQuestion || 'Answer the question below.',
      options: legacyOptions,
      correctOptionIndex: correctOptionIndex,
      explanation: explanation || '',
      quiz
    }
  } catch (error) {
    console.error('Error fetching case study:', error)
    return null
  }
}

interface PageProps { params: Promise<{ caseId: string }> }

export default async function CasePage({ params }: PageProps) {
  const { caseId } = await params
  const caseStudy = await getCaseStudy(caseId)
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
