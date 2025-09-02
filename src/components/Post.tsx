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
        <div className="bg-white border border-gray-100 rounded-lg shadow-md hover:shadow-md transition-shadow duration-300">
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
                <div className="px-4 pt-2">
                    <PostArticle post={post} />
                </div>
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

                <PostContent
                    caption={post.caption}
                    likes={post.likes}
                    comments={post.comments}
                    user={post.user}
                />
            </div>
        </div>
    );
};

export default Post;