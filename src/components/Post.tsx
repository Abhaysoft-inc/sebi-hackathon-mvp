'use client';
import { useState } from 'react';
import { Post as PostType } from '../types/post';
import PostHeader from './PostHeader';
import PostImage from './PostImage';
import PostVideo from './PostVideo';
import PostArticle from './PostArticle';
import PostActions from './PostActions';
import PostContent from './PostContent';
import AISummaryPanel from './AISummaryPanel';
import AILoadingState from './AILoadingState';
import { useAISummary } from '../hooks/useAISummary';

interface PostProps {
    post: PostType;
}

const Post = ({ post }: PostProps) => {
    const [showTooltip, setShowTooltip] = useState<number | null>(null);
    const {
        showAISummary,
        aiSummary,
        isGenerating,
        handleAIButtonClick,
        closeAISummary
    } = useAISummary();

    const onAIClick = () => handleAIButtonClick(post);

    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden animate-fade-in">
            <PostHeader
                user={post.user}
                postId={post.id}
                showTooltip={showTooltip}
                setShowTooltip={setShowTooltip}
            />

            {/* Media Content */}
            {post.type === "image" && post.image && (
                <PostImage image={post.image} alt="post" />
            )}

            {(post.type === "short_video" || post.type === "long_video") && post.video && (
                <PostVideo
                    video={post.video}
                    thumbnail={post.thumbnail}
                    duration={post.duration}
                    type={post.type}
                    postId={post.id}
                />
            )}

            {post.type === "article" && (
                <PostArticle post={post} />
            )}

            <div className="p-4">
                {/* Only show action buttons for non-short videos */}
                {post.type !== "short_video" && (
                    <PostActions
                        likes={post.likes}
                        onAIClick={onAIClick}
                        isGeneratingAI={isGenerating}
                        showingAI={showAISummary}
                    />
                )}

                {/* AI Summary Section */}
                {showAISummary && aiSummary && (
                    <AISummaryPanel
                        aiSummary={aiSummary}
                        onClose={closeAISummary}
                    />
                )}

                {/* Loading State */}
                {isGenerating && <AILoadingState />}

                {/* Show caption and engagement for articles */}
                {post.type === "article" && (
                    <div className="mt-3">
                        <div className="text-sm text-gray-900 mb-3 leading-relaxed">
                            <span className="font-semibold">{post.user.name}</span>{' '}
                            <span className="text-gray-700">{post.caption}</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-900">{post.likes.toLocaleString()} likes</div>
                    </div>
                )}

                {/* Only show PostContent for non-article posts */}
                {post.type !== "article" && (
                    <PostContent
                        caption={post.caption}
                        likes={post.likes}
                        comments={post.comments}
                        user={post.user}
                    />
                )}
            </div>
            
            <div className="px-4 pb-3 pt-0 flex flex-wrap gap-2">
                {post.type === "article" && (
                    <span className="badge badge-blue">
                        Article
                    </span>
                )}
                {post.type === "image" && (
                    <span className="badge badge-green">
                        Financial News
                    </span>
                )}
                {post.type === "short_video" && (
                    <span className="badge badge-purple bg-purple-100 text-purple-800">
                        Short Video
                    </span>
                )}
                {post.type === "long_video" && (
                    <span className="badge badge-red">
                        Full Video
                    </span>
                )}
                {post.caption && post.caption.includes('#') && 
                    post.caption.split(' ').filter(word => word.startsWith('#')).slice(0, 2).map((tag, i) => (
                        <span key={i} className="badge badge-yellow">
                            {tag}
                        </span>
                    ))
                }
            </div>
        </div>
    );
};

export default Post;