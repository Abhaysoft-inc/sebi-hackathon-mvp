import { User } from '../types/post';
import VerificationBadge from './VerificationBadge';

interface PostHeaderProps {
    user: User;
    postId: number;
    showTooltip: number | null;
    setShowTooltip: (id: number | null) => void;
}

const PostHeader = ({ user, postId, showTooltip, setShowTooltip }: PostHeaderProps) => {
    return (
        <div className="flex items-center gap-3 p-4 border-b border-gray-50">
            <div className="relative">
                <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-100 object-cover"
                />
            </div>
            <div className="flex items-center gap-2 flex-1">
                <span className="font-semibold text-sm sm:text-base text-gray-900">{user.name}</span>
                {user.isVerified && (
                    <VerificationBadge
                        postId={postId}
                        showTooltip={showTooltip}
                        setShowTooltip={setShowTooltip}
                    />
                )}
            </div>
            <div className="text-xs text-gray-400">2h</div>
        </div>
    );
};

export default PostHeader;
