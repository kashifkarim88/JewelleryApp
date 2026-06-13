"use client";

import React, { useState } from 'react';
import { Gem, Plus, Type, CheckCircle2 } from 'lucide-react';

interface StoneFormProps {
    onStoneCreated?: () => void; // 🚩 Destructure the execution pipeline callback
}

export default function StoneForm({ onStoneCreated }: StoneFormProps) {
    const [stoneName, setStoneName] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stoneName.trim()) return;

        try {
            setLoading(true);

            // 📝 Swap out with your accurate database API endpoint when ready
            const res = await fetch("/api/stones", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: stoneName.trim() }),
            });

            if (res.ok) {
                setSuccess(true);
                setStoneName("");

                // 🚩 Notify StockModals -> StockPage to execute background data update
                if (onStoneCreated) onStoneCreated();
            }
        } catch (err) {
            console.error("Failed to register new stone type:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white max-w-md mx-auto rounded-3xl">
            <div className="mb-6">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <Gem size={20} className="text-blue-600" />
                    New Stone Type
                </h2>
                <p className="text-xs text-slate-500 mt-1">Register a custom gemstone variety to the inventory matrix.</p>
            </div>

            {success && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-xs flex items-center gap-2">
                    <CheckCircle2 size={14} /> Gemstone variant added successfully!
                </div>
            )}

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Stone Name</label>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Type size={16} /></div>
                    <input
                        type="text"
                        value={stoneName}
                        onChange={(e) => setStoneName(e.target.value)}
                        placeholder="e.g. Ruby, Emerald, Sapphire"
                        className="w-full pl-11 pr-4 py-3.5 border border-slate-100 rounded-2xl outline-none text-sm font-medium bg-slate-50 focus:bg-white focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || !stoneName.trim()}
                className="w-full mt-6 bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl"
            >
                <Plus size={18} strokeWidth={3} />
                <span className="text-sm uppercase tracking-widest">{loading ? "Adding..." : "Add Stone Variant"}</span>
            </button>
        </form>
    );
}