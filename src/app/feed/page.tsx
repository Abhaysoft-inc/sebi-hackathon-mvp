'use client';
import Post from '../../components/Post';
import { mockPosts } from '../../data/mockPosts';
import BottomBar from "../../components/BottomBar";
import { useScrollToTop } from '@/hooks/useScrollToTop';

const HomepageFeed = () => {
    // Scroll to top when component mounts
    useScrollToTop();
    return (
        <>
            <div className="max-w-xl mx-auto py-4 px-4 sm:py-8 sm:px-0 min-h-screen bg-gray-50 ">

                <div className="flex flex-col gap-4 sm:gap-8">
                    {mockPosts.map((post) => (
                        <Post key={post.id} post={post} />
                    ))}
                </div>
            </div>

            <BottomBar />

        </>

    );
};

export default HomepageFeed;
