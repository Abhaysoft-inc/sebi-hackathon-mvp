import { Sparkles } from 'lucide-react';

interface AILoadingStateProps {
    className?: string;
}

const AILoadingState = ({ className = "" }: AILoadingStateProps) => {
    return (
        <div className={`mt-5 bg-purple-50 rounded-lg border border-purple-200 p-4 ${className} mb-5`}>
            <div className="flex items-center space-x-3">
                <div className="animate-spin">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                    <p className="text-sm font-medium text-blue-900">Generating AI Analysis...</p>
                    <p className="text-xs text-blue-500">Analyzing content and market context</p>
                </div>
            </div>
        </div>
    );
};

export default AILoadingState;
