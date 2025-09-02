import { Post } from '../types/post';
import { Clock, ExternalLink, Calendar, TrendingUp } from 'lucide-react';
import Image from 'next/image';

interface PostArticleProps {
    post: Post;
}

const PostArticle = ({ post }: PostArticleProps) => {
    const handleArticleClick = () => {
        if (post.articleLink) {
            window.open(post.articleLink, '_blank');
        }
    };

    // Estimate reading time based on content length
    const estimateReadingTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.split(' ').length;
        const time = Math.ceil(words / wordsPerMinute);
        return time;
    };

    const readingTime = estimateReadingTime(post.articleContent || '');

    return (
        <article className="group bg-white overflow-hidden cursor-pointer" onClick={handleArticleClick}>
            {/* Featured Image */}
            {post.articleImage && (
                <div className="relative overflow-hidden">
                    <Image
                        src={post.articleImage}
                        alt={post.articleTitle || 'Article image'}
                        width={600}
                        height={240}
                        className="w-full h-52 sm:h-60 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent"></div>

                    {/* Article Type Badge */}
                    <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-lg backdrop-blur-sm">
                            <TrendingUp className="w-3 h-3 mr-1.5" />
                            Breaking News
                        </span>
                    </div>

                    {/* Reading Time Badge */}
                    <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-black/30 text-white backdrop-blur-sm">
                            <Clock className="w-3 h-3 mr-1" />
                            {readingTime} min
                        </span>
                    </div>

                    {/* Hover overlay with CTA */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold text-gray-900 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
                            <span>Read full article</span>
                            <ExternalLink className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            )}

            {/* Article Content */}
            <div className="p-6">
                {/* Author/Source Info at top */}
                <div className="flex items-center gap-3 mb-4">
                    <Image
                        src={post.user.avatar}
                        alt={post.user.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
                    />
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-gray-900">{post.user.name}</p>
                            {post.user.isVerified && (
                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>News Publisher</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>2 hours ago</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Article Title */}
                <h2 className="font-bold text-xl sm:text-2xl text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors duration-200">
                    {post.articleTitle}
                </h2>

                {/* Article Preview */}
                <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {post.articleContent}
                </p>
            </div>
        </article>
    );
};

export default PostArticle;
