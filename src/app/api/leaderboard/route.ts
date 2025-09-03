import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const topUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        totalScore: true,
        progress: {
          where: {
            completed: true
          },
          select: {
            id: true
          }
        }
      },
      orderBy: {
        totalScore: 'desc'
      },
      take: 10
    })

    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      name: user.name || user.email || 'Anonymous',
      totalScore: user.totalScore,
      completedCases: user.progress.length
    }))

    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    )
  }
}
