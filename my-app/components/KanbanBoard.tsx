'use client';

import React, { useState } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import type { Idea, Scene } from '@/lib/types';

interface KanbanBoardProps {
    ideas: Idea[];
    scenes: Scene[];
    onUpdateIdea: (idea: Idea) => void;
    onAddScene: (scene: Omit<Scene, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onUpdateScene: (scene: Scene) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
    ideas,
    scenes,
    onUpdateIdea,
    onAddScene,
    onUpdateScene
}) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [newSceneTitle, setNewSceneTitle] = useState('');
    const [isAddingScene, setIsAddingScene] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const ideaId = active.id as string;
        const targetSceneId = over.id as string;

        const idea = ideas.find(i => i.id === ideaId);
        if (!idea) return;

        // Update idea's scene
        onUpdateIdea({
            ...idea,
            sceneId: targetSceneId === 'inbox' ? undefined : targetSceneId
        });
    };

    const handleAddScene = () => {
        if (!newSceneTitle.trim()) return;

        onAddScene({
            title: newSceneTitle.trim(),
            description: '',
            order: scenes.length,
            ideas: [],
            assets: [],
            todos: []
        });

        setNewSceneTitle('');
        setIsAddingScene(false);
    };

    const activeIdea = activeId ? ideas.find(i => i.id === activeId) : null;

    // Organize scenes
    const sortedScenes = [...scenes].sort((a, b) => a.order - b.order);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold gradient-text">Kanban Tahtası</h2>
                        <p className="text-slate-400 mt-1">
                            Fikirlerinizi sahnelere organize edin
                        </p>
                    </div>
                    <Button onClick={() => setIsAddingScene(!isAddingScene)}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Sahne
                    </Button>
                </div>

                {/* Add Scene Input */}
                {isAddingScene && (
                    <Card className="animate-scale-in">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSceneTitle}
                                onChange={(e) => setNewSceneTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddScene()}
                                placeholder="Sahne adı..."
                                className="flex-1 glass px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-indigo-500 outline-none"
                                autoFocus
                            />
                            <Button onClick={handleAddScene}>Ekle</Button>
                            <Button variant="ghost" onClick={() => setIsAddingScene(false)}>İptal</Button>
                        </div>
                    </Card>
                )}

                {/* Kanban Columns */}
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {/* Inbox Column */}
                    <KanbanColumn
                        id="inbox"
                        title="Fikir Havuzu"
                        ideas={ideas.filter(i => !i.sceneId)}
                        color="#6366f1"
                        isInbox
                    />

                    {/* Scene Columns */}
                    {sortedScenes.map((scene) => (
                        <KanbanColumn
                            key={scene.id}
                            id={scene.id}
                            title={scene.title}
                            ideas={ideas.filter(i => i.sceneId === scene.id)}
                            scene={scene}
                            onUpdateScene={onUpdateScene}
                        />
                    ))}
                </div>
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
                {activeIdea && (
                    <div className="drag-overlay">
                        <IdeaKanbanCard idea={activeIdea} isDragging />
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
};

// Kanban Column Component
interface KanbanColumnProps {
    id: string;
    title: string;
    ideas: Idea[];
    scene?: Scene;
    color?: string;
    isInbox?: boolean;
    onUpdateScene?: (scene: Scene) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
    id,
    title,
    ideas,
    scene,
    color = '#8b5cf6',
    isInbox = false,
    onUpdateScene
}) => {
    const { setNodeRef, isOver } = useSortable({
        id,
        data: { type: 'column' }
    });

    return (
        <div
            ref={setNodeRef}
            className={`
        flex-shrink-0 w-80 glass rounded-xl p-4 transition-all
        ${isOver ? 'drop-zone-active' : ''}
      `}
        >
            {/* Column Header */}
            <div className="mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ background: color }}
                        />
                        <h3 className="font-bold text-white">{title}</h3>
                    </div>
                    <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded">
                        {ideas.length}
                    </span>
                </div>
                {scene?.description && (
                    <p className="text-sm text-slate-400 mt-1">{scene.description}</p>
                )}
            </div>

            {/* Ideas List */}
            <SortableContext items={ideas.map(i => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 min-h-[200px]">
                    {ideas.map(idea => (
                        <SortableIdeaCard key={idea.id} idea={idea} />
                    ))}

                    {ideas.length === 0 && (
                        <div className="text-center py-8 text-slate-500 text-sm">
                            {isInbox ? 'Havuz boş' : 'Fikir sürükleyin'}
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
};

// Sortable Idea Card
const SortableIdeaCard: React.FC<{ idea: Idea }> = ({ idea }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: idea.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <IdeaKanbanCard idea={idea} isDragging={isDragging} />
        </div>
    );
};

// Idea Kanban Card
interface IdeaKanbanCardProps {
    idea: Idea;
    isDragging?: boolean;
}

const IdeaKanbanCard: React.FC<IdeaKanbanCardProps> = ({ idea, isDragging = false }) => {
    return (
        <div
            className={`
        glass rounded-lg p-3 cursor-grab active:cursor-grabbing
        transition-all hover:scale-105
        ${isDragging ? 'opacity-50' : ''}
      `}
            style={{
                borderLeft: `3px solid ${idea.color}`,
                background: `linear-gradient(135deg, ${idea.color}10 0%, transparent 100%)`
            }}
        >
            <h4 className="font-semibold text-white text-sm mb-1 line-clamp-2">
                {idea.title}
            </h4>
            <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                {idea.description}
            </p>
            <Badge status={idea.status} className="text-xs" />
        </div>
    );
};
