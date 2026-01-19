import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hover = false,
    onClick
}) => {
    const baseStyles = 'glass rounded-xl p-6 shadow-md';
    const hoverStyles = hover ? 'glass-hover cursor-pointer' : '';

    return (
        <div
            className={`${baseStyles} ${hoverStyles} ${className} animate-fade-in`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
