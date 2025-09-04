'use client';

import React, { useState } from 'react';
import { Clock, Users, Trophy, Calendar, Play, Star, TrendingUp, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BottomBar from '@/components/BottomBar';

interface Quiz {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    duration: number; // in minutes
    participants: number;
    maxParticipants: number;
    prizePool: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    topics: string[];
    status: 'upcoming' | 'ongoing' | 'completed';
    timeRemaining?: string;
}

const QuizCard: React.FC<{ quiz: Quiz }> = ({ quiz }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'ongoing': return 'bg-green-100 text-green-800 border-green-200';
            case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Beginner': return 'bg-green-100 text-green-700';
            case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
            case 'Advanced': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(quiz.status)}`}>
                        {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                        {quiz.difficulty}
                    </span>
                </div>
                <Trophy className="w-5 h-5 text-yellow-500" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>

            <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{quiz.startTime} - {quiz.endTime}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{quiz.duration} minutes</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{quiz.participants}/{quiz.maxParticipants} participants</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-2" />
                    <span>Prize Pool: {quiz.prizePool}</span>
                </div>
            </div>

            <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Topics:</p>
                <div className="flex flex-wrap gap-1">
                    {quiz.topics.map((topic, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {topic}
                        </span>
                    ))}
                </div>
            </div>

            {quiz.timeRemaining && quiz.status === 'upcoming' && (
                <div className="mb-4 p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center text-sm text-blue-700">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        <span>Starts in: {quiz.timeRemaining}</span>
                    </div>
                </div>
            )}

            <button
                className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center space-x-2 ${quiz.status === 'ongoing'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : quiz.status === 'upcoming'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                disabled={quiz.status === 'completed'}
            >
                <Play className="w-4 h-4" />
                <span>
                    {quiz.status === 'ongoing' ? 'Join Now' :
                        quiz.status === 'upcoming' ? 'Register' : 'Completed'}
                </span>
            </button>
        </div>
    );
};

const RankedQuizPage = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'ongoing'>('all');

    const quizzes: Quiz[] = [
        {
            id: '1',
            title: 'NSE Trading Fundamentals',
            description: 'Test your knowledge of NSE trading, order types, and market mechanics.',
            startTime: 'Dec 5, 2:00 PM',
            endTime: '3:30 PM',
            duration: 90,
            participants: 234,
            maxParticipants: 500,
            prizePool: '₹50,000',
            difficulty: 'Beginner',
            topics: ['NSE', 'Trading', 'Order Types', 'Market Hours'],
            status: 'upcoming',
            timeRemaining: '2 hours 15 minutes'
        },
        {
            id: '2',
            title: 'Technical Analysis Masters',
            description: 'Advanced technical analysis patterns, indicators, and trading strategies.',
            startTime: 'Dec 5, 11:00 AM',
            endTime: '12:00 PM',
            duration: 60,
            participants: 189,
            maxParticipants: 300,
            prizePool: '₹75,000',
            difficulty: 'Advanced',
            topics: ['Technical Analysis', 'Chart Patterns', 'Indicators', 'Support & Resistance'],
            status: 'ongoing',
        },
        {
            id: '3',
            title: 'Mutual Funds & SIP Strategy',
            description: 'Comprehensive quiz on mutual funds, SIP, and long-term wealth creation.',
            startTime: 'Dec 6, 10:00 AM',
            endTime: '11:30 AM',
            duration: 90,
            participants: 67,
            maxParticipants: 400,
            prizePool: '₹30,000',
            difficulty: 'Intermediate',
            topics: ['Mutual Funds', 'SIP', 'Asset Allocation', 'Risk Management'],
            status: 'upcoming',
            timeRemaining: '1 day 18 hours'
        },
        {
            id: '4',
            title: 'IPO & Primary Market',
            description: 'Everything about IPOs, rights issues, and primary market investments.',
            startTime: 'Dec 6, 3:00 PM',
            endTime: '4:15 PM',
            duration: 75,
            participants: 156,
            maxParticipants: 350,
            prizePool: '₹40,000',
            difficulty: 'Intermediate',
            topics: ['IPO', 'Primary Market', 'Listing', 'Grey Market'],
            status: 'upcoming',
            timeRemaining: '1 day 21 hours'
        },
        {
            id: '5',
            title: 'Derivatives & F&O Trading',
            description: 'Options, futures, and derivatives trading strategies for the Indian market.',
            startTime: 'Dec 7, 1:00 PM',
            endTime: '2:30 PM',
            duration: 90,
            participants: 89,
            maxParticipants: 250,
            prizePool: '₹1,00,000',
            difficulty: 'Advanced',
            topics: ['Options', 'Futures', 'Derivatives', 'Hedging', 'Greeks'],
            status: 'upcoming',
            timeRemaining: '2 days 19 hours'
        }
    ];

    const filteredQuizzes = quizzes.filter(quiz => {
        if (activeTab === 'all') return true;
        return quiz.status === activeTab;
    });

    const stats = {
        totalQuizzes: quizzes.length,
        activeParticipants: quizzes.reduce((sum, quiz) => sum + quiz.participants, 0),
        totalPrizePool: '₹2,95,000',
        ongoingQuizzes: quizzes.filter(q => q.status === 'ongoing').length
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            {/* Header */}
            {/* <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                </div>
            </div> */}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8 max-w-md mx-auto">
                    {[
                        { key: 'all' as const, label: 'All Quizzes' },
                        { key: 'ongoing' as const, label: 'Live Now' },
                        { key: 'upcoming' as const, label: 'Upcoming' }
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === tab.key
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Ongoing Quiz Alert */}
                {quizzes.some(q => q.status === 'ongoing') && (
                    <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                            <span className="text-green-800 font-medium">
                                {quizzes.filter(q => q.status === 'ongoing').length} quiz(es) are live now! Join before they end.
                            </span>
                        </div>
                    </div>
                )}

                {/* Quiz Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQuizzes.map((quiz) => (
                        <QuizCard key={quiz.id} quiz={quiz} />
                    ))}
                </div>

                {filteredQuizzes.length === 0 && (
                    <div className="text-center py-12">
                        <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
                        <p className="text-gray-600">Check back later for new quiz competitions!</p>
                    </div>
                )}
            </div>

            <BottomBar />
        </div>
    );
};

export default RankedQuizPage;