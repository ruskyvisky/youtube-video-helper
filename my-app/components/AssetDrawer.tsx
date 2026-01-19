'use client';

import React, { useState } from 'react';
import { Tabs } from './ui/Tabs';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import type { Asset, AssetType } from '@/lib/types';

interface AssetDrawerProps {
    assets: Asset[];
    sceneId?: string;
    onAddAsset: (asset: Omit<Asset, 'id' | 'createdAt'>) => void;
    onDeleteAsset: (id: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export const AssetDrawer: React.FC<AssetDrawerProps> = ({
    assets,
    sceneId,
    onAddAsset,
    onDeleteAsset,
    isOpen,
    onClose
}) => {
    const [activeTab, setActiveTab] = useState<AssetType>('video');
    const [newAssetUrl, setNewAssetUrl] = useState('');
    const [newAssetName, setNewAssetName] = useState('');
    const [newAssetNotes, setNewAssetNotes] = useState('');

    // Filter assets by scene and type
    const filteredAssets = assets.filter(
        asset => (!sceneId || asset.sceneId === sceneId) && asset.type === activeTab
    );

    const handleAddAsset = () => {
        if (!newAssetUrl.trim() || !newAssetName.trim()) return;

        onAddAsset({
            type: activeTab,
            name: newAssetName.trim(),
            url: newAssetUrl.trim(),
            notes: newAssetNotes.trim(),
            sceneId
        });

        // Reset form
        setNewAssetUrl('');
        setNewAssetName('');
        setNewAssetNotes('');
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const tabs = [
        {
            id: 'video' as AssetType,
            label: 'Video',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            id: 'image' as AssetType,
            label: 'Görseller',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            id: 'audio' as AssetType,
            label: 'Ses/Müzik',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
            )
        }
    ];

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-[#13131a] z-50 shadow-2xl animate-slide-in overflow-y-auto">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <div>
                            <h2 className="text-2xl font-bold gradient-text">Asset Kütüphanesi</h2>
                            <p className="text-slate-400 text-sm mt-1">
                                Video, görsel ve ses materyallerinizi yönetin
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Add New Asset Form */}
                    <Card>
                        <h3 className="font-semibold text-white mb-4">Yeni Asset Ekle</h3>
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={newAssetName}
                                onChange={(e) => setNewAssetName(e.target.value)}
                                placeholder="Asset adı..."
                                className="w-full glass px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-indigo-500 outline-none"
                            />
                            <input
                                type="url"
                                value={newAssetUrl}
                                onChange={(e) => setNewAssetUrl(e.target.value)}
                                placeholder="URL (Pexels, Storyblocks, vb.)..."
                                className="w-full glass px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-indigo-500 outline-none"
                            />
                            <textarea
                                value={newAssetNotes}
                                onChange={(e) => setNewAssetNotes(e.target.value)}
                                placeholder="Notlar (opsiyonel)..."
                                rows={2}
                                className="w-full glass px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-indigo-500 outline-none resize-none"
                            />
                            <Button onClick={handleAddAsset} className="w-full">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Asset Ekle
                            </Button>
                        </div>
                    </Card>

                    {/* Tabs */}
                    <Tabs tabs={tabs} defaultTab="video" onChange={(tab) => setActiveTab(tab as AssetType)}>
                        {() => (
                            <div className="space-y-3">
                                {filteredAssets.length === 0 ? (
                                    <div className="text-center py-12 text-slate-400">
                                        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                        </svg>
                                        <p>Henüz {activeTab === 'video' ? 'video' : activeTab === 'image' ? 'görsel' : 'ses'} yok</p>
                                    </div>
                                ) : (
                                    filteredAssets.map(asset => (
                                        <AssetCard
                                            key={asset.id}
                                            asset={asset}
                                            onDelete={() => onDeleteAsset(asset.id)}
                                            onCopy={copyToClipboard}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    </Tabs>

                    {/* Footer */}
                    <div className="pt-4 border-t border-white/10 text-xs text-slate-400">
                        <p>💡 İpucu: Pexels, Storyblocks, Epidemic Sound gibi platformlardan linkler ekleyin</p>
                    </div>
                </div>
            </div>
        </>
    );
};

// Asset Card Component
interface AssetCardProps {
    asset: Asset;
    onDelete: () => void;
    onCopy: (url: string) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, onDelete, onCopy }) => {
    const getIcon = () => {
        switch (asset.type) {
            case 'video':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                );
            case 'image':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'audio':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                );
        }
    };

    return (
        <Card hover className="group">
            <div className="flex items-start gap-3">
                <div className="p-2 glass rounded-lg text-indigo-400">
                    {getIcon()}
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white mb-1">{asset.name}</h4>
                    <a
                        href={asset.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-400 hover:text-indigo-300 truncate block"
                    >
                        {asset.url}
                    </a>
                    {asset.notes && (
                        <p className="text-xs text-slate-400 mt-1">{asset.notes}</p>
                    )}
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onCopy(asset.url)}
                        className="p-2 glass-hover rounded-lg text-slate-400 hover:text-white"
                        title="Kopyala"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 glass-hover rounded-lg text-slate-400 hover:text-red-400"
                        title="Sil"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </Card>
    );
};
