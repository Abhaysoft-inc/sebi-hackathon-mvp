export interface AISummary {
    title: string;
    keyPoints: string[];
    sentiment: string;
    riskLevel: string;
    actionItems: string[];
    confidence: number;
}

export type SentimentType = 'positive' | 'negative' | 'neutral' | 'informative' | 'bullish' | 'bearish';
export type RiskLevel = 'low' | 'medium' | 'high';
