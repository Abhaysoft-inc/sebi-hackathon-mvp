'use client';

import Link from 'next/link';
import { useLoading } from '../contexts/LoadingContext';

interface LoadingLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const LoadingLink: React.FC<LoadingLinkProps> = ({
    href,
    children,
    className = '',
    onClick,
    ...props
}) => {
    const { setLoading } = useLoading();

    const handleClick = () => {
        // Start loading for navigation
        setLoading(true);

        // Call original onClick if provided
        if (onClick) {
            onClick();
        }
    };

    return (
        <Link
            href={href}
            className={className}
            onClick={handleClick}
            {...props}
        >
            {children}
        </Link>
    );
};
