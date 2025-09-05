import { Comment, User } from '../types/post';
import { forwardRef } from 'react';

interface PostContentProps {
    caption: string;
    likes: number;
    comments: Comment[];
    user: User;
}

const PostContent = forwardRef<HTMLInputElement, PostContentProps>(({ caption, likes, comments, user }, ref) => {
    return (
        <div>
            <div className="text-sm font-semibold text-gray-900 mb-2">{likes.toLocaleString()} likes</div>
            <div className="text-sm text-gray-900 mb-3">
                <span className="font-semibold">{user.name}</span> {caption}
            </div>

            {/* commnets section */}
            {/* <div className="text-sm space-y-1">
                {comments.map((c, idx) => (
                    <div key={idx} className="text-gray-700">
                        <span className="font-semibold">{c.user}</span> {c.text}
                    </div>
                ))}
            </div> */}
            <div className="mt-1 pt-1 border-t border-gray-50">
                <input
                    ref={ref}
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full text-sm text-gray-600 placeholder-gray-400 border-none outline-none bg-transparent"
                />
            </div>
        </div>
    );
});

PostContent.displayName = 'PostContent';

export default PostContent;
