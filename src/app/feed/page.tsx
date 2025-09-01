'use client';
import Post from '../../components/Post';
import { mockPosts } from '../../data/mockPosts';

const HomepageFeed = () => {
    return (
        <div className="max-w-xl mx-auto py-4 px-4 sm:py-8 sm:px-0 min-h-screen">

            <div className="flex flex-col gap-4 sm:gap-8">
                {mockPosts.map((post) => (
                    <Post key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default HomepageFeed;
