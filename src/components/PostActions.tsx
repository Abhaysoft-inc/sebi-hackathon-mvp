import { AiOutlineHeart, AiOutlineComment } from 'react-icons/ai';
import { BsBookmark, BsLightbulb } from 'react-icons/bs';
import { LuSparkles } from "react-icons/lu";
interface PostActionsProps {
    likes: number;
}

const PostActions = ({ likes }: PostActionsProps) => {
    return (
        <div className="flex items-center gap-4 mb-3">
            <button className="flex items-center gap-2 group">
                <AiOutlineHeart className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition-colors duration-200" />
            </button>
            <button className="group">
                <AiOutlineComment className="w-6 h-6 text-gray-600 group-hover:text-blue-500 transition-colors duration-200" />
            </button>
            <button
                className="group"
                onClick={() => {

                    console.log('AI button clicked');
                }}
            >
                <LuSparkles className="w-6 h-6 text-gray-600 group-hover:text-purple-500 transition-colors duration-200" />
            </button>
            <button className="group ml-auto">
                <BsBookmark className="w-6 h-6 text-gray-600 group-hover:text-yellow-500 transition-colors duration-200" />
            </button>
        </div>
    );
};

export default PostActions;
