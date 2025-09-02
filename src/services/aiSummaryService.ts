import { Post as PostType } from '../types/post';
import { AISummary } from '../types/aiSummary';

// Dummy AI summary data - In a real app, this would be an API call
export const generateAISummary = (post: PostType): AISummary => {
    const summaries: Record<number, AISummary> = {
        1: {
            title: "SEBI Powers Analysis",
            keyPoints: [
                "SEBI has extensive regulatory authority over Indian securities markets",
                "Key powers include investigation, enforcement, and policy making",
                "Recent focus on protecting retail investors and market integrity"
            ],
            sentiment: "Informative",
            riskLevel: "Low",
            actionItems: [
                "Understand SEBI regulations if you're investing",
                "Follow SEBI guidelines for compliance",
                "Stay updated with regulatory changes"
            ],
            confidence: 92
        },
        2: {
            title: "Trading Profit Analysis",
            keyPoints: [
                "Small but consistent profits indicate good risk management",
                "Zerodha platform showing positive portfolio performance",
                "Conservative trading approach evident from the screenshot"
            ],
            sentiment: "Positive",
            riskLevel: "Medium",
            actionItems: [
                "Continue with disciplined trading approach",
                "Consider diversifying portfolio for better risk management",
                "Monitor market trends for timing decisions"
            ],
            confidence: 87
        },
        3: {
            title: "Market Update Summary",
            keyPoints: [
                "Quick market insights shared in video format",
                "Focus on current financial trends and opportunities",
                "Educational content for retail investors"
            ],
            sentiment: "Bullish",
            riskLevel: "Medium",
            actionItems: [
                "Research mentioned stocks before investing",
                "Verify information from multiple sources",
                "Consider your risk tolerance before acting"
            ],
            confidence: 89
        }
    };

    return summaries[post.id as keyof typeof summaries] || {
        title: "Content Analysis",
        keyPoints: [
            "Financial content detected",
            "Market-related discussion identified",
            "Educational or informational nature"
        ],
        sentiment: "Neutral",
        riskLevel: "Low",
        actionItems: [
            "Review content carefully",
            "Cross-reference with reliable sources",
            "Consult financial advisor if needed"
        ],
        confidence: 75
    };
};

// Simulate AI processing with a delay
export const processAISummary = async (post: PostType): Promise<AISummary> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const summary = generateAISummary(post);
            resolve(summary);
        }, 1500); // 1.5 second delay to simulate API call
    });
};
