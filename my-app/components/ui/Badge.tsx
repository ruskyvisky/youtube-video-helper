import React from 'react';
import type { IdeaStatus } from '@/lib/types';

interface BadgeProps {
    status: IdeaStatus;
    className?: string;
}

const statusConfig = {
    raw: {
        label: 'Ham Fikir',
        bg: 'bg-purple-500/20',
        text: 'text-purple-300',
        border: 'border-purple-500/50'
    },
    researching: {
        label: 'Araştırılıyor',
        bg: 'bg-blue-500/20',
        text: 'text-blue-300',
        border: 'border-blue-500/50'
    },
    approved: {
        label: 'Onaylandı',
        bg: 'bg-green-500/20',
        text: 'text-green-300',
        border: 'border-green-500/50'
    }
};

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
    const config = statusConfig[status];

    return (
        <span
            className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
        ${config.bg} ${config.text} ${config.border} border
        ${className}
      `}
        >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {config.label}
        </span>
    );
};
