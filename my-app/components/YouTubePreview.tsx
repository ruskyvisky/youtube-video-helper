'use client';

import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import type { YouTubePreviewVariant } from '@/lib/types';

interface YouTubePreviewProps {
    variants: YouTubePreviewVariant[];
    onAddVariant: (variant: Omit<YouTubePreviewVariant, 'id'>) => void;
    onUpdateVariant: (variant: YouTubePreviewVariant) => void;
    onDeleteVariant: (id: string) => void;
}

export const YouTubePreview: React.FC<YouTubePreviewProps> = ({
    variants,
    onAddVariant,
    onUpdateVariant,
    onDeleteVariant
}) => {
    const [isCreating, setIsCreating] = useState(false);
    const [title, setTitle] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

    const handleCreate = () => {
        if (!title) return;

        onAddVariant({
            title,
            thumbnailUrl: thumbnailUrl || undefined,
        });

        setTitle('');
        setThumbnailUrl('');
        setIsCreating(false);
    };

    const YouTubeVideoCard = ({ variant, label }: { variant: YouTubePreviewVariant; label: string }) => {
        const isDesktop = viewMode === 'desktop';

        return (
            <div className={`${isDesktop ? 'w-full' : 'w-full max-w-sm mx-auto'}`}>
                {/* Label */}
                <div className="mb-2">
                    <span className="px-2 py-1 text-xs font-semibold bg-indigo-500/20 text-indigo-300 rounded">
                        {label}
                    </span>
                </div>

                {/* YouTube Card (Dark Mode) */}
                <div className="bg-[#0f0f0f] rounded-xl overflow-hidden border border-[#3f3f3f] hover:bg-[#272727] transition-colors cursor-pointer">
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-[#272727]">
                        {variant.thumbnailUrl ? (
                            <img
                                src={variant.thumbnailUrl}
                                alt={variant.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" />
                                </svg>
                            </div>
                        )}
                        {/* Duration badge */}
                        <div className="absolute bottom-1 right-1 bg-black/90 px-1.5 py-0.5 rounded text-xs font-semibold text-white">
                            10:24
                        </div>
                    </div>

                    {/* Info */}
                    <div className={`p-3 ${isDesktop ? 'flex gap-3' : ''}`}>
                        {/* Channel Avatar */}
                        <div className={`${isDesktop ? 'flex-shrink-0' : 'hidden'}`}>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                AI
                            </div>
                        </div>

                        {/* Title and metadata */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium text-sm leading-snug line-clamp-2 mb-1">
                                {variant.title}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-[#aaaaaa]">
                                <span className="hover:text-white cursor-pointer">AI Insider</span>
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M10,17l-5-5l1.41-1.41L10,14.17l7.59-7.59L19,8L10,17z" />
                                </svg>
                            </div>
                            <div className="text-xs text-[#aaaaaa] mt-0.5">
                                <span>2.5K views</span>
                                <span className="mx-1">•</span>
                                <span>2 hours ago</span>
                            </div>
                        </div>

                        {/* Menu */}
                        <div className={`${isDesktop ? 'flex-shrink-0' : 'hidden'}`}>
                            <button className="text-white p-1 hover:bg-white/10 rounded-full">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="5" r="2" />
                                    <circle cx="12" cy="12" r="2" />
                                    <circle cx="12" cy="19" r="2" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Edit Controls */}
                <div className="mt-2 flex gap-2">
                    <button
                        onClick={() => onDeleteVariant(variant.id)}
                        className="text-xs px-3 py-1.5 glass-hover rounded text-red-400 hover:text-red-300"
                    >
                        Sil
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">📺 YouTube A/B Test Önizleme</h3>
                <p className="text-slate-400">
                    Thumbnail ve başlık kombinasyonlarını gerçek YouTube arayüzünde görüp karşılaştır
                </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setViewMode('desktop')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'desktop'
                            ? 'bg-indigo-500 text-white'
                            : 'glass text-slate-400 hover:text-white'
                        }`}
                >
                    🖥️ Desktop
                </button>
                <button
                    onClick={() => setViewMode('mobile')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'mobile'
                            ? 'bg-indigo-500 text-white'
                            : 'glass text-slate-400 hover:text-white'
                        }`}
                >
                    📱 Mobile
                </button>
            </div>

            {/* Add Variant Form */}
            {!isCreating ? (
                <Button
                    variant="primary"
                    onClick={() => setIsCreating(true)}
                    className="mb-6"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Yeni Varyant Ekle
                </Button>
            ) : (
                <Card className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Yeni Varyant</h4>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Video Başlığı <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={100}
                            placeholder="AI Projeleri Neden Başarısız Olur?"
                            className="w-full glass px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-indigo-500 outline-none"
                        />
                        <p className="text-xs text-slate-500 mt-1">{title.length}/100 karakter</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Thumbnail URL (İsteğe Bağlı)
                        </label>
                        <input
                            type="text"
                            value={thumbnailUrl}
                            onChange={(e) => setThumbnailUrl(e.target.value)}
                            placeholder="https://example.com/thumbnail.jpg"
                            className="w-full glass px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-indigo-500 outline-none"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button variant="primary" onClick={handleCreate} disabled={!title}>
                            Varyant Ekle
                        </Button>
                        <Button variant="ghost" onClick={() => {
                            setIsCreating(false);
                            setTitle('');
                            setThumbnailUrl('');
                        }}>
                            İptal
                        </Button>
                    </div>
                </Card>
            )}

            {/* Preview Grid */}
            {variants.length === 0 ? (
                <Card>
                    <div className="text-center py-12 text-slate-500">
                        <div className="text-6xl mb-4">📺</div>
                        <p className="text-lg">Henüz varyant yok</p>
                        <p className="text-sm mt-2">Farklı thumbnail ve başlık kombinasyonları ekleyin</p>
                    </div>
                </Card>
            ) : (
                <div className={`grid gap-6 ${viewMode === 'desktop' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                    {variants.map((variant, idx) => (
                        <YouTubeVideoCard
                            key={variant.id}
                            variant={variant}
                            label={`Varyant ${String.fromCharCode(65 + idx)}`}
                        />
                    ))}
                </div>
            )}

            {/* Info */}
            <div className="mt-6 p-4 glass rounded-lg border border-white/10">
                <p className="text-sm text-slate-400">
                    💡 <strong>İpucu:</strong> Hangi thumbnail/başlık kombinasyonunun daha çekici olduğunu görmek için
                    gerçek YouTube dark mode görünümünü kullanıyoruz. Bu, tıklama oranını optimize etmenize yardımcı olur.
                </p>
            </div>
        </div>
    );
};
