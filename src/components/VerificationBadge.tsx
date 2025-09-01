'use client';
import { useState } from 'react';

interface VerificationBadgeProps {
    postId: number;
    showTooltip: number | null;
    setShowTooltip: (id: number | null) => void;
}

const VerificationBadge = ({ postId, showTooltip, setShowTooltip }: VerificationBadgeProps) => {
    return (
        <div className="relative">
            <svg
                className="w-5 h-5 text-blue-500 drop-shadow-sm cursor-pointer"
                fill="currentColor"
                viewBox="0 0 20 20"
                onClick={() => setShowTooltip(showTooltip === postId ? null : postId)}
            >
                <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                />
            </svg>

            {/* Desktop tooltip - hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg hidden sm:block">
                Verified Influencer by SEBI
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>

            {/* Mobile tooltip - click */}
            {showTooltip === postId && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap sm:hidden z-10">
                    Verified Influencer by SEBI
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
            )}
        </div>
    );
};

export default VerificationBadge;
