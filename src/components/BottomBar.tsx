import { HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { AiOutlineSearch, AiOutlineUser } from 'react-icons/ai';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';

const BottomBar = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white md:hidden shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-around py-1">
                {/* <Link href="/" className="flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 hover:bg-blue-50 active:scale-95 group">
                    <div className="relative">
                        <AiOutlineHome className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                    </div>
                    <span className="text-xs mt-1 text-gray-600 group-hover:text-blue-600 transition-colors duration-200 font-medium">Home</span>
                </Link> */}
                <Link href="/feed" className="flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 hover:bg-blue-50 active:scale-95 group">
                    <div className="relative">
                        <HiOutlineMenuAlt1 className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                    </div>
                    <span className="text-xs mt-1 text-gray-600 group-hover:text-blue-600 transition-colors duration-200 font-medium">Feed</span>
                </Link>
                <Link href="/cases" className="flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 hover:bg-blue-50 active:scale-95 group">
                    <div className="relative">
                        <AiOutlineSearch className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                    </div>
                    <span className="text-xs mt-1 text-gray-600 group-hover:text-blue-600 transition-colors duration-200 font-medium">Cases</span>
                </Link>

                <Link href="/quiz/ranked" className="flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 hover:bg-blue-50 active:scale-95 group">
                    <div className="relative">
                        <HelpCircle className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                    </div>
                    <span className="text-xs mt-1 text-gray-600 group-hover:text-blue-600 transition-colors duration-200 font-medium">Quiz</span>
                </Link>
                <Link href="/profile" className="flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 hover:bg-blue-50 active:scale-95 group">
                    <div className="relative">
                        <AiOutlineUser className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                    </div>
                    <span className="text-xs mt-1 text-gray-600 group-hover:text-blue-600 transition-colors duration-200 font-medium">Profile</span>
                </Link>
            </div>
        </div>
    );
};

export default BottomBar;
