'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';
import { IdeaInbox } from '@/components/IdeaInbox';
import { AssetDrawer } from '@/components/AssetDrawer';
import { AssetPool } from '@/components/AssetPool';
import { HookTimeline } from '@/components/HookTimeline';
import { MetadataPanel } from '@/components/MetadataPanel';
import { TodoList } from '@/components/TodoList';
import { HookLibrary } from '@/components/HookLibrary';
import { RepurposingPanel } from '@/components/RepurposingPanel';
import { ShotListMode } from '@/components/ShotListMode';
import { YouTubePreview } from '@/components/YouTubePreview';
import { useProject } from '@/hooks/useProject';
import { useAutoSave } from '@/hooks/useAutoSave';
import { getAllProjects, createNewProject, exportProjectAsJSON, importProjectFromJSON } from '@/lib/storage';
import type { Project, Idea, Scene, Asset, Todo, IdeaStatus, TimelineItem, TimelineTrack, RepurposingClip, ShotListItem, YouTubePreviewVariant, HookFramework } from '@/lib/types';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isAssetDrawerOpen, setIsAssetDrawerOpen] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [isHookLibraryOpen, setIsHookLibraryOpen] = useState(false);

  const { project, loading, updateProject, reload } = useProject(currentProjectId);

  // Auto-save
  useAutoSave(project, async (project) => {
    if (project) {
      await updateProject(project);
    }
  });

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const allProjects = await getAllProjects();

    // Auto-create first project if none exist
    if (allProjects.length === 0) {
      const newProject = await createNewProject('İlk Projem');
      setProjects([newProject]);
      setCurrentProjectId(newProject.id);
      return;
    }

    setProjects(allProjects);
    if (allProjects.length > 0 && !currentProjectId) {
      setCurrentProjectId(allProjects[0].id);
    }
  }

  async function handleCreateProject() {
    const name = prompt('Proje adı:');
    if (!name) return;

    const newProject = await createNewProject(name);
    setProjects([...projects, newProject]);
    setCurrentProjectId(newProject.id);
    setShowProjectSelector(false);
  }

  async function handleExport() {
    if (!project) return;
    const json = await exportProjectAsJSON(project.id);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const text = await file.text();
      const imported = await importProjectFromJSON(text);
      setProjects([...projects, imported]);
      setCurrentProjectId(imported.id);
    };
    input.click();
  }

  // Idea handlers
  const handleAddIdea = async (ideaData: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!project) return;

    const newIdea: Idea = {
      ...ideaData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await updateProject({
      ideas: [...project.ideas, newIdea]
    });
  };

  const handleUpdateIdea = async (idea: Idea) => {
    if (!project) return;

    await updateProject({
      ideas: project.ideas.map(i => i.id === idea.id ? { ...idea, updatedAt: new Date() } : i)
    });
  };

  const handleDeleteIdea = async (id: string) => {
    if (!project) return;

    await updateProject({
      ideas: project.ideas.filter(i => i.id !== id)
    });
  };

  // Scene handlers
  const handleAddScene = async (sceneData: Omit<Scene, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!project) return;

    const newScene: Scene = {
      ...sceneData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await updateProject({
      scenes: [...project.scenes, newScene]
    });
  };

  const handleUpdateScene = async (scene: Scene) => {
    if (!project) return;

    await updateProject({
      scenes: project.scenes.map(s => s.id === scene.id ? { ...scene, updatedAt: new Date() } : s)
    });
  };

  // Asset handlers
  const handleAddAsset = async (assetData: Omit<Asset, 'id' | 'createdAt'>) => {
    if (!project) return;

    const newAsset: Asset = {
      ...assetData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };

    await updateProject({
      assets: [...project.assets, newAsset]
    });
  };

  const handleDeleteAsset = async (id: string) => {
    if (!project) return;

    await updateProject({
      assets: project.assets.filter(a => a.id !== id)
    });
  };

  // Todo handlers
  const handleAddTodo = async (todoData: Omit<Todo, 'id' | 'createdAt'>) => {
    if (!project) return;

    const newTodo: Todo = {
      ...todoData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };

    await updateProject({
      todos: [...project.todos, newTodo]
    });
  };

  const handleUpdateTodo = async (todo: Todo) => {
    if (!project) return;

    await updateProject({
      todos: project.todos.map(t => t.id === todo.id ? todo : t)
    });
  };

  const handleDeleteTodo = async (id: string) => {
    if (!project) return;

    await updateProject({
      todos: project.todos.filter(t => t.id !== id)
    });
  };

  // Repurposing clip handlers
  const handleAddRepurposingClip = async (clipData: Omit<RepurposingClip, 'id' | 'createdAt'>) => {
    if (!project) return;

    const newClip: RepurposingClip = {
      ...clipData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };

    await updateProject({
      repurposingClips: [...project.repurposingClips, newClip]
    });
  };

  const handleUpdateRepurposingClip = async (clip: RepurposingClip) => {
    if (!project) return;

    await updateProject({
      repurposingClips: project.repurposingClips.map(c => c.id === clip.id ? clip : c)
    });
  };

  const handleDeleteRepurposingClip = async (id: string) => {
    if (!project) return;

    await updateProject({
      repurposingClips: project.repurposingClips.filter(c => c.id !== id)
    });
  };

  // Shot list handlers
  const handleUpdateShotList = async (shotList: ShotListItem[]) => {
    if (!project) return;

    await updateProject({ shotList });
  };

  // YouTube preview variant handlers
  const handleAddYouTubeVariant = async (variantData: Omit<YouTubePreviewVariant, 'id'>) => {
    if (!project) return;

    const newVariant: YouTubePreviewVariant = {
      ...variantData,
      id: crypto.randomUUID()
    };

    const updatedVariants = [...(project.metadata.abTestVariants || []), newVariant];

    await updateProject({
      metadata: {
        ...project.metadata,
        abTestVariants: updatedVariants
      }
    });
  };

  const handleUpdateYouTubeVariant = async (variant: YouTubePreviewVariant) => {
    if (!project) return;

    const updatedVariants = (project.metadata.abTestVariants || []).map(v =>
      v.id === variant.id ? variant : v
    );

    await updateProject({
      metadata: {
        ...project.metadata,
        abTestVariants: updatedVariants
      }
    });
  };

  const handleDeleteYouTubeVariant = async (id: string) => {
    if (!project) return;

    const updatedVariants = (project.metadata.abTestVariants || []).filter(v => v.id !== id);

    await updateProject({
      metadata: {
        ...project.metadata,
        abTestVariants: updatedVariants
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }


  if (!project) return null;

  const tabs = [
    { id: 'inbox', label: 'Fikir Havuzu', icon: '📝' },
    { id: 'hooks', label: 'Hook Library', icon: '🎣' },
    { id: 'timeline', label: 'Timeline', icon: '🎬' },
    { id: 'repurposing', label: 'Repurposing', icon: '♻️' },
    { id: 'shotlist', label: 'Shot List', icon: '📋' },
    { id: 'assets', label: 'Asset Pool', icon: '📦' },
    { id: 'metadata', label: 'Metadata', icon: '🏷️' },
    { id: 'todos', label: 'TODO', icon: '✅' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="glass border-b border-white/10 sticky top-0 z-30 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold gradient-text">🎬 Video Production</h1>
              <button
                onClick={() => setShowProjectSelector(!showProjectSelector)}
                className="glass glass-hover px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <span className="text-white font-medium">{project.name}</span>
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={handleExport}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </Button>
              <Button variant="ghost" onClick={handleImport}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import
              </Button>
            </div>
          </div>

        </div>

        {/* Project Selector Dropdown */}
        {showProjectSelector && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 glass rounded-xl p-3 min-w-[300px] shadow-2xl animate-scale-in z-50">
            <div className="space-y-2">
              {projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setCurrentProjectId(p.id);
                    setShowProjectSelector(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all ${p.id === currentProjectId
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'glass-hover text-slate-300'
                    }`}
                >
                  {p.name}
                </button>
              ))}
              <button
                onClick={handleCreateProject}
                className="w-full glass-hover px-4 py-2 rounded-lg text-indigo-400 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Yeni Proje
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs
          tabs={tabs.map(t => ({ id: t.id, label: t.label, icon: <span>{t.icon}</span> }))}
          defaultTab="inbox"
        >
          {(activeTab) => (
            <div className="animate-fade-in">
              {activeTab === 'inbox' && (
                <IdeaInbox
                  ideas={project.ideas}
                  onAddIdea={handleAddIdea}
                  onUpdateIdea={handleUpdateIdea}
                  onDeleteIdea={handleDeleteIdea}
                />
              )}

              {activeTab === 'hooks' && (
                <HookLibrary />
              )}



              {activeTab === 'timeline' && (
                <HookTimeline
                  timeline={project.scenes[0]?.timeline || []}
                  videoDuration={project.scenes[0]?.duration || 300}
                  onUpdateTimeline={(timeline) => {
                    if (project.scenes[0]) {
                      handleUpdateScene({ ...project.scenes[0], timeline });
                    } else {
                      handleAddScene({
                        title: 'Main Scene',
                        description: '',
                        order: 0,
                        ideas: [],
                        assets: [],
                        todos: [],
                        timeline
                      });
                    }
                  }}
                />
              )}

              {activeTab === 'repurposing' && (
                <RepurposingPanel
                  timelineSections={project.scenes[0]?.timeline || []}
                  repurposingClips={project.repurposingClips || []}
                  onAddClip={handleAddRepurposingClip}
                  onUpdateClip={handleUpdateRepurposingClip}
                  onDeleteClip={handleDeleteRepurposingClip}
                />
              )}

              {activeTab === 'shotlist' && (
                <ShotListMode
                  timelineSections={project.scenes[0]?.timeline || []}
                  shotList={project.shotList || []}
                  onUpdateShotList={handleUpdateShotList}
                />
              )}

              {activeTab === 'assets' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold gradient-text">📦 Asset Pool</h2>
                    <p className="text-slate-400 mt-1">
                      Video, görsel ve ses materyallerinizi yönetin
                    </p>
                  </div>
                  <AssetPool
                    assets={project.assets}
                    onDragStart={(asset) => {
                      // Future: implement drag to timeline
                    }}
                    onAddAsset={() => setIsAssetDrawerOpen(true)}
                  />
                </div>
              )}

              {activeTab === 'metadata' && (
                <div>
                  <MetadataPanel
                    metadata={project.metadata}
                    onUpdateMetadata={(metadata) => updateProject({ metadata })}
                  />

                  <div className="mt-8">
                    <YouTubePreview
                      variants={project.metadata.abTestVariants || []}
                      onAddVariant={handleAddYouTubeVariant}
                      onUpdateVariant={handleUpdateYouTubeVariant}
                      onDeleteVariant={handleDeleteYouTubeVariant}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'todos' && (
                <TodoList
                  todos={project.todos}
                  onAddTodo={handleAddTodo}
                  onUpdateTodo={handleUpdateTodo}
                  onDeleteTodo={handleDeleteTodo}
                />
              )}
            </div>
          )}
        </Tabs>
      </main>

      {/* Asset Drawer */}
      <AssetDrawer
        assets={project.assets}
        isOpen={isAssetDrawerOpen}
        onClose={() => setIsAssetDrawerOpen(false)}
        onAddAsset={handleAddAsset}
        onDeleteAsset={handleDeleteAsset}
      />
    </div>
  );
}
