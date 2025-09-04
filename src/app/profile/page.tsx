'use client';

import { useState } from 'react';
import {
    Mail,
    Phone,
    MapPin,
    Calendar,
    Trophy,
    Target,
    TrendingUp,
    BookOpen,
    Award,
    Edit3,
    Camera,
    Save,
    X
} from 'lucide-react';
import BottomBar from '@/components/BottomBar';

interface UserStats {
    totalCases: number;
    completedCases: number;
    currentStreak: number;
    totalPoints: number;
    rank: number;
    quizzesCompleted: number;
    averageScore: number;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    earned: boolean;
    earnedDate?: string;
}

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: 'Abhay Vishwakarma',
        email: 'abhay@example.com',
        phone: '+91 98765 43210',
        location: 'Mumbai, India',
        joinDate: 'January 2024',
        bio: 'Passionate about financial markets and continuous learning. Currently building expertise in stock market fundamentals and investment strategies.'
    });

    const [editedInfo, setEditedInfo] = useState(userInfo);

    const userStats: UserStats = {
        totalCases: 45,
        completedCases: 32,
        currentStreak: 7,
        totalPoints: 2450,
        rank: 12,
        quizzesCompleted: 18,
        averageScore: 87
    };

    const achievements: Achievement[] = [
        {
            id: '1',
            title: 'First Steps',
            description: 'Completed your first case study',
            icon: '🎯',
            earned: true,
            earnedDate: 'Jan 15, 2024'
        },
        {
            id: '2',
            title: 'Week Warrior',
            description: 'Maintained a 7-day learning streak',
            icon: '🔥',
            earned: true,
            earnedDate: 'Feb 2, 2024'
        },
        {
            id: '3',
            title: 'Quiz Master',
            description: 'Scored 90+ in 5 consecutive quizzes',
            icon: '🧠',
            earned: true,
            earnedDate: 'Feb 20, 2024'
        },
        {
            id: '4',
            title: 'Market Expert',
            description: 'Complete 50 case studies',
            icon: '📈',
            earned: false
        },
        {
            id: '5',
            title: 'Top Performer',
            description: 'Reach top 10 in leaderboard',
            icon: '👑',
            earned: false
        },
        {
            id: '6',
            title: 'Knowledge Seeker',
            description: 'Read 100+ financial articles',
            icon: '📚',
            earned: false
        }
    ];

    const handleSave = () => {
        setUserInfo(editedInfo);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedInfo(userInfo);
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32 sm:h-40"></div>
                    <div className="relative px-6 pb-6">
                        {/* Profile Picture */}
                        <div className="relative -mt-16 sm:-mt-20 mb-4">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold border-4 border-white shadow-lg">
                                AV
                                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors">
                                    <Camera className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="mb-4 sm:mb-0">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedInfo.name}
                                        onChange={(e) => setEditedInfo({ ...editedInfo, name: e.target.value })}
                                        className="text-2xl font-bold text-gray-900 border-b border-indigo-300 focus:outline-none focus:border-indigo-500 bg-transparent"
                                    />
                                ) : (
                                    <h1 className="text-2xl font-bold text-gray-900">{userInfo.name}</h1>
                                )}
                                <p className="text-gray-600 mt-1">Rank #{userStats.rank} • {userStats.totalPoints} points</p>
                            </div>

                            <div className="flex gap-2">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors flex items-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Personal Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Personal Information */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={editedInfo.email}
                                            onChange={(e) => setEditedInfo({ ...editedInfo, email: e.target.value })}
                                            className="flex-1 border-b border-gray-300 focus:outline-none focus:border-indigo-500 bg-transparent"
                                        />
                                    ) : (
                                        <span className="text-gray-700">{userInfo.email}</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={editedInfo.phone}
                                            onChange={(e) => setEditedInfo({ ...editedInfo, phone: e.target.value })}
                                            className="flex-1 border-b border-gray-300 focus:outline-none focus:border-indigo-500 bg-transparent"
                                        />
                                    ) : (
                                        <span className="text-gray-700">{userInfo.phone}</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedInfo.location}
                                            onChange={(e) => setEditedInfo({ ...editedInfo, location: e.target.value })}
                                            className="flex-1 border-b border-gray-300 focus:outline-none focus:border-indigo-500 bg-transparent"
                                        />
                                    ) : (
                                        <span className="text-gray-700">{userInfo.location}</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <span className="text-gray-700">Joined {userInfo.joinDate}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
                            {isEditing ? (
                                <textarea
                                    value={editedInfo.bio}
                                    onChange={(e) => setEditedInfo({ ...editedInfo, bio: e.target.value })}
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-indigo-500 resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            ) : (
                                <p className="text-gray-700 leading-relaxed">{userInfo.bio}</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Stats and Achievements */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                                <BookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-gray-900">{userStats.completedCases}</div>
                                <div className="text-sm text-gray-600">Cases Completed</div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                                <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-gray-900">{userStats.currentStreak}</div>
                                <div className="text-sm text-gray-600">Day Streak</div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                                <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-gray-900">{userStats.quizzesCompleted}</div>
                                <div className="text-sm text-gray-600">Quizzes Done</div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-gray-900">{userStats.averageScore}%</div>
                                <div className="text-sm text-gray-600">Avg Score</div>
                            </div>
                        </div>

                        {/* Progress Overview */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Case Studies</span>
                                        <span className="text-gray-900">{userStats.completedCases}/{userStats.totalCases}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${(userStats.completedCases / userStats.totalCases) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Quiz Performance</span>
                                        <span className="text-gray-900">{userStats.averageScore}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${userStats.averageScore}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {achievements.map((achievement) => (
                                    <div
                                        key={achievement.id}
                                        className={`p-4 border rounded-lg transition-all duration-200 ${achievement.earned
                                            ? 'border-green-200 bg-green-50'
                                            : 'border-gray-200 bg-gray-50 opacity-60'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="text-2xl">{achievement.icon}</div>
                                            <div className="flex-1">
                                                <h3 className={`font-medium ${achievement.earned ? 'text-green-900' : 'text-gray-600'}`}>
                                                    {achievement.title}
                                                </h3>
                                                <p className={`text-sm ${achievement.earned ? 'text-green-700' : 'text-gray-500'}`}>
                                                    {achievement.description}
                                                </p>
                                                {achievement.earned && achievement.earnedDate && (
                                                    <p className="text-xs text-green-600 mt-1">
                                                        Earned on {achievement.earnedDate}
                                                    </p>
                                                )}
                                            </div>
                                            {achievement.earned && (
                                                <Award className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <BottomBar />
        </div>
    );
}
