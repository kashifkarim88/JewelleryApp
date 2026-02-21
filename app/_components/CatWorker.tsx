"use client"
import React, { useState } from 'react';
import { Briefcase, Tag, Plus, User, Hash, Type, Phone } from 'lucide-react';

type Mode = 'category' | 'worker';

export default function CatWorker() {
    const [mode, setMode] = useState<Mode>('category');

    return (
        <div className="p-6 md:p-8 bg-white">
            {/* Header Section */}
            <div className="mb-8">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Quick Add
                </h2>
                <p className="text-slate-500 text-xs font-medium mt-1">
                    Register a new entity to your database.
                </p>
            </div>

            {/* Segmented Toggle */}
            <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
                <button
                    onClick={() => setMode('category')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${mode === 'category'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Tag size={14} />
                    Category
                </button>
                <button
                    onClick={() => setMode('worker')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${mode === 'worker'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Briefcase size={14} />
                    Worker
                </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
                {mode === 'category' ? (
                    <>
                        <ModalInput label="Product Name" icon={Type} placeholder="e.g. Bracelet" />
                        <div className="grid grid-cols-2 gap-4">
                            <ModalInput label="Abbreviation" icon={Hash} placeholder="e.g. BR" />
                            <ModalInput label="Product Code" icon={Hash} placeholder="e.g. BR-101" />
                        </div>
                    </>
                ) : (
                    <>
                        <ModalInput label="Worker Name" icon={User} placeholder="Full Name" />
                        <ModalInput label="Contact" icon={Phone} placeholder="0334..." />
                        <ModalInput label="Worker Code" icon={Hash} placeholder="W-001" />
                    </>
                )}
            </div>

            {/* Action Button */}
            <button className="w-full mt-8 bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xl shadow-slate-100">
                <Plus size={18} strokeWidth={3} />
                <span className="text-sm uppercase tracking-widest">
                    Add {mode === 'category' ? 'Category' : 'Worker'}
                </span>
            </button>
        </div>
    );
}

// --- Local Sub-Component ---
interface ModalInputProps {
    label: string;
    icon: React.ElementType;
    placeholder: string;
}

function ModalInput({ label, icon: Icon, placeholder }: ModalInputProps) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                {label}
            </label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Icon size={16} />
                </div>
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                />
            </div>
        </div>
    );
}