import { useState, useEffect, useCallback } from 'react';
import type { Project } from '@/lib/types';
import { getProject, saveProject } from '@/lib/storage';

export function useProject(projectId: string | null) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProject = useCallback(async () => {
        if (!projectId) {
            setProject(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const loaded = await getProject(projectId);
            if (loaded) {
                // Migrate old projects to new schema
                if (!loaded.repurposingClips) {
                    loaded.repurposingClips = [];
                }
                if (!loaded.shotList) {
                    loaded.shotList = [];
                }
                if (!loaded.metadata.abTestVariants) {
                    loaded.metadata.abTestVariants = [];
                }
                setProject(loaded);
            } else {
                setProject(null);
            }
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load project');
            console.error('Error loading project:', err);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        loadProject();
    }, [loadProject]);

    async function updateProject(updates: Partial<Project>) {
        if (!project) return;

        const updatedProject = {
            ...project,
            ...updates,
            updatedAt: new Date()
        };

        setProject(updatedProject);

        try {
            await saveProject(updatedProject);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save project');
        }
    }

    return {
        project,
        loading,
        error,
        updateProject,
        reload: loadProject
    };
}
