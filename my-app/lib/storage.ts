import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Project, Idea, Scene, Asset, Todo } from './types';

interface VideoProductionDB extends DBSchema {
    projects: {
        key: string;
        value: Project;
        indexes: { 'by-date': Date };
    };
}

const DB_NAME = 'video-production-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<VideoProductionDB> | null = null;

export async function initDB(): Promise<IDBPDatabase<VideoProductionDB>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<VideoProductionDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Projects store
            const projectStore = db.createObjectStore('projects', {
                keyPath: 'id'
            });
            projectStore.createIndex('by-date', 'updatedAt');
        },
    });

    return dbInstance;
}

// Project CRUD operations
export async function getAllProjects(): Promise<Project[]> {
    const db = await initDB();
    return db.getAllFromIndex('projects', 'by-date');
}

export async function getProject(id: string): Promise<Project | undefined> {
    const db = await initDB();
    return db.get('projects', id);
}

export async function saveProject(project: Project): Promise<void> {
    const db = await initDB();
    project.updatedAt = new Date();
    await db.put('projects', project);
}

export async function deleteProject(id: string): Promise<void> {
    const db = await initDB();
    await db.delete('projects', id);
}

export async function createNewProject(name: string, description: string = ''): Promise<Project> {
    const project: Project = {
        id: crypto.randomUUID(),
        name,
        description,
        ideas: [],
        scenes: [],
        assets: [],
        todos: [],
        metadata: {
            titles: [],
            thumbnails: [],
            tags: [],
            notes: ''
        },
        repurposingClips: [],
        shotList: [],
        createdAt: new Date(),
        updatedAt: new Date()
    };

    await saveProject(project);
    return project;
}

// Export/Import functions
export async function exportProjectAsJSON(projectId: string): Promise<string> {
    const project = await getProject(projectId);
    if (!project) throw new Error('Project not found');
    return JSON.stringify(project, null, 2);
}

export async function importProjectFromJSON(jsonString: string): Promise<Project> {
    const project = JSON.parse(jsonString) as Project;

    // Convert date strings back to Date objects
    project.createdAt = new Date(project.createdAt);
    project.updatedAt = new Date(project.updatedAt);

    project.ideas = project.ideas.map(idea => ({
        ...idea,
        createdAt: new Date(idea.createdAt),
        updatedAt: new Date(idea.updatedAt)
    }));

    project.scenes = project.scenes.map(scene => ({
        ...scene,
        createdAt: new Date(scene.createdAt),
        updatedAt: new Date(scene.updatedAt)
    }));

    project.assets = project.assets.map(asset => ({
        ...asset,
        createdAt: new Date(asset.createdAt)
    }));

    project.todos = project.todos.map(todo => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
    }));

    // Handle repurposing clips
    if (project.repurposingClips) {
        project.repurposingClips = project.repurposingClips.map(clip => ({
            ...clip,
            createdAt: new Date(clip.createdAt)
        }));
    } else {
        project.repurposingClips = [];
    }

    // Handle shot list (no date fields currently)
    if (!project.shotList) {
        project.shotList = [];
    }

    await saveProject(project);
    return project;
}

// LocalStorage for app settings
export function getSetting<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;

    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch {
        return defaultValue;
    }
}

export function setSetting<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;

    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}
