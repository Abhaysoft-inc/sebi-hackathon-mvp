import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { caseStudyId, answerIndex } = await request.json()

    if (!caseStudyId || typeof answerIndex !== 'number') {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      )
    }

    try {
      // Get the case study details using Prisma
      const caseStudy = await prisma.caseStudy.findUnique({
        where: { id: parseInt(caseStudyId) },
        select: {
          id: true,
          correctOptionIndex: true,
          explanation: true,
          options: true
        }
      })

      if (!caseStudy) {
        return NextResponse.json(
          { error: "Case study not found" },
          { status: 404 }
        )
      }

      const isCorrect = answerIndex === caseStudy.correctOptionIndex
      const pointsEarned = isCorrect ? 10 : 0

      // Process options array properly
      const options = Array.isArray(caseStudy.options)
        ? caseStudy.options as string[]
        : Object.values(caseStudy.options as object) as string[]

      return NextResponse.json({
        isCorrect,
        explanation: caseStudy.explanation,
        pointsEarned,
        correctAnswer: {
          index: caseStudy.correctOptionIndex,
          text: options[caseStudy.correctOptionIndex || 0]
        }
      })
    } catch (dbError) {
      console.error('Database error:', dbError);

      // Fallback for demo purposes if database query fails
      const mockCases: Record<string, any> = {
        '1': {
          correctOptionIndex: 0,
          explanation: 'Enron created complex SPVs to move liabilities off its official balance sheet, making the company appear far more profitable and stable than it actually was. This was a massive accounting fraud.',
          options: [
            'Using special purpose vehicles (SPVs)',
            'Bribing auditors to ignore the debt',
            'Converting debt to equity secretly',
            'Moving operations offshore'
          ]
        },
        '2': {
          correctOptionIndex: 1,
          explanation: 'Despite the company\'s claims, its proprietary "Edison" machines could not perform the vast majority of the tests advertised. The company was secretly using commercially available, third-party machines to run tests.',
          options: [
            'Stealing technology from competitors',
            'The technology never actually worked as advertised',
            'Using unqualified technicians',
            'Overcharging for simple tests'
          ]
        },
        '3': {
          correctOptionIndex: 1,
          explanation: 'Madoff was running the largest Ponzi scheme in history. He used new investor money to pay fake "returns" to existing investors, creating the illusion of legitimate profits.',
          options: [
            'Insider trading ring',
            'Ponzi scheme',
            'Money laundering operation',
            'High-frequency trading manipulation'
          ]
        }
      };

      const mockCase = mockCases[caseStudyId.toString()];
      if (mockCase) {
        const isCorrect = answerIndex === mockCase.correctOptionIndex;
        const pointsEarned = isCorrect ? 10 : 0;

        return NextResponse.json({
          isCorrect,
          explanation: mockCase.explanation,
          pointsEarned,
          correctAnswer: {
            index: mockCase.correctOptionIndex,
            text: mockCase.options[mockCase.correctOptionIndex]
          }
        });
      }

      return NextResponse.json(
        { error: "Case study not found" },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error submitting answer:', error)
    return NextResponse.json(
      { error: "Failed to submit answer" },
      { status: 500 }
    )
  }
}
