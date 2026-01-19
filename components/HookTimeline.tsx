'use client';

import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { PacingAnalyzer } from './PacingAnalyzer';
import type { TimelineSection, VideoSection } from '@/lib/types';

interface HookTimelineProps {
    timeline: TimelineSection[];
    videoDuration?: number; // in seconds
    onUpdateTimeline: (timeline: TimelineSection[]) => void;
}

export const HookTimeline: React.FC<HookTimelineProps> = ({
    timeline = [],
    videoDuration = 300, // default 5 minutes
    onUpdateTimeline
}) => {
    const sectionColors = {
        hook: { bg: '#ec4899', label: 'Hook (Giriş)' },
        value: { bg: '#6366f1', label: 'Value (İçerik)' },
        cta: { bg: '#10b981', label: 'CTA (Harekete Geçirici)' }
    };

    const handleAddSection = (type: VideoSection) => {
        // Find the last end time
        const lastEndTime = timeline.length > 0
            ? Math.max(...timeline.map(s => s.endTime))
            : 0;

        const newSection: TimelineSection = {
            type,
            startTime: lastEndTime,
            endTime: Math.min(lastEndTime + 30, videoDuration),
            notes: ''
        };

        onUpdateTimeline([...timeline, newSection]);
    };

    const handleUpdateSection = (index: number, updates: Partial<TimelineSection>) => {
        const updated = [...timeline];
        updated[index] = { ...updated[index], ...updates };
        onUpdateTimeline(updated);
    };

    const handleDeleteSection = (index: number) => {
        const updated = timeline.filter((_, i) => i !== index);
        onUpdateTimeline(updated);
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const updated = [...timeline];
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
        onUpdateTimeline(updated);
    };

    const handleMoveDown = (index: number) => {
        if (index === timeline.length - 1) return;
        const updated = [...timeline];
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
        onUpdateTimeline(updated);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getPercentage = (seconds: number) => {
        return (seconds / videoDuration) * 100;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold gradient-text">Video Yapısı Timeline</h2>
                    <p className="text-slate-400 mt-1">
                        Hook, Value ve CTA bölümlerini planlayın
                    </p>
                </div>
                <div className="text-sm text-slate-400">
                    Toplam: {formatTime(videoDuration)}
                </div>
            </div>

            {/* Timeline Visualization */}
            <Card>
                <div className="space-y-4">
                    {/* Timeline Bar */}
                    <div className="relative h-20 bg-white/5 rounded-lg overflow-hidden">
                        {/* First 30s highlight zone */}
                        <div
                            className="absolute top-0 bottom-0 bg-yellow-500/10 border-r-2 border-yellow-500/50"
                            style={{ width: `${getPercentage(30)}%` }}
                        >
                            <div className="absolute top-1 right-1 text-xs text-yellow-400 font-semibold">
                                İlk 30sn
                            </div>
                        </div>

                        {/* Timeline sections */}
                        {timeline.map((section, index) => {
                            const startPercent = getPercentage(section.startTime);
                            const widthPercent = getPercentage(section.endTime - section.startTime);
                            const color = sectionColors[section.type];

                            return (
                                <div
                                    key={index}
                                    className="absolute top-0 bottom-0 border-2 border-white/20 cursor-pointer hover:border-white/40 transition-all group"
                                    style={{
                                        left: `${startPercent}%`,
                                        width: `${widthPercent}%`,
                                        background: `linear-gradient(180deg, ${color.bg}80 0%, ${color.bg}40 100%)`
                                    }}
                                >
                                    <div className="p-2 h-full flex flex-col justify-between">
                                        <div className="text-xs font-semibold text-white">
                                            {color.label}
                                        </div>
                                        <div className="text-xs text-white/80">
                                            {formatTime(section.startTime)} - {formatTime(section.endTime)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Time markers */}
                    <div className="flex justify-between text-xs text-slate-500">
                        {[0, 0.25, 0.5, 0.75, 1].map(fraction => (
                            <div key={fraction}>{formatTime(videoDuration * fraction)}</div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Add Section Buttons */}
            <div className="flex gap-3">
                <Button
                    onClick={() => handleAddSection('hook')}
                    variant="ghost"
                    className="flex-1"
                    style={{ borderLeft: `4px solid ${sectionColors.hook.bg}` }}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Hook Ekle
                </Button>
                <Button
                    onClick={() => handleAddSection('value')}
                    variant="ghost"
                    className="flex-1"
                    style={{ borderLeft: `4px solid ${sectionColors.value.bg}` }}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Value Ekle
                </Button>
                <Button
                    onClick={() => handleAddSection('cta')}
                    variant="ghost"
                    className="flex-1"
                    style={{ borderLeft: `4px solid ${sectionColors.cta.bg}` }}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    CTA Ekle
                </Button>
            </div>

            {/* Section Details */}
            <div className="space-y-3">
                {timeline.map((section, index) => (
                    <Card key={index} hover>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ background: sectionColors[section.type].bg }}
                                    />
                                    <h4 className="font-semibold text-white">
                                        {sectionColors[section.type].label}
                                    </h4>
                                    <span className="text-sm text-slate-400">
                                        {formatTime(section.startTime)} → {formatTime(section.endTime)}
                                        <span className="ml-2 text-xs">
                                            ({formatTime(section.endTime - section.startTime)})
                                        </span>
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    {/* Move up/down */}
                                    <button
                                        onClick={() => handleMoveUp(index)}
                                        disabled={index === 0}
                                        className="p-1.5 glass-hover rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Yukarı taşı"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleMoveDown(index)}
                                        disabled={index === timeline.length - 1}
                                        className="p-1.5 glass-hover rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Aşağı taşı"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSection(index)}
                                        className="p-1.5 glass-hover rounded-lg text-slate-400 hover:text-red-400"
                                        title="Sil"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Başlangıç (saniye)</label>
                                    <input
                                        type="number"
                                        value={section.startTime}
                                        onChange={(e) => handleUpdateSection(index, { startTime: Number(e.target.value) })}
                                        className="w-full glass px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-indigo-500"
                                        min={0}
                                        max={videoDuration}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Bitiş (saniye)</label>
                                    <input
                                        type="number"
                                        value={section.endTime}
                                        onChange={(e) => handleUpdateSection(index, { endTime: Number(e.target.value) })}
                                        className="w-full glass px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-indigo-500"
                                        min={section.startTime}
                                        max={videoDuration}
                                    />
                                </div>
                            </div>

                            <textarea
                                value={section.notes}
                                onChange={(e) => handleUpdateSection(index, { notes: e.target.value })}
                                placeholder="Notlar (bu bölüm için fikirler, scriptler, vb.)..."
                                rows={3}
                                className="w-full glass px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-slate-400 outline-none focus:border-indigo-500 resize-none"
                            />

                            {/* Pacing Analyzer */}
                            {section.notes && (
                                <PacingAnalyzer
                                    text={section.notes}
                                    sectionType={section.type}
                                    compact={false}
                                />
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Tips */}
            <Card>
                <div className="space-y-2 text-sm">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        İpuçları
                    </h4>
                    <ul className="text-slate-400 space-y-1 ml-6 list-disc">
                        <li><strong className="text-yellow-400">Hook:</strong> İlk 30 saniye kritik! İzleyiciyi hemen yakalayın</li>
                        <li><strong className="text-indigo-400">Value:</strong> Ana içeriğinizi sunun, değer katın</li>
                        <li><strong className="text-green-400">CTA:</strong> Like, subscribe, yorum gibi aksiyonları çağırın</li>
                        <li>Yukarı/aşağı ok butonlarıyla bölüm sırasını değiştirebilirsiniz</li>
                    </ul>
                </div>
            </Card>
        </div>
    );
};
