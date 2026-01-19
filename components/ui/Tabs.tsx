import React, { useState } from 'react';

interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
    onChange?: (tabId: string) => void;
    children: (activeTab: string) => React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
    tabs,
    defaultTab,
    onChange,
    children
}) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        onChange?.(tabId);
    };

    return (
        <div className="w-full">
            {/* Tab Headers */}
            <div className="flex gap-2 border-b border-white/10 mb-6">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`
                relative px-4 py-3 font-medium transition-all duration-200
                flex items-center gap-2
                ${isActive
                                    ? 'text-white'
                                    : 'text-slate-400 hover:text-slate-300'
                                }
              `}
                        >
                            {tab.icon}
                            {tab.label}

                            {/* Active indicator */}
                            {isActive && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
                {children(activeTab)}
            </div>
        </div>
    );
};
