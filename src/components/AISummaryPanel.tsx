import { X, Sparkles, Target, Lightbulb } from 'lucide-react';
import { AISummary } from '../types/aiSummary';
import { getSentimentColor, getRiskColor } from '../utils/aiSummaryUtils';

interface AISummaryPanelProps {
    aiSummary: AISummary;
    onClose: () => void;
    className?: string;
}

const AISummaryPanel = ({ aiSummary, onClose, className = "" }: AISummaryPanelProps) => {
    return (
        <div className={`mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 overflow-hidden ${className} mb-5`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Sparkles className="h-5 w-5" />
                        <h3 className="font-semibold">AI Summary</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition-colors"
                        aria-label="Close AI Analysis"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Summary Header */}
                <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">{aiSummary.title}</h4>
                    <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(aiSummary.sentiment)}`}>
                            {aiSummary.sentiment}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(aiSummary.riskLevel)}`}>
                            {aiSummary.riskLevel} Risk
                        </span>
                    </div>
                </div>

                {/* Key Points */}
                <div>
                    <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-1" />
                        Key Insights
                    </h5>
                    <ul className="space-y-1">
                        {aiSummary.keyPoints.map((point, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-700">
                                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Action Items */}
                <div>
                    <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        Recommended Actions
                    </h5>
                    <ul className="space-y-1">
                        {aiSummary.actionItems.map((action, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-700">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {action}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Confidence Score */}
                {/* <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">AI Confidence</span>
                        <span className="text-sm font-semibold text-gray-900">{aiSummary.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${aiSummary.confidence}%` }}
                        ></div>
                    </div>
                </div> */}

                {/* Disclaimer */}
                <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
                    AI-generated analysis. Please verify information and consult financial advisors for investment decisions.
                </div>
            </div>
        </div>
    );
};

export default AISummaryPanel;
