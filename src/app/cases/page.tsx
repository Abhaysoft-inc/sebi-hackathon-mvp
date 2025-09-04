import { prisma } from '@/lib/prisma'
import CaseLibrary from '@/components/CaseLibrary'
import BottomBar from '@/components/BottomBar'

interface CaseStudyData {
  id: number
  createdAt?: string
  slug: string | null
  title: string
  narrative: string
  challengeQuestion: string
  options: string[]
  correctOptionIndex: number | null
  explanation: string
  questionCount: number
}

async function getCaseStudies(): Promise<CaseStudyData[]> {
  try {
    const caseStudies = await prisma.caseStudy.findMany({
      select: {
        id: true,
        refinedTitle: true,
        title: true,
        fullNarrative: true,
        narrative: true,
        challengeQuestion: true,
        options: true,
        correctOptionIndex: true,
        explanation: true,
        slug: true,
        createdAt: true,
        quizQuestions: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return caseStudies.map(cs => ({
      id: cs.id,
      createdAt: cs.createdAt?.toISOString(),
      slug: cs.slug,
      title: cs.refinedTitle || cs.title,
      narrative: cs.fullNarrative || cs.narrative,
      challengeQuestion: cs.challengeQuestion,
      options: Array.isArray(cs.options) ? cs.options as string[] : (Object.values(cs.options as object) as string[]),
      correctOptionIndex: cs.correctOptionIndex,
      explanation: cs.explanation,
      questionCount: cs.quizQuestions.length
    }))
  } catch (error) {
    console.error('Error fetching case studies:', error)
    return []
  }
}

export default async function CasesPage() {
  const caseStudies = await getCaseStudies()

  // Filter to only show cases with questions (questionCount > 0)
  const casesWithQuestions = caseStudies.filter(caseStudy => caseStudy.questionCount > 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CaseLibrary caseStudies={casesWithQuestions} />
      </div>
      <BottomBar />
    </div>
  )
}
