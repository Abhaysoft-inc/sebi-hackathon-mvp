import { useState } from 'react';
import { AISummary } from '../types/aiSummary';
import { Post as PostType } from '../types/post';
import { processAISummary } from '../services/aiSummaryService';

export const useAISummary = () => {
    const [showAISummary, setShowAISummary] = useState(false);
    const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleAIButtonClick = async (post: PostType) => {
        if (showAISummary) {
            setShowAISummary(false);
            return;
        }

        setIsGenerating(true);

        try {
            const summary = await processAISummary(post);
            setAiSummary(summary);
            setShowAISummary(true);
        } catch (error) {
            console.error('Error generating AI summary:', error);
            // Handle error state if needed
        } finally {
            setIsGenerating(false);
        }
    };

    const closeAISummary = () => {
        setShowAISummary(false);
    };

    return {
        showAISummary,
        aiSummary,
        isGenerating,
        handleAIButtonClick,
        closeAISummary
    };
};
