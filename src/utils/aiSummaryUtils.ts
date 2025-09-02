export const getSentimentColor = (sentiment: string): string => {
    switch (sentiment.toLowerCase()) {
        case 'positive':
        case 'bullish':
            return 'text-green-600 bg-green-100';
        case 'negative':
        case 'bearish':
            return 'text-red-600 bg-red-100';
        case 'neutral':
        case 'informative':
            return 'text-blue-600 bg-blue-100';
        default:
            return 'text-gray-600 bg-gray-100';
    }
};

export const getRiskColor = (risk: string): string => {
    switch (risk.toLowerCase()) {
        case 'low':
            return 'text-green-600 bg-green-100';
        case 'medium':
            return 'text-yellow-600 bg-yellow-100';
        case 'high':
            return 'text-red-600 bg-red-100';
        default:
            return 'text-gray-600 bg-gray-100';
    }
};
