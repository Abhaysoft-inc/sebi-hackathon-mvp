import { AiOutlineHeart, AiOutlineComment } from 'react-icons/ai';
import { BsBookmark } from 'react-icons/bs';
import { LuSparkles } from "react-icons/lu";

interface PostActionsProps {
    likes: number;
    onAIClick?: () => void;
    isGeneratingAI?: boolean;
    showingAI?: boolean;
}

const PostActions = ({ likes, onAIClick, isGeneratingAI = false, showingAI = false }: PostActionsProps) => {
    return (
        <div className="flex items-center gap-4 mb-3">
            <button className="flex items-center gap-2 group">
                <AiOutlineHeart className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition-colors duration-200" />
            </button>
            <button className="group">
                <AiOutlineComment className="w-6 h-6 text-gray-600 group-hover:text-blue-500 transition-colors duration-200" />
            </button>
            <button
                className={`group relative ${isGeneratingAI ? 'animate-pulse' : ''}`}
                onClick={onAIClick}
                disabled={isGeneratingAI}
            >
                <LuSparkles className={`cursor-pointer w-6 h-6 transition-colors duration-200 ${showingAI
                    ? 'text-purple-600'
                    : isGeneratingAI
                        ? 'text-purple-400'
                        : 'text-gray-600 group-hover:text-purple-500'
                    }`} />
                {isGeneratingAI && (
                    <div className="absolute -top-1 -right-1 w-3 h-3">
                        <div className="w-full h-full rounded-full bg-purple-500 animate-ping"></div>
                    </div>
                )}
            </button>
            <button className="group ml-auto">
                <BsBookmark className="w-6 h-6 text-gray-600 group-hover:text-yellow-500 transition-colors duration-200" />
            </button>
        </div>
    );
};

export default PostActions;
