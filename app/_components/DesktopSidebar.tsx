"use client"
import React from 'react';
import { House, Box, FileText } from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tabName: string) => void;
}

export default function DesktopSidebar({ activeTab, setActiveTab }: SidebarProps) {
    const menuItems = [
        { name: 'Home', icon: <House size={20} /> },
        { name: 'Stock', icon: <Box size={20} /> },
        { name: 'Invoice', icon: <FileText size={20} /> },
    ];

    return (
        <div className="bg-gray-50 p-5 border-r-2 border-gray-300 w-64 h-full">
            <ul className="mt-3 space-y-2">
                {menuItems.map((item) => (
                    <li key={item.name}>
                        <button
                            onClick={() => setActiveTab(item.name)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === item.name
                                ? 'bg-gray-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                }`}
                        >
                            <span>{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}