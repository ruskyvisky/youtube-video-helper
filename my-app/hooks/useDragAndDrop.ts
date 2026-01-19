'use client';

import { useState } from 'react';
import type { TimelineItem, Asset } from '@/lib/types';

interface DragState {
    isDragging: boolean;
    draggedItem: Asset | TimelineItem | null;
    dragType: 'asset' | 'timeline-item' | null;
}

export function useDragAndDrop() {
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        draggedItem: null,
        dragType: null
    });

    const handleDragStart = (item: Asset | TimelineItem, type: 'asset' | 'timeline-item') => {
        setDragState({
            isDragging: true,
            draggedItem: item,
            dragType: type
        });
    };

    const handleDragEnd = () => {
        setDragState({
            isDragging: false,
            draggedItem: null,
            dragType: null
        });
    };

    // Calculate drop position on timeline based on mouse position and zoom
    const calculateDropTime = (
        clientX: number,
        timelineRect: DOMRect,
        zoom: number,
        duration: number
    ): number => {
        const relativeX = clientX - timelineRect.left;
        const timelineWidth = timelineRect.width;
        const visibleDuration = duration / zoom;
        const time = (relativeX / timelineWidth) * visibleDuration;

        // Snap to 0.5 second intervals
        return Math.round(time * 2) / 2;
    };

    return {
        dragState,
        handleDragStart,
        handleDragEnd,
        calculateDropTime
    };
}
