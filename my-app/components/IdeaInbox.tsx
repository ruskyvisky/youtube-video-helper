'use client';

import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import type { Idea, IdeaStatus } from '@/lib/types';
import { IDEA_COLORS } from '@/lib/types';

interface IdeaInboxProps {
    ideas: Idea[];
    onUpdateIdea: (idea: Idea) => void;
    onDeleteIdea: (id: string) => void;
    onAddIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const IdeaInbox: React.FC<IdeaInboxProps> = ({
    ideas,
    onUpdateIdea,
    onDeleteIdea,
    onAddIdea
}) => {
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<IdeaStatus | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter ideas that are in inbox (no sceneId)
    const inboxIdeas = ideas.filter(idea => !idea.sceneId);

    // Apply filters
    const filteredIdeas = inboxIdeas.filter(idea => {
        const matchesStatus = filterStatus === 'all' || idea.status === filterStatus;
        const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            idea.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleCreateIdea = () => {
        setIsCreating(true);
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold gradient-text">Fikir Havuzu</h2>
                    <p className="text-slate-400 mt-1">
                        {filteredIdeas.length} fikir • Post-it tarzı notlar
                    </p>
                </div>
                <Button onClick={handleCreateIdea}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Yeni Fikir
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Fikir ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="glass px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-indigo-500 outline-none transition-colors flex-1 min-w-[250px]"
                />
                <div className="flex gap-2">
                    {(['all', 'raw', 'researching', 'approved'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`
                px-4 py-2 rounded-lg font-medium transition-all
                ${filterStatus === status
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                                    : 'glass text-slate-300 hover:text-white'
                                }
              `}
                        >
                            {status === 'all' ? 'Tümü' : status === 'raw' ? 'Ham' : status === 'researching' ? 'Araştırma' : 'Onaylandı'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Ideas Grid */}
            <div className="grid-auto-fill">
                {/* New Idea Card (Post-it style) */}
                {isCreating && (
                    <NewIdeaCard
                        onSave={(ideaData) => {
                            onAddIdea(ideaData);
                            setIsCreating(false);
                        }}
                        onCancel={() => setIsCreating(false)}
                    />
                )}

                {filteredIdeas.map((idea) => (
                    editingId === idea.id ? (
                        <EditIdeaCard
                            key={idea.id}
                            idea={idea}
                            onSave={(ideaData) => {
                                onUpdateIdea({ ...idea, ...ideaData });
                                setEditingId(null);
                            }}
                            onCancel={() => setEditingId(null)}
                        />
                    ) : (
                        <IdeaCard
                            key={idea.id}
                            idea={idea}
                            onEdit={() => setEditingId(idea.id)}
                            onDelete={() => onDeleteIdea(idea.id)}
                            onStatusChange={(status) => onUpdateIdea({ ...idea, status })}
                        />
                    )
                ))}

                {!isCreating && filteredIdeas.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-400">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>Henüz fikir yok. Hemen bir tane ekleyin!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// New Idea Card (Post-it style creation)
interface NewIdeaCardProps {
    onSave: (ideaData: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
}

const NewIdeaCard: React.FC<NewIdeaCardProps> = ({ onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<IdeaStatus>('raw');
    const [color, setColor] = useState(IDEA_COLORS[0]);

    const handleSave = () => {
        if (!title.trim()) return;
        onSave({ title: title.trim(), description: description.trim(), status, color });
    };

    return (
        <div
            className="relative p-6 rounded-xl shadow-2xl transition-all animate-scale-in border-4 rotate-1"
            style={{
                background: color,
                borderColor: color,
                boxShadow: `0 10px 40px ${color}40`
            }}
        >
            <div className="space-y-3">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && description && handleSave()}
                    placeholder="Fikir başlığı..."
                    className="w-full bg-transparent border-0 border-b-2 border-black/20 text-black placeholder-black/50 text-lg font-bold outline-none pb-1"
                    autoFocus
                    style={{ fontFamily: 'Courier New, monospace' }}
                />

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detaylar..."
                    rows={4}
                    className="w-full bg-transparent border-0 text-black placeholder-black/50 text-sm outline-none resize-none"
                    style={{ fontFamily: 'Courier New, monospace' }}
                />

                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={() => setStatus('raw')}
                            className={`px-2 py-1 rounded text-lg transition-all ${status === 'raw' ? 'bg-yellow-500/30 scale-110' : 'bg-black/10 hover:bg-black/20'}`}
                            title="Ham Fikir"
                        >
                            💡
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatus('researching')}
                            className={`px-2 py-1 rounded text-lg transition-all ${status === 'researching' ? 'bg-blue-500/30 scale-110' : 'bg-black/10 hover:bg-black/20'}`}
                            title="Araştırma"
                        >
                            🔍
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatus('approved')}
                            className={`px-2 py-1 rounded text-lg transition-all ${status === 'approved' ? 'bg-green-500/30 scale-110' : 'bg-black/10 hover:bg-black/20'}`}
                            title="Onaylandı"
                        >
                            ✅
                        </button>
                    </div>

                    <div className="flex gap-1">
                        {IDEA_COLORS.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setColor(c)}
                                className={`w-6 h-6 rounded border-2 transition-all ${color === c ? 'border-black scale-110' : 'border-black/20'
                                    }`}
                                style={{ background: c }}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-black/80 hover:bg-black text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                    >
                        Kaydet
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-black/10 hover:bg-black/20 text-black rounded-lg font-semibold text-sm transition-colors"
                    >
                        İptal
                    </button>
                </div>
            </div>
        </div>
    );
};

// Edit Idea Card (Post-it style editing)
interface EditIdeaCardProps {
    idea: Idea;
    onSave: (ideaData: Partial<Idea>) => void;
    onCancel: () => void;
}

const EditIdeaCard: React.FC<EditIdeaCardProps> = ({ idea, onSave, onCancel }) => {
    const [title, setTitle] = useState(idea.title);
    const [description, setDescription] = useState(idea.description);
    const [status, setStatus] = useState(idea.status);
    const [color, setColor] = useState(idea.color);

    const handleSave = () => {
        if (!title.trim()) return;
        onSave({ title: title.trim(), description: description.trim(), status, color });
    };

    return (
        <div
            className="relative p-6 rounded-xl shadow-2xl transition-all animate-scale-in border-4 -rotate-1"
            style={{
                background: color,
                borderColor: color,
                boxShadow: `0 10px 40px ${color}40`
            }}
        >
            <div className="space-y-3">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-black/20 text-black placeholder-black/50 text-lg font-bold outline-none pb-1"
                    style={{ fontFamily: 'Courier New, monospace' }}
                />

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-transparent border-0 text-black placeholder-black/50 text-sm outline-none resize-none"
                    style={{ fontFamily: 'Courier New, monospace' }}
                />

                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={() => setStatus('raw')}
                            className={`px-2 py-1 rounded text-lg transition-all ${status === 'raw' ? 'bg-yellow-500/30 scale-110' : 'bg-black/10 hover:bg-black/20'}`}
                            title="Ham Fikir"
                        >
                            💡
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatus('researching')}
                            className={`px-2 py-1 rounded text-lg transition-all ${status === 'researching' ? 'bg-blue-500/30 scale-110' : 'bg-black/10 hover:bg-black/20'}`}
                            title="Araştırma"
                        >
                            🔍
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatus('approved')}
                            className={`px-2 py-1 rounded text-lg transition-all ${status === 'approved' ? 'bg-green-500/30 scale-110' : 'bg-black/10 hover:bg-black/20'}`}
                            title="Onaylandı"
                        >
                            ✅
                        </button>
                    </div>

                    <div className="flex gap-1">
                        {IDEA_COLORS.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setColor(c)}
                                className={`w-6 h-6 rounded border-2 transition-all ${color === c ? 'border-black scale-110' : 'border-black/20'
                                    }`}
                                style={{ background: c }}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-black/80 hover:bg-black text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                    >
                        Kaydet
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-black/10 hover:bg-black/20 text-black rounded-lg font-semibold text-sm transition-colors"
                    >
                        İptal
                    </button>
                </div>
            </div>
        </div>
    );
};

// Idea Card Component (Display mode)
interface IdeaCardProps {
    idea: Idea;
    onEdit: () => void;
    onDelete: () => void;
    onStatusChange: (status: IdeaStatus) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onEdit, onDelete, onStatusChange }) => {
    return (
        <div
            onClick={onEdit}
            className="relative p-6 rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105 hover:shadow-2xl hover:rotate-1 border-4 group"
            style={{
                background: idea.color,
                borderColor: idea.color,
                boxShadow: `0 4px 20px ${idea.color}30`,
                transform: `rotate(${Math.random() * 4 - 2}deg)`
            }}
        >
            {/* Delete button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="space-y-3">
                <h3 className="font-bold text-xl text-black line-clamp-2" style={{ fontFamily: 'Courier New, monospace' }}>
                    {idea.title}
                </h3>

                <p className="text-black/70 text-sm line-clamp-4" style={{ fontFamily: 'Courier New, monospace' }}>
                    {idea.description}
                </p>

                <div className="flex items-center justify-between pt-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onStatusChange('raw');
                            }}
                            className={`px-2 py-1 rounded text-lg transition-all ${idea.status === 'raw' ? 'bg-yellow-500/30 scale-110' : 'bg-black/10 hover:bg-black/20'}`}
                            title="Ham Fikir"
                        >
                            💡
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onStatusChange('researching');
                            }}
                            className={`px-2 py-1 rounded text-lg transition-all ${idea.status === 'researching' ? 'bg-blue-500/30 scale-110' : 'bg-black/10 hover:bg-black/20'}`}
                            title="Araştırma"
                        >
                            🔍
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onStatusChange('approved');
                            }}
                            className={`px-2 py-1 rounded text-lg transition-all ${idea.status === 'approved' ? 'bg-green-500/30 scale-110' : 'bg-black/10 hover:bg-black/20'}`}
                            title="Onaylandı"
                        >
                            ✅
                        </button>
                    </div>
                </div>
            </div>

            {/* Tape effect */}
            <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 opacity-60"
                style={{
                    clipPath: 'polygon(10% 0%, 90% 0%, 95% 100%, 5% 100%)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
            />
        </div>
    );
};
