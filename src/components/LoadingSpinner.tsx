'use client';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`} />
    );
};

export const PageLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
            <div className="text-center">
                {/* Main spinner */}
                <LoadingSpinner size="lg" className="mx-auto mb-4" />

                <p className="text-gray-700 text-sm font-medium">Loading...</p>
            </div>
        </div>
    );
};
