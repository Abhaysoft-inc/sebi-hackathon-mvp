import { Post } from '../types/post';

interface PostArticleProps {
    post: Post;
}

const PostArticle = ({ post }: PostArticleProps) => {
    const handleArticleClick = () => {
        if (post.articleLink) {
            window.open(post.articleLink, '_blank');
        }
    };

    return (
        <div
            className="border border-gray-200 rounded-xl p-4 mb-4 cursor-pointer hover:border-gray-300 transition-colors duration-200 bg-gradient-to-br from-blue-50 to-purple-50"
            onClick={handleArticleClick}
        >
            <div className="flex gap-4">
                {/* Article Image */}
                {post.articleImage && (
                    <div className="flex-shrink-0">
                        <img
                            src={post.articleImage}
                            alt={post.articleTitle}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover"
                        />
                    </div>
                )}

                {/* Article Content */}
                <div className="flex-1 min-w-0">
                    {/* Article Title */}
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-2 line-clamp-2 leading-tight">
                        {post.articleTitle}
                    </h3>

                    {/* Article Preview */}
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-3 leading-relaxed">
                        {post.articleContent}
                    </p>

                    {/* Read More Link */}
                    <div className="flex items-center text-blue-600 text-xs font-medium">
                        <span>Read full article</span>
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostArticle;
