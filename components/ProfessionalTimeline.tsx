'use client';

import React, { useState, useRef } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import type { TimelineItem, TimelineTrack, Asset } from '@/lib/types';

interface ProfessionalTimelineProps {
    timelineItems: TimelineItem[];
    duration: number; // Total video duration in seconds
    onUpdateItems: (items: TimelineItem[]) => void;
    onUpdateDuration: (duration: number) => void;
    onAssetDrop?: (asset: Asset, track: TimelineTrack, time: number) => void;
}

export const ProfessionalTimeline: React.FC<ProfessionalTimelineProps> = ({
    timelineItems = [],
    duration = 60,
    onUpdateItems,
    onUpdateDuration,
    onAssetDrop
}) => {
    const [zoom, setZoom] = useState(1); // 1 = 100%
    const [playheadTime, setPlayheadTime] = useState(0);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; itemId: string } | null>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

    const tracks: { id: TimelineTrack; label: string; color: string }[] = [
        { id: 'video', label: '🎥 Video', color: '#ec4899' },
        { id: 'audio', label: '🎵 Audio', color: '#8b5cf6' },
        { id: 'overlay', label: '📝 Overlay', color: '#3b82f6' }
    ];

    // Calculate visible duration based on zoom
    const visibleDuration = duration / zoom;

    // Time marker intervals based on zoom
    const getTimeMarkerInterval = () => {
        if (zoom >= 3) return 1; // Every second
        if (zoom >= 1.5) return 5; // Every 5 seconds
        return 10; // Every 10 seconds
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.5, 4));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.5, 0.1));
    };

    const handleDeleteItem = (itemId: string) => {
        onUpdateItems(timelineItems.filter(item => item.id !== itemId));
        setContextMenu(null);
    };

    const handleDragOver = (e: React.DragEvent, track: TimelineTrack) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent, track: TimelineTrack) => {
        e.preventDefault();

        if (!timelineRef.current) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        const time = (relativeX / rect.width) * visibleDuration;
        const snappedTime = Math.round(time * 2) / 2; // Snap to 0.5s

        // Try to parse drag data
        try {
            const data = e.dataTransfer.getData('application/json');
            if (data) {
                const asset = JSON.parse(data) as Asset;
                if (onAssetDrop) {
                    onAssetDrop(asset, track, snappedTime);
                }
            }
        } catch (err) {
            console.error('Failed to parse drop data', err);
        }
    };

    const handleTimelineClick = (e: React.MouseEvent) => {
        if (!timelineRef.current) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        const time = (relativeX / rect.width) * visibleDuration;
        setPlayheadTime(Math.max(0, Math.min(time, duration)));
    };

    const handleContextMenu = (e: React.MouseEvent, itemId: string) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, itemId });
    };

    // Close context menu on outside click
    React.useEffect(() => {
        const handleClick = () => setContextMenu(null);
        if (contextMenu) {
            document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [contextMenu]);

    // Calculate time markers
    const timeMarkers: number[] = [];
    const interval = getTimeMarkerInterval();
    for (let t = 0; t <= visibleDuration; t += interval) {
        timeMarkers.push(t);
    }

    // Get items for a specific track
    const getTrackItems = (track: TimelineTrack) => {
        return timelineItems.filter(item => item.track === track);
    };

    const getItemColor = (item: TimelineItem) => {
        if (item.color) return item.color;
        switch (item.type) {
            case 'hook': return '#ec4899';
            case 'value': return '#6366f1';
            case 'cta': return '#10b981';
            default: return '#8b5cf6';
        }
    };

    return (
        <div className="space-y-4">
            {/* Header Controls */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold gradient-text">🎬 Professional Timeline</h2>
                    <p className="text-slate-400 mt-1">
                        Süre: {formatTime(duration)} • Zoom: {Math.round(zoom * 100)}%
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Zoom Controls */}
                    <div className="flex items-center gap-2 glass px-4 py-2 rounded-lg">
                        <button
                            onClick={handleZoomOut}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                            title="Zoom Out"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                            </svg>
                        </button>
                        <input
                            type="range"
                            min="0.1"
                            max="4"
                            step="0.1"
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-32"
                        />
                        <button
                            onClick={handleZoomIn}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                            title="Zoom In"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                        </button>
                    </div>

                    {/* Duration Control */}
                    <div className="glass px-4 py-2 rounded-lg">
                        <label className="text-xs text-slate-400 block mb-1">Süre (sn)</label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => onUpdateDuration(Number(e.target.value))}
                            className="w-20 bg-white/5 border border-white/10 text-white text-sm px-2 py-1 rounded outline-none focus:border-indigo-500"
                            min={10}
                            max={3600}
                        />
                    </div>
                </div>
            </div>

            {/* Timeline Container */}
            <Card>
                <div className="space-y-3">
                    {/* Time Ruler */}
                    <div className="relative h-8 border-b border-white/10">
                        <div className="absolute inset-0 flex">
                            {timeMarkers.map((time, idx) => {
                                const position = (time / visibleDuration) * 100;
                                return (
                                    <div
                                        key={idx}
                                        className="absolute top-0 bottom-0"
                                        style={{ left: `${position}%` }}
                                    >
                                        <div className="w-px h-2 bg-slate-600"></div>
                                        <span className="text-xs text-slate-500 ml-1">{formatTime(time)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Timeline Tracks */}
                    <div
                        ref={timelineRef}
                        className="relative"
                        onClick={handleTimelineClick}
                    >
                        {tracks.map((track, trackIdx) => (
                            <div
                                key={track.id}
                                className="relative h-20 border-b border-white/5 last:border-0"
                                onDragOver={(e) => handleDragOver(e, track.id)}
                                onDrop={(e) => handleDrop(e, track.id)}
                            >
                                {/* Track Label */}
                                <div className="absolute left-0 top-0 bottom-0 w-24 flex items-center px-3 bg-white/5 border-r border-white/10 z-10">
                                    <span className="text-sm font-medium text-white">{track.label}</span>
                                </div>

                                {/* Track Content Area */}
                                <div className="absolute left-24 right-0 top-0 bottom-0 bg-white/[0.02]">
                                    {/* Timeline Items on this track */}
                                    {getTrackItems(track.id).map((item) => {
                                        const startPercent = (item.startTime / visibleDuration) * 100;
                                        const widthPercent = (item.duration / visibleDuration) * 100;

                                        return (
                                            <div
                                                key={item.id}
                                                className="absolute top-2 bottom-2 rounded border-2 border-white/20 cursor-pointer hover:border-white/40 transition-all group overflow-hidden"
                                                style={{
                                                    left: `${startPercent}%`,
                                                    width: `${widthPercent}%`,
                                                    background: `linear-gradient(180deg, ${getItemColor(item)}80 0%, ${getItemColor(item)}40 100%)`
                                                }}
                                                onContextMenu={(e) => handleContextMenu(e, item.id)}
                                            >
                                                <div className="px-2 py-1 h-full flex flex-col justify-between">
                                                    <div className="text-xs font-semibold text-white truncate">
                                                        {item.label || item.type}
                                                    </div>
                                                    <div className="text-xs text-white/70">
                                                        {formatTime(item.startTime)} ({formatTime(item.duration)})
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* Playhead */}
                        <div
                            className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none z-20"
                            style={{ left: `calc(6rem + ${(playheadTime / visibleDuration) * 100}%)` }}
                        >
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rotate-45"></div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Context Menu */}
            {contextMenu && (
                <div
                    className="fixed glass rounded-lg py-1 shadow-2xl z-50 min-w-[150px]"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                >
                    <button
                        onClick={() => handleDeleteItem(contextMenu.itemId)}
                        className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Sil
                    </button>
                </div>
            )}

            {/* Tips */}
            <Card>
                <div className="text-sm text-slate-400 space-y-2">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Nasıl Kullanılır
                    </h4>
                    <ul className="ml-6 list-disc space-y-1">
                        <li>Sol panelden asset'leri sürükleyip istediğiniz track'e bırakın</li>
                        <li>Zoom kontrolü ile detaylı düzenleme yapın</li>
                        <li>Timeline'a tıklayarak playhead konumunu değiştirin</li>
                        <li>Sağ tıklayarak öğeleri silin</li>
                    </ul>
                </div>
            </Card>
        </div>
    );
};
