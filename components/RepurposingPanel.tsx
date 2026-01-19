'use client';

import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import type { RepurposingClip, TimelineSection, RepurposingPlatform } from '@/lib/types';
import { PLATFORM_SPECS } from '@/lib/types';

interface RepurposingPanelProps {
    timelineSections: TimelineSection[];
    repurposingClips: RepurposingClip[];
    onAddClip: (clip: Omit<RepurposingClip, 'id' | 'createdAt'>) => void;
    onUpdateClip: (clip: RepurposingClip) => void;
    onDeleteClip: (id: string) => void;
}

export const RepurposingPanel: React.FC<RepurposingPanelProps> = ({
    timelineSections,
    repurposingClips,
    onAddClip,
    onUpdateClip,
    onDeleteClip
}) => {
    const [isCreating, setIsCreating] = useState(false);
    const [selectedSection, setSelectedSection] = useState<TimelineSection | null>(null);
    const [selectedPlatforms, setSelectedPlatforms] = useState<RepurposingPlatform[]>([]);
    const [customTitle, setCustomTitle] = useState('');
    const [notes, setNotes] = useState('');

    const handleCreateClip = () => {
        if (!selectedSection) return;

        onAddClip({
            timelineSectionId: selectedSection ? undefined : undefined, // Will use start/end time instead
            startTime: selectedSection.startTime,
            endTime: selectedSection.endTime,
            platforms: selectedPlatforms,
            customTitle: customTitle || undefined,
            notes: notes || undefined,
            status: 'planned'
        });

        // Reset form
        setSelectedSection(null);
        setSelectedPlatforms([]);
        setCustomTitle('');
        setNotes('');
        setIsCreating(false);
    };

    const togglePlatform = (platform: RepurposingPlatform) => {
        setSelectedPlatforms(prev =>
            prev.includes(platform)
                ? prev.filter(p => p !== platform)
                : [...prev, platform]
        );
    };

    const getDuration = (clip: RepurposingClip) => clip.endTime - clip.startTime;

    const getStatusColor = (status: RepurposingClip['status']) => {
        switch (status) {
            case 'planned': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'exported': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'published': return 'bg-green-500/20 text-green-300 border-green-500/30';
        }
    };

    const getPlatformIcon = (platform: RepurposingPlatform) => {
        switch (platform) {
            case 'shorts': return '📺';
            case 'tiktok': return '🎵';
            case 'reel': return '📸';
            case 'twitter': return '🐦';
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold gradient-text mb-2">♻️ İçerik Yeniden Amaçlandırma</h2>
                <p className="text-slate-400">
                    Uzun videonun hangi bölümlerini Shorts, TikTok, Reel veya Twitter için kullanacağını planla
                </p>
            </div>

            {/* Create New Clip */}
            {!isCreating ? (
                <Button
                    variant="primary"
                    onClick={() => setIsCreating(true)}
                    className="mb-6"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Yeni Repurposing Clip Ekle
                </Button>
            ) : (
                <Card className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Yeni Clip Oluştur</h3>

                    {/* Timeline Section Selector */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Timeline Bölümü Seç
                        </label>
                        <div className="space-y-2">
                            {timelineSections.map((section, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedSection(section)}
                                    className={`w-full text-left p-3 rounded-lg border transition-all ${selectedSection === section
                                            ? 'bg-indigo-500/20 border-indigo-500 text-white'
                                            : 'glass border-white/10 text-slate-300 hover:border-indigo-500/50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-semibold capitalize">{section.type}</span>
                                            <span className="text-xs text-slate-400 ml-2">
                                                {section.startTime}s - {section.endTime}s ({section.endTime - section.startTime}s)
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Platform Selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Platformlar
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {(Object.keys(PLATFORM_SPECS) as RepurposingPlatform[]).map(platform => {
                                const spec = PLATFORM_SPECS[platform];
                                const isSelected = selectedPlatforms.includes(platform);
                                const duration = selectedSection ? selectedSection.endTime - selectedSection.startTime : 0;
                                const isValidDuration = duration <= spec.maxDuration;

                                return (
                                    <button
                                        key={platform}
                                        onClick={() => togglePlatform(platform)}
                                        disabled={!isValidDuration}
                                        className={`p-3 rounded-lg border transition-all ${isSelected
                                                ? 'bg-indigo-500/30 border-indigo-500 text-white'
                                                : isValidDuration
                                                    ? 'glass border-white/10 text-slate-300 hover:border-indigo-500/50'
                                                    : 'glass border-red-500/30 text-slate-500 cursor-not-allowed opacity-50'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{getPlatformIcon(platform)}</div>
                                        <div className="text-xs font-medium">{spec.name}</div>
                                        <div className="text-xs text-slate-400">max {spec.maxDuration}s</div>
                                        {!isValidDuration && duration > 0 && (
                                            <div className="text-xs text-red-400 mt-1">Çok uzun!</div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Custom Title */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Özel Başlık (İsteğe Bağlı)
                        </label>
                        <input
                            type="text"
                            value={customTitle}
                            onChange={(e) => setCustomTitle(e.target.value)}
                            placeholder="Bu clip için özel bir başlık..."
                            className="w-full glass px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-indigo-500 outline-none"
                        />
                    </div>

                    {/* Notes */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Notlar (İsteğe Bağlı)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Düzenleme notları, özel efektler, vb..."
                            rows={3}
                            className="w-full glass px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-indigo-500 outline-none resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <Button
                            variant="primary"
                            onClick={handleCreateClip}
                            disabled={!selectedSection || selectedPlatforms.length === 0}
                        >
                            Clip Oluştur
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setIsCreating(false);
                                setSelectedSection(null);
                                setSelectedPlatforms([]);
                                setCustomTitle('');
                                setNotes('');
                            }}
                        >
                            İptal
                        </Button>
                    </div>
                </Card>
            )}

            {/* Clips List */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Repurposing Dashboard</h3>

                {repurposingClips.length === 0 ? (
                    <Card>
                        <div className="text-center py-12 text-slate-500">
                            <div className="text-6xl mb-4">♻️</div>
                            <p className="text-lg">Henüz repurposing clip yok</p>
                            <p className="text-sm mt-2">Timeline bölümlerini farklı platformlar için işaretle</p>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {repurposingClips.map(clip => (
                            <Card key={clip.id}>
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold text-white">
                                            {clip.customTitle || `Clip ${clip.startTime}-${clip.endTime}s`}
                                        </h4>
                                        <p className="text-xs text-slate-400">
                                            {getDuration(clip)} saniye
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => onDeleteClip(clip.id)}
                                        className="text-slate-400 hover:text-red-400 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Platforms */}
                                <div className="flex gap-2 mb-3 flex-wrap">
                                    {clip.platforms.map(platform => (
                                        <span
                                            key={platform}
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                        >
                                            {getPlatformIcon(platform)} {PLATFORM_SPECS[platform].name}
                                        </span>
                                    ))}
                                </div>

                                {/* Status */}
                                <div className="mb-3">
                                    <span className={`inline-block px-2 py-1 rounded text-xs border ${getStatusColor(clip.status)}`}>
                                        {clip.status === 'planned' ? '📋 Planlandı' : clip.status === 'exported' ? '💾 Export Edildi' : '✅ Yayınlandı'}
                                    </span>
                                </div>

                                {/* Notes */}
                                {clip.notes && (
                                    <p className="text-sm text-slate-400 italic">
                                        {clip.notes}
                                    </p>
                                )}

                                {/* Update Status */}
                                <div className="mt-3 pt-3 border-t border-white/10">
                                    <div className="flex gap-2">
                                        {clip.status === 'planned' && (
                                            <button
                                                onClick={() => onUpdateClip({ ...clip, status: 'exported' })}
                                                className="text-xs px-3 py-1 glass-hover rounded"
                                            >
                                                Export Edildi ✓
                                            </button>
                                        )}
                                        {clip.status === 'exported' && (
                                            <button
                                                onClick={() => onUpdateClip({ ...clip, status: 'published' })}
                                                className="text-xs px-3 py-1 glass-hover rounded"
                                            >
                                                Yayınlandı ✓
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
