'use client';

import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import type { Todo, TodoTemplate } from '@/lib/types';
import { TODO_TEMPLATES } from '@/lib/types';
import { format } from 'date-fns';

interface TodoListProps {
    todos: Todo[];
    onAddTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
    onUpdateTodo: (todo: Todo) => void;
    onDeleteTodo: (id: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
    todos,
    onAddTodo,
    onUpdateTodo,
    onDeleteTodo
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<TodoTemplate | null>(null);

    const handleSelectTemplate = (template: TodoTemplate) => {
        setSelectedTemplate(template);
        setIsModalOpen(true);
    };

    const handleCreateTodo = (title: string, priority: Todo['priority'], subtasks: string[], dueDate?: Date) => {
        const formattedSubtasks = subtasks.map(title => ({
            id: crypto.randomUUID(),
            title,
            completed: false
        }));

        onAddTodo({
            title,
            completed: false,
            priority,
            dueDate,
            subtasks: formattedSubtasks
        });

        setIsModalOpen(false);
        setSelectedTemplate(null);
    };

    const toggleTodo = (todo: Todo) => {
        const allSubtasksCompleted = todo.subtasks.every(st => st.completed);
        onUpdateTodo({
            ...todo,
            completed: !todo.completed,
            subtasks: todo.subtasks.map(st => ({ ...st, completed: !todo.completed }))
        });
    };

    const toggleSubtask = (todo: Todo, subtaskId: string) => {
        const updatedSubtasks = todo.subtasks.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );

        const allCompleted = updatedSubtasks.every(st => st.completed);

        onUpdateTodo({
            ...todo,
            subtasks: updatedSubtasks,
            completed: allCompleted
        });
    };

    const completedCount = todos.filter(t => t.completed).length;
    const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold gradient-text">Gelişmiş TODO Lista</h2>
                    <p className="text-slate-400 mt-1">
                        {completedCount}/{todos.length} görev tamamlandı
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Yeni Görev
                </Button>
            </div>

            {/* Progress Bar */}
            {todos.length > 0 && (
                <Card>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-300">İlerleme</span>
                            <span className="text-indigo-400 font-semibold">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </Card>
            )}

            {/* Templates Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {TODO_TEMPLATES.map(template => (
                    <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template)}
                        className="glass glass-hover p-4 rounded-lg text-left group"
                    >
                        <div className="text-2xl mb-2">
                            {template.id === 'equipment' && '🎥'}
                            {template.id === 'thumbnail' && '📸'}
                            {template.id === 'b-roll' && '🎬'}
                            {template.id === 'editing' && '✂️'}
                            {template.id === 'upload' && '⬆️'}
                        </div>
                        <h4 className="font-semibold text-white text-sm group-hover:text-indigo-400 transition-colors">
                            {template.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                            {template.subtasks.length} alt görev
                        </p>
                    </button>
                ))}
            </div>

            {/* Todos List */}
            <div className="space-y-3">
                {todos.length === 0 ? (
                    <Card>
                        <div className="text-center py-12 text-slate-400">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p>Henüz görev yok. Şablonlardan birini seçin!</p>
                        </div>
                    </Card>
                ) : (
                    todos.map(todo => (
                        <TodoCard
                            key={todo.id}
                            todo={todo}
                            onToggle={() => toggleTodo(todo)}
                            onToggleSubtask={(subtaskId) => toggleSubtask(todo, subtaskId)}
                            onDelete={() => onDeleteTodo(todo.id)}
                        />
                    ))
                )}
            </div>

            {/* Add/Edit Modal */}
            <TodoModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTemplate(null);
                }}
                template={selectedTemplate}
                onSave={handleCreateTodo}
            />
        </div>
    );
};

// Todo Card Component
interface TodoCardProps {
    todo: Todo;
    onToggle: () => void;
    onToggleSubtask: (subtaskId: string) => void;
    onDelete: () => void;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo, onToggle, onToggleSubtask, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const priorityColors = {
        low: 'text-green-400 bg-green-500/20',
        medium: 'text-yellow-400 bg-yellow-500/20',
        high: 'text-red-400 bg-red-500/20'
    };

    const completedSubtasks = todo.subtasks.filter(st => st.completed).length;

    return (
        <Card hover>
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                        onClick={onToggle}
                        className={`
              mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all
              ${todo.completed
                                ? 'bg-indigo-500 border-indigo-500'
                                : 'border-slate-600 hover:border-indigo-500'
                            }
            `}
                    >
                        {todo.completed && (
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </button>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <h4
                                className={`font-semibold text-lg ${todo.completed ? 'line-through text-slate-500' : 'text-white'
                                    }`}
                            >
                                {todo.title}
                            </h4>

                            <div className="flex gap-2">
                                {/* Priority Badge */}
                                <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[todo.priority]}`}>
                                    {todo.priority === 'high' ? 'Yüksek' : todo.priority === 'medium' ? 'Orta' : 'Düşük'}
                                </span>

                                <button
                                    onClick={onDelete}
                                    className="text-slate-400 hover:text-red-400 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Due Date & Subtasks Info */}
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                            {todo.dueDate && (
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {format(todo.dueDate, 'dd MMM yyyy')}
                                </span>
                            )}
                            {todo.subtasks.length > 0 && (
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="flex items-center gap-1 hover:text-white transition-colors"
                                >
                                    <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    {completedSubtasks}/{todo.subtasks.length} alt görev
                                </button>
                            )}
                        </div>

                        {/* Subtasks */}
                        {isExpanded && todo.subtasks.length > 0 && (
                            <div className="mt-3 pl-4 border-l-2 border-white/10 space-y-2">
                                {todo.subtasks.map(subtask => (
                                    <label key={subtask.id} className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={subtask.completed}
                                            onChange={() => onToggleSubtask(subtask.id)}
                                            className="w-4 h-4 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                                        />
                                        <span className={`text-sm ${subtask.completed ? 'line-through text-slate-500' : 'text-slate-300 group-hover:text-white'}`}>
                                            {subtask.title}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

interface TodoModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: TodoTemplate | null;
    onSave: (title: string, priority: Todo['priority'], subtasks: string[], dueDate?: Date) => void;
}

const TodoModal: React.FC<TodoModalProps> = ({ isOpen, onClose, template, onSave }) => {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<Todo['priority']>('medium');
    const [dueDate, setDueDate] = useState('');
    const [subtasks, setSubtasks] = useState<string[]>([]);
    const [newSubtaskInput, setNewSubtaskInput] = useState('');

    React.useEffect(() => {
        if (template) {
            setTitle(template.name);
            setSubtasks([...template.subtasks]);
        } else {
            setTitle('');
            setSubtasks([]);
        }
        setPriority('medium');
        setDueDate('');
        setNewSubtaskInput('');
    }, [template, isOpen]);

    const handleAddSubtask = () => {
        if (!newSubtaskInput.trim()) return;
        setSubtasks([...subtasks, newSubtaskInput.trim()]);
        setNewSubtaskInput('');
    };

    const handleRemoveSubtask = (index: number) => {
        setSubtasks(subtasks.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        onSave(
            title.trim(),
            priority,
            subtasks,
            dueDate ? new Date(dueDate) : undefined
        );

        setTitle('');
        setPriority('medium');
        setDueDate('');
        setSubtasks([]);
        setNewSubtaskInput('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={template ? `${template.name} Şablonu` : 'Yeni Görev'} size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Görev Adı</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full glass px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-indigo-500 outline-none"
                        placeholder="Görev başlığı..."
                        autoFocus
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Öncelik</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as Todo['priority'])}
                            className="w-full glass px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none"
                        >
                            <option value="low">Düşük</option>
                            <option value="medium">Orta</option>
                            <option value="high">Yüksek</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Teslim Tarihi</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full glass px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none"
                        />
                    </div>
                </div>

                {/* Subtasks Section */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300">
                        Alt Görevler ({subtasks.length})
                    </label>

                    {/* Add subtask input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newSubtaskInput}
                            onChange={(e) => setNewSubtaskInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                            placeholder="Alt görev ekle..."
                            className="flex-1 glass px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:border-indigo-500 outline-none text-sm"
                        />
                        <button
                            type="button"
                            onClick={handleAddSubtask}
                            className="px-4 py-2 glass-hover rounded-lg text-indigo-400 hover:text-indigo-300 border border-indigo-500/30"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>

                    {/* Subtasks list */}
                    {subtasks.length > 0 && (
                        <div className="glass rounded-lg p-3 bg-indigo-500/10 max-h-48 overflow-y-auto">
                            <ul className="space-y-2">
                                {subtasks.map((subtask, idx) => (
                                    <li key={idx} className="flex items-center justify-between gap-2 text-sm text-slate-300 group">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-3 h-3 text-indigo-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>{subtask}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSubtask(idx)}
                                            className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">Oluştur</Button>
                    <Button type="button" variant="ghost" onClick={onClose}>İptal</Button>
                </div>
            </form>
        </Modal>
    );
};
