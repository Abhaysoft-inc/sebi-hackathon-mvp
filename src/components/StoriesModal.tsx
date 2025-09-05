'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface StoryCard {
    id: number;
    title: string;
    content: string;
    category: string;
    bgColor: string;
    image: string;
}

interface StoriesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const dailyKnowledge: StoryCard[] = [
    {
        id: 1,
        title: "What is a Stock?",
        content: "A stock represents ownership in a company. When you buy shares, you become a partial owner and can benefit from the company's growth through price appreciation and dividends.",
        category: "Basics",
        bgColor: "bg-blue-600",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=200&fit=crop"
    },
    {
        id: 2,
        title: "Bull vs Bear Market",
        content: "Bull Market: Prices are rising, investor confidence is high. Bear Market: Prices are falling by 20% or more, pessimism prevails. Understanding these cycles helps time your investments.",
        category: "Market Trends",
        bgColor: "bg-green-600",
        image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=200&h=200&fit=crop"
    },
    {
        id: 3,
        title: "P/E Ratio Explained",
        content: "Price-to-Earnings ratio shows how much investors pay for each rupee of earnings. Lower P/E might indicate undervaluation, higher P/E might suggest growth expectations.",
        category: "Valuation",
        bgColor: "bg-orange-600",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=200&fit=crop"
    },
    {
        id: 4,
        title: "Diversification",
        content: "Don't put all eggs in one basket! Spread investments across different sectors, companies, and asset classes to reduce risk while maintaining growth potential.",
        category: "Risk Management",
        bgColor: "bg-purple-600",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop"
    },
    {
        id: 5,
        title: "Market Cap Categories",
        content: "Large Cap: Stable, established companies. Mid Cap: Growing companies with moderate risk. Small Cap: High growth potential but higher volatility.",
        category: "Company Size",
        bgColor: "bg-teal-600",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop"
    },
    {
        id: 6,
        title: "Dividend Yield",
        content: "Annual dividend per share divided by stock price. Higher yield provides regular income but might indicate slower growth. Balance between income and growth based on your goals.",
        category: "Income Investing",
        bgColor: "bg-indigo-600",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=200&h=200&fit=crop"
    }
];

export function StoriesModal({ isOpen, onClose }: StoriesModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isOpen) return;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    // Auto advance to next story
                    if (currentIndex < dailyKnowledge.length - 1) {
                        setCurrentIndex(currentIndex + 1);
                        return 0;
                    } else {
                        // Close modal when all stories are viewed - use setTimeout to avoid setState during render
                        setTimeout(() => {
                            onClose();
                        }, 0);
                        return 100; // Keep progress at 100% until modal closes
                    }
                }
                return prev + 1;
            });
        }, 50); // 5 seconds per story (100 * 50ms)

        return () => clearInterval(timer);
    }, [isOpen, currentIndex, onClose]);

    useEffect(() => {
        setProgress(0);
    }, [currentIndex]);

    const goToNext = useCallback(() => {
        if (currentIndex < dailyKnowledge.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // Use setTimeout to avoid setState during render
            setTimeout(() => {
                onClose();
            }, 0);
        }
    }, [currentIndex, onClose]);

    const goToPrevious = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    }, [currentIndex]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') goToPrevious();
            if (e.key === 'ArrowRight') goToNext();
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyPress);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, goToPrevious, goToNext, onClose]);

    if (!isOpen) return null;

    const currentStory = dailyKnowledge[currentIndex];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-center justify-center p-4">
            {/* Progress bars */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
                {dailyKnowledge.map((_, index) => (
                    <div key={index} className="w-12 sm:w-16 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                            style={{
                                width: index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%'
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-colors"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Navigation buttons */}
            {currentIndex > 0 && (
                <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            )}

            {currentIndex < dailyKnowledge.length - 1 && (
                <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-colors"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            )}

            {/* Story card */}
            <div
                className={`relative w-full max-w-sm mx-auto h-[75vh] max-h-[600px] ${currentStory.bgColor} rounded-2xl shadow-2xl flex flex-col justify-between p-6 sm:p-8 text-white`}
                onClick={goToNext}
            >
                {/* Category tag */}
                <div className="absolute top-6 left-6">
                    <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium backdrop-blur-sm">
                        {currentStory.category}
                    </span>
                </div>

                {/* Image */}
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white border-opacity-50 shadow-lg relative">
                        <Image
                            src={currentStory.image}
                            alt={currentStory.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center text-center">
                    <h2 className="text-2xl font-bold mb-6">
                        {currentStory.title}
                    </h2>
                    <p className="text-lg leading-relaxed opacity-90">
                        {currentStory.content}
                    </p>
                </div>

                {/* Story counter */}
                <div className="text-center text-sm opacity-75">
                    {currentIndex + 1} of {dailyKnowledge.length}
                </div>

                {/* Tap areas for navigation */}
                <div className="absolute inset-0 flex">
                    <div
                        className="w-1/3 h-full cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            goToPrevious();
                        }}
                    />
                    <div
                        className="w-2/3 h-full cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            goToNext();
                        }}
                    />
                </div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-75 text-center">
                <p>Tap to continue • Use arrow keys • ESC to close</p>
            </div>
        </div>
    );
}
