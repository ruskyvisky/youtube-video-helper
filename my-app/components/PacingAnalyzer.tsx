'use client';

import React, { useMemo } from 'react';
import { PACING_CONFIG, type TimelineSection, type PacingMetrics } from '@/lib/types';

interface PacingAnalyzerProps {
    text: string;
    sectionType?: 'hook' | 'value' | 'cta';
    compact?: boolean;
}

export const PacingAnalyzer: React.FC<PacingAnalyzerProps> = ({
    text,
    sectionType,
    compact = false
}) => {
    const metrics: PacingMetrics = useMemo(() => {
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        const characterCount = text.length;
        const estimatedDuration = (wordCount / PACING_CONFIG.wordsPerMinute) * 60; // in seconds

        return {
            wordCount,
            characterCount,
            estimatedDuration,
            wordsPerMinute: PACING_CONFIG.wordsPerMinute
        };
    }, [text]);

    const getWarnings = (): { type: 'success' | 'warning' | 'error'; message: string }[] => {
        const warnings: { type: 'success' | 'warning' | 'error'; message: string }[] = [];

        // Hook-specific warnings
        if (sectionType === 'hook') {
            if (metrics.estimatedDuration > PACING_CONFIG.hookMaxSeconds) {
                warnings.push({
                    type: 'error',
                    message: `🔴 Hook çok uzun! (${Math.round(metrics.estimatedDuration)}s > ${PACING_CONFIG.hookMaxSeconds}s) İzleyiciyi kaybedeceksin!`
                });
            } else if (metrics.estimatedDuration > PACING_CONFIG.hookMaxSeconds * 0.8) {
                warnings.push({
                    type: 'warning',
                    message: `🟡 Hook limitlere yaklaşıyor. (~${Math.round(metrics.estimatedDuration)}s)`
                });
            } else if (metrics.estimatedDuration > 0) {
                warnings.push({
                    type: 'success',
                    message: `✅ Hook süresi optimal (~${Math.round(metrics.estimatedDuration)}s)`
                });
            }
        }

        // General video duration warning
        if (metrics.estimatedDuration > PACING_CONFIG.optimalVideoDuration) {
            warnings.push({
                type: 'warning',
                message: `🟡 Video 10 dakikayı aşıyor. YouTube algoritması için optimize değil.`
            });
        }

        // Word count check
        if (sectionType === 'hook' && metrics.wordCount > 75) {
            warnings.push({
                type: 'error',
                message: '🔴 Hook çok fazla kelime içeriyor. Daha kısa ve net ol!'
            });
        }

        return warnings;
    };

    const warnings = getWarnings();

    if (compact) {
        return (
            <div className="inline-flex items-center gap-2 text-xs">
                <span className="text-slate-400">
                    {metrics.wordCount} kelime
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-indigo-400">
                    ~{Math.round(metrics.estimatedDuration)}sn
                </span>
                {warnings.length > 0 && warnings[0].type === 'error' && (
                    <span className="text-red-400">🔴</span>
                )}
            </div>
        );
    }

    return (
        <div className="glass p-4 rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    ⏱️ Senaryo Hız Analizi
                </h4>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="glass p-3 rounded-lg">
                    <p className="text-xs text-slate-400 mb-1">Kelime Sayısı</p>
                    <p className="text-xl font-bold text-white">{metrics.wordCount}</p>
                </div>
                <div className="glass p-3 rounded-lg">
                    <p className="text-xs text-slate-400 mb-1">Karakter</p>
                    <p className="text-xl font-bold text-white">{metrics.characterCount}</p>
                </div>
                <div className="glass p-3 rounded-lg">
                    <p className="text-xs text-slate-400 mb-1">Tahmini Süre</p>
                    <p className="text-xl font-bold text-indigo-400">
                        {Math.floor(metrics.estimatedDuration / 60)}:{String(Math.round(metrics.estimatedDuration % 60)).padStart(2, '0')}
                    </p>
                </div>
            </div>

            {/* Warnings */}
            {warnings.length > 0 && (
                <div className="space-y-2">
                    {warnings.map((warning, idx) => (
                        <div
                            key={idx}
                            className={`p-3 rounded-lg border ${warning.type === 'error'
                                    ? 'bg-red-500/10 border-red-500/30'
                                    : warning.type === 'warning'
                                        ? 'bg-yellow-500/10 border-yellow-500/30'
                                        : 'bg-green-500/10 border-green-500/30'
                                }`}
                        >
                            <p className={`text-sm ${warning.type === 'error'
                                    ? 'text-red-300'
                                    : warning.type === 'warning'
                                        ? 'text-yellow-300'
                                        : 'text-green-300'
                                }`}>
                                {warning.message}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Info */}
            <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs text-slate-500">
                    💡 {PACING_CONFIG.wordsPerMinute} kelime/dakika konuşma hızı baz alınıyor
                </p>
            </div>
        </div>
    );
};
