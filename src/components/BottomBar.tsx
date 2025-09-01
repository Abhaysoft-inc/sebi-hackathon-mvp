import Link from 'next/link';

const BottomBar = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white md:hidden shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-around py-1">
                <Link href="/" className="flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 hover:bg-blue-50 active:scale-95 group">
                    <div className="relative">
                        <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                        </svg>
                    </div>
                    <span className="text-xs mt-1 text-gray-600 group-hover:text-blue-600 transition-colors duration-200 font-medium">Home</span>
                </Link>
                <Link href="/feed" className="flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 hover:bg-blue-50 active:scale-95 group">
                    <div className="relative">
                        <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                    <span className="text-xs mt-1 text-gray-600 group-hover:text-blue-600 transition-colors duration-200 font-medium">Feed</span>
                </Link>
                <Link href="/search" className="flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 hover:bg-blue-50 active:scale-95 group">
                    <div className="relative">
                        <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                    <span className="text-xs mt-1 text-gray-600 group-hover:text-blue-600 transition-colors duration-200 font-medium">Search</span>
                </Link>
                <Link href="/profile" className="flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 hover:bg-blue-50 active:scale-95 group">
                    <div className="relative">
                        <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                        </svg>
                    </div>
                    <span className="text-xs mt-1 text-gray-600 group-hover:text-blue-600 transition-colors duration-200 font-medium">Profile</span>
                </Link>
            </div>
        </div>
    );
};

export default BottomBar;
