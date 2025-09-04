'use client';

import { Trophy, Star, TrendingUp, Users, Flame, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import BottomBar from "@/components/BottomBar";

interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  totalScore: number;
  completedCases: number;
  streak: number;
  level: string;
  weeklyScore: number;
}

// Hardcoded leaderboard data
const leaderboardData: LeaderboardUser[] = [
  {
    rank: 1,
    id: '1',
    name: 'Raj Patel',
    avatar: '🧑‍💼',
    totalScore: 2850,
    completedCases: 45,
    streak: 12,
    level: 'Expert',
    weeklyScore: 320
  },
  {
    rank: 2,
    id: '2',
    name: 'Priya Sharma',
    avatar: '👩‍💻',
    totalScore: 2720,
    completedCases: 42,
    streak: 8,
    level: 'Expert',
    weeklyScore: 280
  },
  {
    rank: 3,
    id: '3',
    name: 'Arjun Singh',
    avatar: '👨‍🎓',
    totalScore: 2590,
    completedCases: 38,
    streak: 15,
    level: 'Advanced',
    weeklyScore: 250
  },
  {
    rank: 4,
    id: '4',
    name: 'Sneha Gupta',
    avatar: '👩‍💼',
    totalScore: 2340,
    completedCases: 35,
    streak: 5,
    level: 'Advanced',
    weeklyScore: 220
  },
  {
    rank: 5,
    id: '5',
    name: 'Vikram Reddy',
    avatar: '🧑‍🔬',
    totalScore: 2180,
    completedCases: 32,
    streak: 7,
    level: 'Advanced',
    weeklyScore: 190
  },
  {
    rank: 6,
    id: '6',
    name: 'Anjali Mehta',
    avatar: '👩‍🏫',
    totalScore: 1950,
    completedCases: 28,
    streak: 4,
    level: 'Intermediate',
    weeklyScore: 160
  },
  {
    rank: 7,
    id: '7',
    name: 'Rohit Kumar',
    avatar: '👨‍💻',
    totalScore: 1820,
    completedCases: 25,
    streak: 6,
    level: 'Intermediate',
    weeklyScore: 140
  },
  {
    rank: 8,
    id: '8',
    name: 'Kavya Nair',
    avatar: '👩‍🎨',
    totalScore: 1650,
    completedCases: 22,
    streak: 3,
    level: 'Intermediate',
    weeklyScore: 120
  }
];

export default function LeaderboardPage() {
  const topThree = leaderboardData.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-gray-600">Top performers in financial learning</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 text-center border">
            <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{leaderboardData.length}</div>
            <div className="text-sm text-gray-500">Players</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border">
            <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{leaderboardData[0]?.totalScore}</div>
            <div className="text-sm text-gray-500">Top Score</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border">
            <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{Math.max(...leaderboardData.map(u => u.streak))}</div>
            <div className="text-sm text-gray-500">Best Streak</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border">
            <Award className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{Math.max(...leaderboardData.map(u => u.completedCases))}</div>
            <div className="text-sm text-gray-500">Cases Solved</div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="bg-white rounded-2xl p-6 border">
          <h2 className="text-xl font-semibold text-center mb-6">🏆 Top Performers</h2>
          <div className="flex justify-center items-end space-x-4">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="bg-gray-100 rounded-xl p-4 mb-3 h-24 flex flex-col justify-end">
                <div className="text-3xl mb-2">{topThree[1]?.avatar}</div>
                <div className="text-4xl font-bold text-gray-400">2</div>
              </div>
              <div className="font-semibold text-sm">{topThree[1]?.name}</div>
              <div className="text-xs text-gray-500">{topThree[1]?.totalScore} pts</div>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="bg-yellow-100 rounded-xl p-4 mb-3 h-32 flex flex-col justify-end relative">
                <Trophy className="w-6 h-6 text-yellow-600 absolute top-2 right-2" />
                <div className="text-4xl mb-2">{topThree[0]?.avatar}</div>
                <div className="text-5xl font-bold text-yellow-600">1</div>
              </div>
              <div className="font-semibold">{topThree[0]?.name}</div>
              <div className="text-sm text-gray-500">{topThree[0]?.totalScore} pts</div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="bg-orange-100 rounded-xl p-4 mb-3 h-20 flex flex-col justify-end">
                <div className="text-3xl mb-2">{topThree[2]?.avatar}</div>
                <div className="text-4xl font-bold text-orange-600">3</div>
              </div>
              <div className="font-semibold text-sm">{topThree[2]?.name}</div>
              <div className="text-xs text-gray-500">{topThree[2]?.totalScore} pts</div>
            </div>
          </div>
        </div>

        {/* Full Leaderboard */}
        <div className="bg-white rounded-2xl border">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Full Rankings</h2>
          </div>

          <div className="space-y-1 p-4">
            {leaderboardData.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors ${index < 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''
                  }`}
              >
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${user.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                      user.rank === 2 ? 'bg-gray-100 text-gray-600' :
                        user.rank === 3 ? 'bg-orange-100 text-orange-600' :
                          'bg-gray-50 text-gray-500'
                    }`}>
                    {user.rank}
                  </div>

                  {/* Avatar & Info */}
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{user.avatar}</div>
                    <div>
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.level}</div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center hidden sm:block">
                    <div className="font-semibold text-gray-900">{user.totalScore}</div>
                    <div className="text-gray-500">Total</div>
                  </div>
                  <div className="text-center hidden md:block">
                    <div className="font-semibold text-gray-900">{user.completedCases}</div>
                    <div className="text-gray-500">Cases</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <Flame className="w-4 h-4 text-orange-500 mr-1" />
                      <span className="font-semibold text-gray-900">{user.streak}</span>
                    </div>
                    <div className="text-gray-500">Streak</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center mb-3">
              <Star className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-900">How to Earn Points</h3>
            </div>
            <p className="text-sm text-blue-800">
              Complete case studies (+50 pts), take quizzes (+25 pts), and maintain daily streaks for bonus multipliers.
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center mb-3">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-green-900">Weekly Updates</h3>
            </div>
            <p className="text-sm text-green-800">
              Rankings update in real-time. Keep learning daily to climb higher and earn special badges.
            </p>
          </div>
        </div>
      </div>

      <BottomBar />
    </div>
  );
}
