"use client"
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleProps {
    icon: React.ElementType;
    title: string;
    color: 'cyan' | 'blue' | 'purple';
    children: React.ReactNode;
}

export const CollapsibleSection = ({ icon: Icon, title, color, children }: CollapsibleProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const colorMap: Record<string, string> = {
        cyan: "text-cyan-600 bg-cyan-50 border-cyan-100",
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        purple: "text-purple-600 bg-purple-50 border-purple-100"
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-2 transition-all">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-2.5 hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-md border ${colorMap[color]}`}>
                        <Icon size={12} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-700">
                        {title}
                    </span>
                </div>
                <ChevronDown
                    size={12}
                    className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-150 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="p-3 pt-0 border-t border-slate-50">
                    {children}
                </div>
            </div>
        </div>
    );
};