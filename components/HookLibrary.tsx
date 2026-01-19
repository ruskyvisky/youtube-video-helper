'use client';

import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { HOOK_FRAMEWORKS, type HookFramework } from '@/lib/types';

interface HookLibraryProps {
    onSelectHook?: (hook: HookFramework) => void;
    isDrawer?: boolean;
    onClose?: () => void;
}

export const HookLibrary: React.FC<HookLibraryProps> = ({
    onSelectHook,
    isDrawer = false,
    onClose
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const categories = ['all', ...Array.from(new Set(HOOK_FRAMEWORKS.map(h => h.category)))];

    const filteredHooks = HOOK_FRAMEWORKS.filter(hook => {
        const matchesSearch =
            hook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hook.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hook.purpose.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || hook.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleUseHook = (hook: HookFramework) => {
        if (onSelectHook) {
            onSelectHook(hook);
        }
        copyToClipboard(hook.formula, hook.id);
        if (onClose) {
            setTimeout(onClose, 300);
        }
    };

    return (
        <div className={isDrawer ? 'h-full flex flex-col' : ''}>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-3xl font-bold gradient-text">🎣 Kanca Kütüphanesi</h2>
                    {isDrawer && onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 glass-hover rounded-lg text-slate-400 hover:text-white"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                <p className="text-slate-400 mb-4">
                    Videonun ilk 30 saniyesini güçlendirmek için kanıtlanmış 12 kanca stratejisi
                </p>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Kanca ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full glass px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-indigo-500 outline-none mb-3"
                />

                {/* Category Filter */}
                <div className="flex gap-2 flex-wrap">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat
                                    ? 'bg-indigo-500 text-white'
                                    : 'glass text-slate-400 hover:text-white glass-hover'
                                }`}
                        >
                            {cat === 'all' ? 'Tümü' : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Hooks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto flex-1">
                {filteredHooks.map(hook => (
                    <Card key={hook.id} className="group hover:scale-[1.02] transition-transform">
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-1">{hook.name}</h3>
                                    <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-indigo-500/20 text-indigo-300">
                                        {hook.category}
                                    </span>
                                </div>
                            </div>

                            {/* Formula */}
                            <div className="mb-3 p-3 glass rounded-lg border border-white/10">
                                <p className="text-sm text-slate-300 font-mono italic">
                                    "{hook.formula}"
                                </p>
                            </div>

                            {/* Example */}
                            <div className="mb-3 p-3 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg border border-indigo-500/20">
                                <p className="text-xs text-slate-400 mb-1">Örnek:</p>
                                <p className="text-sm text-slate-200">
                                    {hook.example}
                                </p>
                            </div>

                            {/* Purpose */}
                            <div className="mb-4">
                                <p className="text-xs text-slate-400 mb-1">💡 Ne işe yarar:</p>
                                <p className="text-sm text-slate-300">
                                    {hook.purpose}
                                </p>
                            </div>

                            {/* Action Button */}
                            <div className="mt-auto">
                                <Button
                                    variant="primary"
                                    className="w-full"
                                    onClick={() => handleUseHook(hook)}
                                >
                                    {copiedId === hook.id ? (
                                        <>
                                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Kopyalandı!
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            Bu Kancayı Kullan
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredHooks.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    <p className="text-lg">🔍 Aradığınız kanca bulunamadı</p>
                    <p className="text-sm mt-2">Farklı bir arama terimi deneyin</p>
                </div>
            )}
        </div>
    );
};
