'use client';

import React, { useState } from 'react';
import { Card } from './ui/Card';
import type { Asset, AssetType } from '@/lib/types';

interface AssetPoolProps {
    assets: Asset[];
    onDragStart: (asset: Asset) => void;
    onAddAsset: () => void;
}

export const AssetPool: React.FC<AssetPoolProps> = ({
    assets,
    onDragStart,
    onAddAsset
}) => {
    const [filterType, setFilterType] = useState<AssetType | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAssets = assets.filter(asset => {
        const matchesType = filterType === 'all' || asset.type === filterType;
        const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    const getAssetIcon = (type: AssetType) => {
        switch (type) {
            case 'video':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                );
            case 'image':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'audio':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                );
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#13131a] border-r border-white/10">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white">📦 Asset Pool</h3>
                    <button
                        onClick={onAddAsset}
                        className="p-1.5 glass-hover rounded-lg text-indigo-400 hover:text-indigo-300"
                        title="Asset Ekle"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Asset ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full glass px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-slate-400 focus:border-indigo-500 outline-none"
                />

                {/* Filters */}
                <div className="flex gap-1 mt-2">
                    {(['all', 'video', 'image', 'audio'] as const).map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`
                px-2 py-1 rounded text-xs font-medium transition-all
                ${filterType === type
                                    ? 'bg-indigo-500 text-white'
                                    : 'glass text-slate-400 hover:text-white'
                                }
              `}
                        >
                            {type === 'all' ? 'Tümü' : type === 'video' ? '🎥' : type === 'image' ? '🖼️' : '🎵'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Asset List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredAssets.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-sm">
                        <svg className="w-12 h-12 mx-auto mb-2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        <p>Asset yok</p>
                    </div>
                ) : (
                    filteredAssets.map(asset => (
                        <div
                            key={asset.id}
                            draggable
                            onDragStart={() => onDragStart(asset)}
                            className="glass glass-hover p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all hover:scale-105"
                        >
                            <div className="flex items-center gap-2">
                                <div className="text-indigo-400">
                                    {getAssetIcon(asset.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate">{asset.name}</p>
                                    <p className="text-slate-500 text-xs truncate">{asset.type}</p>
                                </div>
                                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Tip */}
            <div className="p-3 border-t border-white/10 text-xs text-slate-500">
                💡 Timeline'a sürükleyin
            </div>
        </div>
    );
};
