'use client';
import Post from '../../components/Post';
import { mockPosts } from '../../data/mockPosts';
import Navbar from "../..//components/Navbar";
import BottomBar from "../../components/BottomBar";
const HomepageFeed = () => {
    return (
        <>
            <Navbar />
            <div className="max-w-xl mx-auto py-4 px-4 sm:py-8 sm:px-0 min-h-screen bg-gray-50 md:bg-white">

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
