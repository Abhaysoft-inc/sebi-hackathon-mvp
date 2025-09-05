'use client';

import { Flame, User } from "lucide-react";
import { FaTrophy, FaCrown } from "react-icons/fa";
import BottomBar from "@/components/BottomBar";
import Image from "next/image";

interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatar?: string; // Optional image URL
  initials: string;
  avatarColor: string;
  totalScore: number;
  completedCases: number;
  streak: number;
  level: string;
  weeklyScore: number;
}

// Avatar component with fallback
const Avatar = ({ user, size = "md" }: { user: LeaderboardUser; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-lg"
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32
  };

  if (user.avatar) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white shadow-sm`}>
        <Image
          src={user.avatar}
          alt={user.name}
          width={iconSizes[size] * 2}
          height={iconSizes[size] * 2}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold text-white shadow-sm ${user.avatarColor}`}
    >
      {user.initials ? (
        <span>{user.initials}</span>
      ) : (
        <User size={iconSizes[size]} />
      )}
    </div>
  );
};

// Hardcoded leaderboard data
const leaderboardData: LeaderboardUser[] = [
  {
    rank: 1,
    id: '1',
    name: 'Raj Patel',
    avatar: 'https://i.pravatar.cc/250?u=1',
    initials: 'RP',
    avatarColor: 'bg-blue-500',
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
    avatar: 'https://i.pravatar.cc/250?u=2',
    initials: 'PS',
    avatarColor: 'bg-purple-500',
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
    avatar: 'https://i.pravatar.cc/250?u=3',
    initials: 'AS',
    avatarColor: 'bg-green-500',
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
    avatar: 'https://i.pravatar.cc/250?u=4',
    initials: 'SG',
    avatarColor: 'bg-pink-500',
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
    avatar: 'https://i.pravatar.cc/250?u=5',
    initials: 'VR',
    avatarColor: 'bg-indigo-500',
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
    avatar: 'https://i.pravatar.cc/250?u=6',
    initials: 'AM',
    avatarColor: 'bg-yellow-500',
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
    avatar: 'https://i.pravatar.cc/250?u=7',
    initials: 'RK',
    avatarColor: 'bg-red-500',
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
    avatar: 'https://i.pravatar.cc/250?u=8',
    initials: 'KN',
    avatarColor: 'bg-teal-500',
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

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        {/* <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-gray-600">Top performers in financial learning</p>
        </div> */}

        {/* Stats Row */}


        {/* Top 3 Podium */}
        <div className="bg-white rounded-2xl p-6 border">
          <h2 className="text-xl font-semibold text-center mb-6 flex items-center justify-center gap-2">
            <FaTrophy className="text-yellow-600" />
            Top Performers
          </h2>
          <div className="flex justify-center items-end space-x-4">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="bg-gray-100 rounded-xl p-4 mb-3 h-36 flex flex-col justify-center items-center">
                <Avatar user={topThree[1]} size="lg" />
                <div className="text-4xl font-bold text-gray-400 mt-2">2</div>
              </div>
              <div className="font-semibold text-sm">{topThree[1]?.name}</div>
              <div className="text-xs text-gray-500">{topThree[1]?.totalScore} pts</div>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="bg-yellow-100 rounded-xl p-4 mb-3 h-40 flex flex-col justify-center items-center relative">
                <FaCrown className="w-6 h-6 text-yellow-600 absolute top-2 right-2" />
                <Avatar user={topThree[0]} size="lg" />
                <div className="text-5xl font-bold text-yellow-600 mt-2">1</div>
              </div>
              <div className="font-semibold">{topThree[0]?.name}</div>
              <div className="text-sm text-gray-500">{topThree[0]?.totalScore} pts</div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="bg-orange-100 rounded-xl p-4 mb-3 h-32 flex flex-col justify-center items-center">
                <Avatar user={topThree[2]} size="md" />
                <div className="text-4xl font-bold text-orange-600 mt-1">3</div>
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
                    <Avatar user={user} size="sm" />
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


      </div>

      <BottomBar />
    </div>
  );
}
