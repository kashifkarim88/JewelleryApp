"use client"
import React from 'react';
import { Tag, Plus, Hash, Type } from 'lucide-react';

export default function CategoryForm() {
    return (
        <div className="p-6 md:p-8 bg-white">
            <div className="mb-8">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <Tag size={20} className="text-blue-600" />
                    New Category
                </h2>
                <p className="text-slate-500 text-xs font-medium mt-1">
                    Register a new product type to your inventory database.
                </p>
            </div>

            <div className="space-y-5">
                <ModalInput label="Product Name" icon={Type} placeholder="e.g. Bracelet" />
                <div className="grid grid-cols-2 gap-4">
                    <ModalInput label="Abbreviation" icon={Hash} placeholder="e.g. BR" />
                    <ModalInput label="Product Code" icon={Hash} placeholder="e.g. BR-101" />
                </div>
            </div>

            <button className="w-full mt-8 bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xl shadow-slate-100">
                <Plus size={18} strokeWidth={3} />
                <span className="text-sm uppercase tracking-widest">Add Category</span>
            </button>
        </div>
    );
}

// Sub-component for inputs
function ModalInput({ label, icon: Icon, placeholder }: { label: string; icon: any; placeholder: string }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
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