'use client';

import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import type { VideoMetadata, ThumbnailIdea } from '@/lib/types';

interface MetadataPanelProps {
    metadata: VideoMetadata;
    onUpdateMetadata: (metadata: VideoMetadata) => void;
}

export const MetadataPanel: React.FC<MetadataPanelProps> = ({
    metadata,
    onUpdateMetadata
}) => {
    const [newTitle, setNewTitle] = useState('');
    const [newThumbnailDesc, setNewThumbnailDesc] = useState('');

    const handleAddTitle = () => {
        if (!newTitle.trim()) return;
        onUpdateMetadata({
            ...metadata,
            titles: [...metadata.titles, newTitle.trim()]
        });
        setNewTitle('');
    };

    const handleRemoveTitle = (index: number) => {
        onUpdateMetadata({
            ...metadata,
            titles: metadata.titles.filter((_, i) => i !== index)
        });
    };

    const handleAddThumbnail = () => {
        if (!newThumbnailDesc.trim()) return;

        const newThumbnail: ThumbnailIdea = {
            id: crypto.randomUUID(),
            description: newThumbnailDesc.trim(),
            notes: ''
        };

        onUpdateMetadata({
            ...metadata,
            thumbnails: [...metadata.thumbnails, newThumbnail]
        });
        setNewThumbnailDesc('');
    };

    const handleRemoveThumbnail = (id: string) => {
        onUpdateMetadata({
            ...metadata,
            thumbnails: metadata.thumbnails.filter(t => t.id !== id)
        });
    };

    const handleUpdateNotes = (notes: string) => {
        onUpdateMetadata({
            ...metadata,
            notes
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold gradient-text">Metadata & Thumbnail</h2>
                <p className="text-slate-400 mt-1">
                    Video başlıkları ve thumbnail fikirlerini planlayın
                </p>
            </div>

            {/* Alternative Titles */}
            <Card>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Alternatif Başlıklar
                </h3>

                <div className="space-y-3">
                    {/* Add title input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTitle()}
                            placeholder="Yeni başlık fikri..."
                            maxLength={100}
                            className="flex-1 glass px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-indigo-500 outline-none"
                        />
                        <Button onClick={handleAddTitle}>Ekle</Button>
                    </div>

                    {/* Character count */}
                    <div className="text-xs text-slate-500 text-right">
                        {newTitle.length}/100 karakter
                    </div>

                    {/* Titles list */}
                    <div className="space-y-2">
                        {metadata.titles.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 text-sm">
                                Henüz başlık eklenmedi
                            </div>
                        ) : (
                            metadata.titles.map((title, index) => (
                                <div
                                    key={index}
                                    className="glass glass-hover p-3 rounded-lg flex items-start justify-between gap-3 group"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-start gap-2">
                                            <span className="text-xs font-semibold text-indigo-400 mt-0.5">
                                                #{index + 1}
                                            </span>
                                            <p className="text-white">{title}</p>
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            {title.length} karakter
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveTitle(index)}
                                        className="text-slate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Card>

            {/* Thumbnail Ideas */}
            <Card>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Thumbnail Fikirleri
                </h3>

                <div className="space-y-3">
                    {/* Add thumbnail input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newThumbnailDesc}
                            onChange={(e) => setNewThumbnailDesc(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddThumbnail()}
                            placeholder="Thumbnail fikri (örn: 'Şaşkın yüz ifadesi + büyük sarı metin')..."
                            className="flex-1 glass px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-indigo-500 outline-none"
                        />
                        <Button onClick={handleAddThumbnail} variant="secondary">Ekle</Button>
                    </div>

                    {/* Thumbnails grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {metadata.thumbnails.length === 0 ? (
                            <div className="col-span-full text-center py-8 text-slate-500 text-sm">
                                Henüz thumbnail fikri eklenmedi
                            </div>
                        ) : (
                            metadata.thumbnails.map((thumbnail) => (
                                <div
                                    key={thumbnail.id}
                                    className="glass glass-hover p-4 rounded-lg group relative"
                                >
                                    {/* Placeholder for thumbnail image */}
                                    <div className="aspect-video bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-lg mb-3 flex items-center justify-center text-slate-500">
                                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>

                                    <p className="text-sm text-white mb-2">{thumbnail.description}</p>

                                    {thumbnail.notes && (
                                        <p className="text-xs text-slate-400">{thumbnail.notes}</p>
                                    )}

                                    <button
                                        onClick={() => handleRemoveThumbnail(thumbnail.id)}
                                        className="absolute top-2 right-2 p-1 bg-red-500/80 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Card>

            {/* General Notes */}
            <Card>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Genel Notlar
                </h3>

                <textarea
                    value={metadata.notes}
                    onChange={(e) => handleUpdateNotes(e.target.value)}
                    placeholder="A/B test notları, trend analizi, hashtag fikirleri..."
                    rows={6}
                    className="w-full glass px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-indigo-500 outline-none resize-none"
                />
            </Card>

            {/* Tips */}
            <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                <div className="space-y-2 text-sm">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Başlık & Thumbnail İpuçları
                    </h4>
                    <ul className="text-slate-300 space-y-1 ml-6 list-disc">
                        <li>Başlık için 5-10 farklı alternatif düşünün</li>
                        <li>Thumbnail'de yüz ifadesi ve kontrast renkler kullanın</li>
                        <li>Başlıkta merak uyandırıcı kelimeler ekleyin</li>
                        <li>A/B test için en az 2-3 thumbnail çekin</li>
                    </ul>
                </div>
            </Card>
        </div>
    );
};
