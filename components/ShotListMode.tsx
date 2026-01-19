'use client';

import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import type { ShotListItem, TimelineSection, ShotType } from '@/lib/types';

interface ShotListModeProps {
    timelineSections: TimelineSection[];
    shotList: ShotListItem[];
    onUpdateShotList: (shotList: ShotListItem[]) => void;
}

export const ShotListMode: React.FC<ShotListModeProps> = ({
    timelineSections,
    shotList,
    onUpdateShotList
}) => {
    const [sortBy, setSortBy] = useState<'timeline' | 'type'>('timeline');

    // Generate shot list from timeline if empty
    const generateFromTimeline = () => {
        const newShots: ShotListItem[] = timelineSections.map((section, idx) => ({
            id: crypto.randomUUID(),
            title: `${section.type.toUpperCase()} - ${section.notes || 'No notes'}`,
            shotType: 'talking-head' as ShotType, // Default, user can change
            timelineSectionId: undefined,
            duration: section.endTime - section.startTime,
            notes: section.notes,
            completed: false,
            order: idx
        }));

        onUpdateShotList(newShots);
    };

    const toggleCompleted = (id: string) => {
        onUpdateShotList(
            shotList.map(shot =>
                shot.id === id ? { ...shot, completed: !shot.completed } : shot
            )
        );
    };

    const updateShotType = (id: string, shotType: ShotType) => {
        onUpdateShotList(
            shotList.map(shot =>
                shot.id === id ? { ...shot, shotType } : shot
            )
        );
    };

    const deletShot = (id: string) => {
        onUpdateShotList(shotList.filter(shot => shot.id !== id));
    };

    const getShotTypeIcon = (type: ShotType) => {
        switch (type) {
            case 'talking-head': return '🎤';
            case 'b-roll': return '🎬';
            case 'screen-recording': return '🖥️';
        }
    };

    const getShotTypeLabel = (type: ShotType) => {
        switch (type) {
            case 'talking-head': return 'Talking Head';
            case 'b-roll': return 'B-Roll';
            case 'screen-recording': return 'Screen Recording';
        }
    };

    const sortedShots = [...shotList].sort((a, b) => {
        if (sortBy === 'timeline') {
            return a.order - b.order;
        } else {
            return a.shotType.localeCompare(b.shotType);
        }
    });

    const completedCount = shotList.filter(s => s.completed).length;
    const totalCount = shotList.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-3xl font-bold gradient-text">📋 Çekim Listesi</h2>
                    <Button variant="ghost" onClick={() => window.print()}>
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Yazdır
                    </Button>
                </div>
                <p className="text-slate-400">
                    Kamera karşısında çekilecek sahnelerin listesi. Tamamlananları işaretle!
                </p>
            </div>

            {/* Progress */}
            <Card className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">İlerleme</h3>
                    <span className="text-2xl font-bold text-indigo-400">
                        {completedCount}/{totalCount}
                    </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-sm text-slate-400 mt-2">
                    {progress.toFixed(0)}% tamamlandı
                </p>
            </Card>

            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                    <button
                        onClick={() => setSortBy('timeline')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === 'timeline'
                                ? 'bg-indigo-500 text-white'
                                : 'glass text-slate-400 hover:text-white'
                            }`}
                    >
                        Timeline Sırası
                    </button>
                    <button
                        onClick={() => setSortBy('type')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === 'type'
                                ? 'bg-indigo-500 text-white'
                                : 'glass text-slate-400 hover:text-white'
                            }`}
                    >
                        Çekim Tipine Göre
                    </button>
                </div>

                {shotList.length === 0 && (
                    <Button variant="primary" onClick={generateFromTimeline}>
                        Timeline'dan Oluştur
                    </Button>
                )}
            </div>

            {/* Shot List */}
            {shotList.length === 0 ? (
                <Card>
                    <div className="text-center py-12 text-slate-500">
                        <div className="text-6xl mb-4">📋</div>
                        <p className="text-lg">Henüz çekim listesi yok</p>
                        <p className="text-sm mt-2">Timeline'dan otomatik olarak oluşturabilirsiniz</p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-3">
                    {sortedShots.map((shot, idx) => (
                        <Card
                            key={shot.id}
                            className={`transition-all ${shot.completed ? 'opacity-60 bg-green-500/5 border-green-500/20' : ''}`}
                        >
                            <div className="flex items-start gap-4">
                                {/* Checkbox */}
                                <button
                                    onClick={() => toggleCompleted(shot.id)}
                                    className={`flex-shrink-0 w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center ${shot.completed
                                            ? 'bg-green-500 border-green-500'
                                            : 'border-white/30 hover:border-indigo-500'
                                        }`}
                                >
                                    {shot.completed && (
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className={`text-xl font-bold ${shot.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                                            {idx + 1}. {shot.title}
                                        </h3>
                                        <button
                                            onClick={() => deletShot(shot.id)}
                                            className="text-slate-400 hover:text-red-400 transition-colors ml-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Shot Type Selector */}
                                    <div className="flex gap-2 mb-3 flex-wrap">
                                        {(['talking-head', 'b-roll', 'screen-recording'] as ShotType[]).map(type => (
                                            <button
                                                key={type}
                                                onClick={() => updateShotType(shot.id, type)}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${shot.shotType === type
                                                        ? 'bg-indigo-500 text-white'
                                                        : 'glass text-slate-400 hover:text-white'
                                                    }`}
                                            >
                                                {getShotTypeIcon(type)} {getShotTypeLabel(type)}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Duration */}
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-slate-400">
                                            ⏱️ {Math.floor(shot.duration / 60)}:{String(Math.round(shot.duration % 60)).padStart(2, '0')}
                                        </span>
                                    </div>

                                    {/* Notes */}
                                    {shot.notes && (
                                        <p className="text-sm text-slate-400 mt-2 p-3 glass rounded-lg">
                                            {shot.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Print Styles */}
            <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .shot-list-print, .shot-list-print * {
            visibility: visible;
          }
          .shot-list-print {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
        </div>
    );
};
