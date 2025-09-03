import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const caseStudies = await prisma.caseStudy.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json({ caseStudies })
  } catch (error) {
    console.error('Error fetching case studies:', error)
    return NextResponse.json(
      { error: "Failed to fetch case studies" },
      { status: 500 }
    )
  }
}
